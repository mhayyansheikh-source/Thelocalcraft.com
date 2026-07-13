"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { db, auth } from "@/lib/firebase/config"
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc, addDoc, deleteDoc, orderBy } from "firebase/firestore"
import { signOut, onAuthStateChanged } from "firebase/auth"
import {
    User,
    Lock,
    Sparkles,
    Hammer,
    ChevronRight,
    LogOut,
    Eye,
    TrendingUp,
    Star,
    LayoutDashboard,
    Package,
    Settings,
    MapPin,
    Calendar,
    Award,
    Mic,
    Loader,
    CheckCircle,
    Plus,
    Edit2,
    Trash2,
    Image as ImageIcon,
    DollarSign,
    ListFilter,
    Save,
    AlertCircle,
    Clock,
    BookOpen,
    Video,
    Handshake
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DynamicLightingBackground } from "@/components/artisan/DynamicLightingBackground"
import { B2BNegotiationRoom } from "@/components/artisan/B2BNegotiationRoom"
import { useCurrency } from "@/context/CurrencyContext"

export default function ArtisanDashboard() {
    const { formatPrice } = useCurrency()
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isRecording, setIsRecording] = useState(false)
    const [isGeneratingStory, setIsGeneratingStory] = useState(false)
    const [recordedStory, setRecordedStory] = useState<string | null>(null)
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'crafts' | 'wiki' | 'live' | 'wholesale'>('dashboard')
    const [isSaving, setIsSaving] = useState(false)
    const [settingForm, setSettingForm] = useState({
        full_name: "",
        bio: "",
        location: "",
        specialty: ""
    })

    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [showAddCraft, setShowAddCraft] = useState(false)
    const [editingCraftId, setEditingCraftId] = useState<string | null>(null)
    const [isSavingCraft, setIsSavingCraft] = useState(false)
    const [craftForm, setCraftForm] = useState({
        title: "",
        description: "",
        price: 0,
        stock: 10,
        category_id: "",
        region: "Punjab",
        image_url: ""
    })

    const [stats, setStats] = useState({ impressions: 0, rating: 0, activeCollections: 0 })
    const [gamification, setGamification] = useState({ points: 0, tier: 'Apprentice', nextTierPts: 250, progress: 0 })

    const [wikiArticles, setWikiArticles] = useState<any[]>([])
    const [showAddWiki, setShowAddWiki] = useState(false)
    const [editingWikiId, setEditingWikiId] = useState<string | null>(null)
    const [isSavingWiki, setIsSavingWiki] = useState(false)
    const [wikiForm, setWikiForm] = useState({
        title: "",
        content: "",
        category: "Ceramics",
        image_url: "",
        heritage_site: "Multan"
    })

    const [liveFeeds, setLiveFeeds] = useState<any[]>([])
    const [showAddFeed, setShowAddFeed] = useState(false)
    const [isSavingFeed, setIsSavingFeed] = useState(false)
    const [feedForm, setFeedForm] = useState({ video_url: "", caption: "", is_live: false })


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true)
            setError(null)
            try {
                if (!user) {
                router.push("/login")
                return
            }
            setUser(user)

            // Fetch profile for the artisan
            const pSnap = await getDoc(doc(db, "profiles", user.uid))
            const profile = pSnap.exists() ? { id: pSnap.id, ...(pSnap.data() as any) } : null

            if (profile) {
                setProfile(profile)
                if (profile.role !== "artisan") {
                    await signOut(auth)
                    router.push("/login")
                    return
                }

                if (profile.status === 'pending' || profile.status === 'rejected') {
                    setLoading(false)
                    return // Stop data fetch for unapproved users
                }

                setSettingForm({
                    full_name: profile.full_name || "",
                    bio: profile.bio || "",
                    location: profile.location || "",
                    specialty: profile.specialty || ""
                })
            }

            // Fetch recent orders for this artisan
            const oQ = query(collection(db, "order_items"), where("artisan_id", "==", user.uid), orderBy("created_at", "desc"))
            const oSnap = await getDocs(oQ)
            const myOrders: any[] = []
            for (const d of oSnap.docs) {
                const item = d.data()
                if (item.order_id) {
                    const oSnap2 = await getDoc(doc(db, "orders", item.order_id))
                    if (oSnap2.exists()) item.orders = { id: oSnap2.id, ...oSnap2.data() }
                }
                if (item.product_id) {
                    const pSnap2 = await getDoc(doc(db, "products", item.product_id))
                    if (pSnap2.exists()) item.product = { id: pSnap2.id, ...pSnap2.data() }
                }
                myOrders.push({ id: d.id, ...item })
            }

            // Fetch categories
            const catSnap = await getDocs(collection(db, 'categories')); const catData = catSnap.docs.map(d => ({ id: d.id, ...d.data() }))
            if (catData) setCategories(catData)

            // Fetch products for artisan
            let artisanProductsCount = 0;
            const prodSnap = await getDocs(query(collection(db, 'products'), where('artisan_id', '==', user.uid))); const prodData = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }))
            if (prodData) {
                setProducts(prodData)
                artisanProductsCount = prodData.length;
            }

            if (myOrders) setOrders(myOrders)

            // Calculate Live Stats
            let currentRating = 5.0; // Default new artisans to 5

            // Fetch reviews for products by this artisan
            
            if (prodData && prodData.length > 0) {
                const productIds = prodData.map(p => p.id);
                const reviewsData: any[] = [];
                for (const pid of productIds) {
                    const rSnap = await getDocs(query(collection(db, 'reviews'), where('product_id', '==', pid)));
                    reviewsData.push(...rSnap.docs.map(d => d.data()));
                }
                if (reviewsData && reviewsData.length > 0) {
                    const sum = reviewsData.reduce((acc, curr) => acc + curr.rating, 0);
                    currentRating = sum / reviewsData.length;
                }
            }

            // Simulated impressions: orders * 42 + products * 123 + base 145
            const impressionsNum = (myOrders?.length || 0) * 42 + artisanProductsCount * 123 + 145;

            setStats({
                impressions: impressionsNum,
                rating: Number(currentRating.toFixed(1)),
                activeCollections: artisanProductsCount
            })

            // Calculate Gamification Live
            const currentPoints = (myOrders?.length || 0) * 50 + artisanProductsCount * 20 + 25; // Base 25

            let currentTier = 'Apprentice';
            let nextPts = 250;
            if (currentPoints >= 5000) { currentTier = 'Grandmaster'; nextPts = 5000; }
            else if (currentPoints >= 1000) { currentTier = 'Master Artisan'; nextPts = 5000; }
            else if (currentPoints >= 250) { currentTier = 'Artisan'; nextPts = 1000; }

            const progressRatio = currentTier === 'Grandmaster' ? 100 : Math.min(100, (currentPoints / nextPts) * 100);

            setGamification({
                points: currentPoints,
                tier: currentTier,
                nextTierPts: nextPts,
                progress: progressRatio
            })

            // Silently persist mastery to public DB for global storefront retrieval
            updateDoc(doc(db, 'artisans', user.uid), { mastery_tier: currentTier, mastery_points: currentPoints }).catch(e => console.error(e));

            // Fetch Wiki Articles
            const wSnap = await getDocs(query(collection(db, 'craftpedia_articles'), where('author_id', '==', user.uid))); const wikiData = wSnap.docs.map(d => ({ id: d.id, ...d.data() }))
            if (wikiData) setWikiArticles(wikiData)

            // Fetch Live Feeds
            const fSnap = await getDocs(query(collection(db, 'artisan_feeds'), where('artisan_id', '==', user.uid), where('status', '==', 'active'))); const feedData = fSnap.docs.map(d => ({ id: d.id, ...d.data() }))
            if (feedData) setLiveFeeds(feedData)

            setLoading(false)
            } catch (err: any) {
                console.error("Dashboard Load Error:", err)
                setError(err.message || "Failed to load dashboard")
                setLoading(false)
            }
        })
        return () => unsubscribe()
    }, [router])

    const handleVoiceToStory = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (!SpeechRecognition) {
            alert("Your browser does not support heritage voice dictation. Please use Chrome or Safari.")
            return
        }

        const recognition = new SpeechRecognition()
        recognition.lang = 'en-US'
        recognition.interimResults = false
        recognition.maxAlternatives = 1

        setIsRecording(true)
        setRecordedStory(null)

        recognition.start()

        recognition.onresult = async (event: any) => {
            const transcript = event.results[0][0].transcript
            setIsRecording(false)
            setIsGeneratingStory(true)

            try {
                const response = await fetch('/api/ai/story', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transcript }),
                });

                if (!response.ok) throw new Error('API Error');

                const data = await response.json();

                if (data?.story) {
                    setRecordedStory(data.story.replace(/^"|"$/g, ''))
                } else {
                    setRecordedStory("Your beautiful story could not be generated at this time. Please try again.")
                }
            } catch (err: any) {
                console.warn("AI Generation Failed, using deterministic offline fallback.", err)
                // Intelligent fallback string based on the raw transcript if HF key is missing
                setRecordedStory(`[Offline Draft] Based on your voice notes (${transcript.substring(0, 30)}...), this masterwork represents generations of perfected technique. The intricate details and rich heritage shine through, making it a timeless addition to any collection.`)
            } finally {
                setIsGeneratingStory(false)
            }
        }

        recognition.onerror = (event: any) => {
            console.error("Speech Recognition Error", event.error)
            setIsRecording(false)
            alert("Microphone capture failed. Please ensure you have granted microphone permissions.")
        }
    }

    const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
        if (!orderId) return;
        try {
            await updateDoc(doc(db, 'orders', orderId), { status: newStatus }); const error = null;
            if (error) throw error

            setOrders(orders.map(o => {
                if (o.orders?.id === orderId) {
                    return { ...o, orders: { ...o.orders, status: newStatus } }
                }
                return o
            }))
        } catch (error: any) {
            console.error("Status Update Failed", error)
            alert("Could not update order status.")
        }
    }

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            // Update auth profiles metadata
            await updateDoc(doc(db, "profiles", user.uid), {
                full_name: settingForm.full_name,
                bio: settingForm.bio,
                location: settingForm.location,
                specialty: settingForm.specialty
            })

            // Update purely public artisans table for matching
            await setDoc(doc(db, "artisans", user.uid), {
                full_name: settingForm.full_name,
                bio: settingForm.bio,
                location: settingForm.location,
                specialty: settingForm.specialty
            }, { merge: true })

            setProfile((prev: any) => ({ ...prev, ...settingForm }))
            alert("Studio Settings Updated Successfully!")
        } catch (error: any) {
            console.error("Failed to update profile", error)
            alert("Error updating profile.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleSaveCraft = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSavingCraft(true)
        try {
            const formData = {
                title: craftForm.title,
                description: craftForm.description,
                price: Number(craftForm.price),
                stock: Number(craftForm.stock),
                category_id: craftForm.category_id || null,
                region: craftForm.region || "Punjab",
                image_url: craftForm.image_url,
                artisan_id: user.uid
            }

            let savedProduct: any = null;

            if (editingCraftId) {
                await updateDoc(doc(db, 'products', editingCraftId), formData); const data = { id: editingCraftId, ...formData }; const error = null;
                if (error) throw error
                savedProduct = data
                setProducts(products.map(p => p.id === editingCraftId ? { ...p, ...formData } : p))
            } else {
                const docRef = await addDoc(collection(db, 'products'), formData); const data = { id: docRef.id, ...formData }; const error = null;
                if (error) throw error
                savedProduct = data
                if (data) setProducts([data, ...products])
            }

            // --- Generate AI Semantic Vector Signature ---
            try {
                const encodeString = `${formData.title} ${formData.description} ${formData.region}`;
                const embedData = null as any; const embedError = null;

                if (!embedError && embedData?.embedding && savedProduct) {
                    
                    console.log("AI semantic vector attached.")
                }
            } catch (err: any) {
                console.warn("Could not encode vector signature, skipping AI attach:", err)
            }
            // ---------------------------------------------

            setShowAddCraft(false)
            setEditingCraftId(null)
            setCraftForm({ title: "", description: "", price: 0, stock: 10, category_id: "", region: "Punjab", image_url: "" })
        } catch (error: any) {
            console.error("Failed to save craft:", error)
            alert(error.message || "Error saving craft.")
        } finally {
            setIsSavingCraft(false)
        }
    }

    const editCraft = (craft: any) => {
        setEditingCraftId(craft.id)
        setCraftForm({
            title: craft.title || "",
            description: craft.description || "",
            price: craft.price || 0,
            stock: craft.stock || 10,
            category_id: craft.category_id || "",
            region: craft.region || "Punjab",
            image_url: craft.image_url || ""
        })
        setShowAddCraft(true)
    }

    const handleDeleteCraft = async (id: string) => {
        if (!confirm("Are you sure you want to permanently remove this piece from the national catalog?")) return
        try {
            await deleteDoc(doc(db, 'products', id)); const error = null;
            if (error) throw error
            setProducts(products.filter(p => p.id !== id))
        } catch (error: any) {
            console.error("Delete Error", error)
            alert("Error deleting craft.")
        }
    }

    const handleSaveWikiArticle = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSavingWiki(true)
        try {
            const slug = wikiForm.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            const formData = {
                ...wikiForm,
                slug,
                author_id: user.uid,
                status: 'published'
            }

            if (editingWikiId) {
                await updateDoc(doc(db, 'craftpedia_articles', editingWikiId), formData); const error = null;
                if (error) throw error
                setWikiArticles(wikiArticles.map(a => a.id === editingWikiId ? { ...a, ...formData } : a))
            } else {
                const docRef = await addDoc(collection(db, 'craftpedia_articles'), formData); const data = { id: docRef.id, ...formData }; const error = null;
                if (error) throw error
                if (data) setWikiArticles([data, ...wikiArticles])
            }

            setShowAddWiki(false)
            setEditingWikiId(null)
            setWikiForm({ title: "", content: "", category: "Ceramics", image_url: "", heritage_site: "Multan" })
        } catch (error: any) {
            console.error("Failed to save wiki article:", error)
            alert(error.message || "Error saving article.")
        } finally {
            setIsSavingWiki(false)
        }
    }

    const deleteWikiArticle = async (id: string) => {
        if (!confirm("Are you sure you want to remove this documentation from the archive?")) return
        try {
            await deleteDoc(doc(db, 'craftpedia_articles', id)); const error = null;
            if (error) throw error
            setWikiArticles(wikiArticles.filter(a => a.id !== id))
        } catch (error: any) {
            console.error("Delete Error", error)
            alert("Error deleting article.")
        }
    }

    const handleSaveLiveFeed = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSavingFeed(true)
        try {
            const feedData = {
                ...feedForm,
                artisan_id: user.uid,
                status: 'active'
            };
            const docRef = await addDoc(collection(db, 'artisan_feeds'), feedData);
            const data = { id: docRef.id, ...feedData };
            const error = null;
            if (error) throw error
            if (data) setLiveFeeds([data, ...liveFeeds])
            setShowAddFeed(false)
            setFeedForm({ video_url: "", caption: "", is_live: false })
        } catch (error: any) {
            console.error("Failed to post feed:", error)
            alert(error.message || "Error posting live story.")
        } finally {
            setIsSavingFeed(false)
        }
    }

    const deleteFeed = async (id: string) => {
        if (!confirm("Are you sure you want to remove this studio story?")) return
        try {
            await updateDoc(doc(db, 'artisan_feeds', id), { status: 'archived' }); const error = null;
            if (error) throw error
            setLiveFeeds(liveFeeds.filter(f => f.id !== id))
        } catch (error: any) {
            console.error("Delete Error", error)
            alert("Error removing story.")
        }
    }

    const handleLogout = async () => {
        await signOut(auth)
        router.push("/")
    }

    if (loading) return (
        <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Syncing Heritage...</span>
            </div>
        </div>
    )

    if (error) {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex flex-column">
                <Navbar />
                <main className="container flex-grow-1 d-flex align-items-center justify-content-center py-5 mt-5">
                    <div className="text-center p-5 rounded-5 border border-danger border-opacity-25 bg-white bg-opacity-5 shadow-lg w-100" style={{ maxWidth: "600px", backdropFilter: "blur(10px)" }}>
                        <div className="mb-4 d-inline-block rounded-circle p-4 bg-danger bg-opacity-10 text-danger shadow">
                            <AlertCircle size={48} />
                        </div>
                        <h2 className="fw-bold mb-3 text-white">Loading Error</h2>
                        <p className="text-white-50 mx-auto mb-5 text-break text-start" style={{ lineHeight: '1.6' }}>
                            {error}
                        </p>
                        <button onClick={() => window.location.reload()} className="btn btn-outline-danger border-opacity-50 rounded-pill px-5 py-3 fw-bold shadow-lg hover-scale transition-all d-flex align-items-center gap-2 mx-auto">
                            Retry
                        </button>
                    </div>
                </main>
            </div>
        )
    }

    if (profile?.status === 'pending') {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex flex-column">
                <Navbar />
                <main className="container flex-grow-1 d-flex align-items-center justify-content-center py-5 mt-5">
                    <div className="text-center p-5 rounded-5 border border-warning border-opacity-25 bg-white bg-opacity-5 shadow-lg max-w-md w-100" style={{ backdropFilter: "blur(10px)" }}>
                        <div className="mb-4 d-inline-block rounded-circle p-4 bg-warning bg-opacity-10 text-warning shadow">
                            <Clock size={48} />
                        </div>
                        <h2 className="fw-bold mb-3 text-white">Verification Pending</h2>
                        <p className="text-white-50 mx-auto mb-5" style={{ maxWidth: '400px', lineHeight: '1.6' }}>
                            Your artisan account is currently under review by our heritage verification team. We will notify you once your national access is approved.
                        </p>
                        <button onClick={handleLogout} className="btn btn-warning rounded-pill px-5 py-3 fw-bold shadow-lg hover-scale transition-all d-flex align-items-center gap-2 mx-auto">
                            <LogOut size={20} /> Leave Portal
                        </button>
                    </div>
                </main>
            </div>
        )
    }

    if (profile?.status === 'rejected') {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex flex-column">
                <Navbar />
                <main className="container flex-grow-1 d-flex align-items-center justify-content-center py-5 mt-5">
                    <div className="text-center p-5 rounded-5 border border-danger border-opacity-25 bg-white bg-opacity-5 shadow-lg max-w-md w-100" style={{ backdropFilter: "blur(10px)" }}>
                        <div className="mb-4 d-inline-block rounded-circle p-4 bg-danger bg-opacity-10 text-danger shadow">
                            <AlertCircle size={48} />
                        </div>
                        <h2 className="fw-bold mb-3 text-white">Application Unsuccessful</h2>
                        <p className="text-white-50 mx-auto mb-5" style={{ maxWidth: '400px', lineHeight: '1.6' }}>
                            Unfortunately, we are unable to verify the heritage standards required to activate this artisan profile at this time.
                        </p>
                        <button onClick={handleLogout} className="btn btn-outline-danger border-opacity-50 rounded-pill px-5 py-3 fw-bold shadow-lg hover-scale transition-all d-flex align-items-center gap-2 mx-auto">
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="text-white min-vh-100 d-flex flex-column position-relative">
            <DynamicLightingBackground />
            <Navbar />

            <main className="container-fluid flex-grow-1 pt-5 mt-5 px-lg-5 position-relative z-1">
                <div className="d-flex flex-column gap-5 h-100 pb-5">
                    {/* FLOATING WORKBENCH NAV */}
                    <nav className="d-flex align-items-center justify-content-lg-center sticky-top z-3 px-3 overflow-x-auto custom-scrollbar" style={{ top: '80px', WebkitOverflowScrolling: 'touch' }}>
                        <motion.div 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="p-2 rounded-pill border border-white-10 shadow-lg d-flex flex-nowrap gap-2 backdrop-blur-lg mx-auto mx-lg-0"
                            style={{ background: 'rgba(10, 10, 10, 0.65)', minWidth: 'max-content' }}
                        >
                            <button onClick={() => setActiveTab("dashboard")} className={`btn ${activeTab === 'dashboard' ? 'btn-warning shadow-lg text-dark' : 'btn-link text-white-50 text-decoration-none hover-text-white'} rounded-pill py-2 px-4 fw-bold d-flex align-items-center gap-2 transition-all flex-shrink-0`}>
                                <LayoutDashboard size={18} /> Studio
                            </button>
                            <button onClick={() => setActiveTab("crafts")} className={`btn ${activeTab === 'crafts' ? 'btn-warning shadow-lg text-dark' : 'btn-link text-white-50 text-decoration-none hover-text-white'} rounded-pill py-2 px-4 fw-bold d-flex align-items-center gap-2 transition-all flex-shrink-0`}>
                                <Package size={18} /> Inventory
                            </button>
                            <button onClick={() => setActiveTab("live")} className={`btn ${activeTab === 'live' ? 'btn-danger shadow-lg text-white pulse-animation' : 'btn-link text-white-50 text-decoration-none hover-text-white'} rounded-pill py-2 px-4 fw-bold d-flex align-items-center gap-2 transition-all flex-shrink-0`}>
                                <Video size={18} /> Broadcast
                            </button>
                            <button onClick={() => setActiveTab("wholesale")} className={`btn ${activeTab === 'wholesale' ? 'btn-primary shadow-lg text-white' : 'btn-link text-white-50 text-decoration-none hover-text-white'} rounded-pill py-2 px-4 fw-bold d-flex align-items-center gap-2 transition-all flex-shrink-0`}>
                                <Handshake size={18} /> Wholesale
                            </button>
                            <div className="border-end border-white-10 mx-2"></div>
                            <button onClick={() => setActiveTab("settings")} className={`btn ${activeTab === 'settings' ? 'btn-warning shadow-lg text-dark' : 'btn-link text-white-50 text-decoration-none hover-text-white'} rounded-pill py-2 px-4 fw-bold d-flex align-items-center gap-2 transition-all flex-shrink-0`}>
                                <Settings size={18} /> Settings
                            </button>
                            <button onClick={handleLogout} className="btn btn-link text-danger text-decoration-none rounded-pill py-2 px-3 fw-bold d-flex align-items-center gap-2 hover-bg-danger hover-text-white transition-all flex-shrink-0">
                                <LogOut size={18} />
                            </button>
                        </motion.div>
                    </nav>

                    {/* MAIN CONTENT WORKBENCH */}
                    <div className="flex-grow-1 w-100 mx-auto" style={{ maxWidth: '1400px' }}>
                        {activeTab === 'dashboard' ? (
                            <>
                                <header className="mb-5 d-flex flex-wrap align-items-end justify-content-between gap-4 animate-fade-in">
                                    <div>
                                        <h1 className="display-4 fw-bold mb-2">Marhaba, <span className="text-warning">{profile?.full_name?.split(' ')[0] || "Master"}.</span></h1>
                                        <p className="text-white-50 opacity-75 lead mb-0">Your heritage portal is active. Centuries of tradition are now reaching a nationwide audience.</p>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <button className="btn btn-warning rounded-pill px-4 py-3 fw-bold d-flex align-items-center gap-2 shadow-lg hover-translate-y transition-all">
                                            <Sparkles size={18} /> New Story
                                        </button>
                                        <button
                                            onClick={handleVoiceToStory}
                                            className={`btn ${isRecording ? 'btn-danger position-relative overflow-hidden' : 'btn-outline-light border-opacity-20'} rounded-pill px-4 py-3 fw-bold d-flex align-items-center gap-2 hover-translate-y transition-all`}
                                            disabled={isRecording || isGeneratingStory}>
                                            {isRecording ? (
                                                <>
                                                    <span className="position-absolute w-100 h-100 bg-white bg-opacity-25 start-0 top-0 pulse-animation"></span>
                                                    <Mic size={18} className="position-relative z-1" />
                                                    <span className="position-relative z-1">Recording...</span>
                                                </>
                                            ) : isGeneratingStory ? (
                                                <><Loader size={18} className="spin" /> Magic happening...</>
                                            ) : (
                                                <><Mic size={18} /> Voice to Story</>
                                            )}
                                        </button>
                                    </div>
                                </header>

                                {/* VOICE TO STORY UI */}
                                {(isRecording || isGeneratingStory || recordedStory) && (
                                    <div className="mb-5 p-4 rounded-5 border border-warning border-opacity-50 bg-white bg-opacity-5 animate-fade-in shadow-lg">
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <div className={`p-3 rounded-circle ${isRecording ? 'bg-danger text-white pulse-animation' : 'bg-warning bg-opacity-20 text-warning'}`}>
                                                <Mic size={24} />
                                            </div>
                                            <h4 className="fw-bold mb-0">
                                                {isRecording ? "Listening to Your Heritage..." : isGeneratingStory ? "AI is Transcribing & Formatting..." : "Your Heritage Story"}
                                            </h4>
                                        </div>

                                        {isRecording && (
                                            <div className="ps-5 ms-3">
                                                <p className="text-white-50 mb-0">Speak naturally about your craft, its history, and the materials used. We'll capture the essence for your audience...</p>
                                                <div className="d-flex align-items-center gap-2 mt-3 text-danger small fw-bold">
                                                    <span className="spinner-grow spinner-grow-sm" role="status"></span>
                                                    00:00:03...
                                                </div>
                                            </div>
                                        )}

                                        {isGeneratingStory && (
                                            <div className="ps-5 ms-3 d-flex align-items-center gap-2 text-warning">
                                                <span className="spinner-border spinner-border-sm"></span> Let the AI weave your words into a master story...
                                            </div>
                                        )}

                                        {recordedStory && (
                                            <div className="ps-5 ms-3">
                                                <div className="p-4 rounded-4 bg-dark bg-opacity-80 text-white-70 fst-italic position-relative mt-2 shadow-lg" style={{ borderLeft: "4px solid #ffca2c" }}>
                                                    <Sparkles className="text-warning position-absolute top-0 end-0 m-3 opacity-50" />
                                                    "{recordedStory}"
                                                    <div className="mt-4 pt-3 border-top border-white-10 d-flex justify-content-end gap-3 align-items-center">
                                                        <button className="btn btn-link text-white-50 text-decoration-none p-0 hover-text-danger" onClick={() => setRecordedStory(null)}>Discard</button>
                                                        <button className="btn btn-warning rounded-pill px-4 fw-bold shadow-lg" onClick={() => {
                                                            setShowAddCraft(true)
                                                            setEditingCraftId(null)
                                                            setCraftForm(prev => ({ ...prev, description: recordedStory }))
                                                            setRecordedStory(null)
                                                            setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100)
                                                        }}>Publish Story to Catalog</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* GAMIFICATION WIDGET */}
                                <div className="mb-5 p-4 rounded-5 border border-warning border-opacity-25 position-relative overflow-hidden animate-fade-in-up" style={{ background: "linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(0,0,0,0) 100%)" }}>
                                    <div className="position-absolute top-0 end-0 p-4 opacity-10 text-warning">
                                        <Award size={120} />
                                    </div>
                                    <h5 className="text-warning fw-bold mb-1 d-flex gap-2 align-items-center"><Award size={20} /> {gamification.tier} Status</h5>
                                    <p className="text-white-50 small mb-4 w-75 position-relative z-1" style={{ lineHeight: "1.5" }}>You have unlocked <strong>{gamification.points} mastery points</strong>. Continue sharing your heritage stories and fulfilling orders to ascend to the next prestigious artisanal tier.</p>

                                    <div className="position-relative z-1">
                                        <div className="d-flex justify-content-between text-white-70 small mb-2 fw-bold">
                                            <span>{gamification.points} pts</span>
                                            <span className={gamification.tier === 'Grandmaster' ? "text-warning" : ""}>{gamification.tier === 'Grandmaster' ? 'Max Level Achieved' : `${gamification.nextTierPts} pts`}</span>
                                        </div>
                                        <div className="progress rounded-pill overflow-hidden shadow-sm" style={{ height: "10px", backgroundColor: "rgba(255,255,255,0.05)" }}>
                                            <div className="progress-bar bg-warning progress-bar-striped progress-bar-animated rounded-pill" role="progressbar" style={{ width: `${gamification.progress}%` }}></div>
                                        </div>
                                    </div>
                                </div>

                                {/* STATS OVERVIEW */}
                                <div className="row g-4 mb-5 animate-fade-in-up">
                                    <div className="col-md-4">
                                        <div className="p-4 rounded-5 border border-white border-opacity-10 bg-white bg-opacity-5">
                                            <div className="d-flex align-items-center justify-content-between mb-3 text-warning">
                                                <Eye size={24} />
                                                <span className="small text-success fw-bold d-flex align-items-center gap-1">+12% <TrendingUp size={12} /></span>
                                            </div>
                                            <div className="display-5 fw-bold text-white mb-1">{stats.impressions.toLocaleString()}</div>
                                            <div className="small text-white-50 text-uppercase ls-1 fw-bold">Story Impressions</div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="p-4 rounded-5 border border-white border-opacity-10 bg-white bg-opacity-5">
                                            <div className="d-flex align-items-center justify-content-between mb-3 text-info">
                                                <Star size={24} />
                                                <span className="small text-success fw-bold d-flex align-items-center gap-1">+5% <TrendingUp size={12} /></span>
                                            </div>
                                            <div className="display-5 fw-bold text-white mb-1">{stats.rating}/5</div>
                                            <div className="small text-white-50 text-uppercase ls-1 fw-bold">Heritage Rating</div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="p-4 rounded-5 border border-white border-opacity-10 bg-white bg-opacity-5">
                                            <div className="d-flex align-items-center justify-content-between mb-3 text-success">
                                                <TrendingUp size={24} />
                                                <span className="small text-info fw-bold">Verified</span>
                                            </div>
                                            <div className="display-5 fw-bold text-white mb-1">{stats.activeCollections}</div>
                                            <div className="small text-white-50 text-uppercase ls-1 fw-bold">Active Collections</div>
                                        </div>
                                    </div>
                                </div>

                                {/* RECENT ORDERS */}
                                <div className="animate-fade-in-up mb-5" style={{ animationDelay: "0.1s" }}>
                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                        <h3 className="fw-bold mb-0">Recent Orders</h3>
                                        <button className="btn btn-link text-warning text-decoration-none small d-flex align-items-center gap-1 hover-underline">
                                            View All <ChevronRight size={14} />
                                        </button>
                                    </div>

                                    <div className="rounded-5 border border-white border-opacity-10 bg-white bg-opacity-5 overflow-hidden">
                                        {orders.length === 0 ? (
                                            <div className="p-5 text-center text-white-50">
                                                <Package size={32} className="mb-3 opacity-50 mx-auto" />
                                                <p className="mb-0">No active orders yet. Keep sharing your stories!</p>
                                            </div>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-dark table-hover mb-0 bg-transparent align-middle">
                                                    <thead>
                                                        <tr className="border-bottom border-white border-opacity-10 opacity-75">
                                                            <th className="bg-transparent fw-bold py-3 ps-4">Product</th>
                                                            <th className="bg-transparent fw-bold py-3">Customer</th>
                                                            <th className="bg-transparent fw-bold py-3">Qty</th>
                                                            <th className="bg-transparent fw-bold py-3">Total Earnings</th>
                                                            <th className="bg-transparent fw-bold py-3">Status</th>
                                                            <th className="bg-transparent fw-bold py-3 pe-4 text-end">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orders.map((item) => (
                                                            <tr key={item.id} className="border-bottom border-white border-opacity-10">
                                                                <td data-label="Product" className="bg-transparent py-3 ps-4">
                                                                    <div className="d-flex align-items-center gap-3">
                                                                        <img src={item.product?.image_url || "/images/hero.png"} alt="Product" className="rounded-3 object-fit-cover" style={{ width: "48px", height: "48px" }} />
                                                                        <span className="fw-bold">{item.product?.title || "Unknown Craft"}</span>
                                                                    </div>
                                                                </td>
                                                                <td data-label="Customer" className="bg-transparent py-3">
                                                                    <div className="small text-white">{item.orders?.customer_name}</div>
                                                                    <div className="small text-white-50">{item.orders?.customer_address?.substring(0, 20)}...</div>
                                                                </td>
                                                                <td data-label="Qty" className="bg-transparent py-3 text-white-50">{item.quantity}</td>
                                                                <td data-label="Total Earnings" className="bg-transparent py-3 fw-bold text-warning">{formatPrice(item.price_at_time * item.quantity)}</td>
                                                                <td data-label="Status" className="bg-transparent py-3 pe-4 text-end">
                                                                    <select
                                                                        className={`form-select form-select-sm text-center d-inline w-auto fw-bold shadow-sm ${item.orders?.status === 'pending' ? 'bg-warning text-dark' : item.orders?.status === 'processing' ? 'bg-info text-dark' : item.orders?.status === 'shipped' ? 'bg-primary text-white' : item.orders?.status === 'cancelled' ? 'bg-danger text-white' : 'bg-success text-white'} border-0 rounded-pill`}
                                                                        value={item.orders?.status || 'pending'}
                                                                        onChange={(e) => handleOrderStatusChange(item.orders?.id, e.target.value)}
                                                                        style={{ cursor: "pointer", appearance: "none", paddingRight: "1.5rem" }}
                                                                    >
                                                                        <option value="pending" className="bg-dark text-white">Pending</option>
                                                                        <option value="processing" className="bg-dark text-white">Processing</option>
                                                                        <option value="shipped" className="bg-dark text-white">Shipped</option>
                                                                        <option value="delivered" className="bg-dark text-white">Delivered</option>
                                                                        <option value="cancelled" className="bg-dark text-white">Cancelled</option>
                                                                    </select>
                                                                </td>
                                                                <td data-label="Action" className="bg-transparent py-3 pe-md-4 text-start text-md-end">
                                                                    {item.orders?.status === 'delivered' ? (
                                                                        <span className="small text-success fw-bold d-flex align-items-center gap-1 justify-content-end"><CheckCircle size={14} /> Completed</span>
                                                                    ) : (
                                                                        <span className="small text-white-50">In Progress</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : activeTab === 'settings' ? (
                            <div className="animate-fade-in-up">
                                <header className="mb-4">
                                    <h2 className="display-6 fw-bold mb-2 d-flex align-items-center gap-3">
                                        <Settings className="text-warning" size={32} /> Studio Settings
                                    </h2>
                                    <p className="text-white-50 mb-0">Manage your public artisan profile and heritage details here.</p>
                                </header>

                                <div className="p-4 p-md-5 rounded-5 border border-white-10 bg-white bg-opacity-5">
                                    <form onSubmit={handleSaveProfile} className="d-flex flex-column gap-4">
                                        <div className="row g-4">
                                            <div className="col-md-6">
                                                <label className="form-label small text-white-50 text-uppercase ls-1">Full Name</label>
                                                <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                    <span className="input-group-text bg-transparent border-0 text-white-50"><User size={16} /></span>
                                                    <input type="text" required value={settingForm.full_name} onChange={e => setSettingForm({ ...settingForm, full_name: e.target.value })} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="Master Artisan Name" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small text-white-50 text-uppercase ls-1">Master Specialty</label>
                                                <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                    <span className="input-group-text bg-transparent border-0 text-warning"><Hammer size={16} /></span>
                                                    <input type="text" value={settingForm.specialty} onChange={e => setSettingForm({ ...settingForm, specialty: e.target.value })} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="e.g. Blue Pottery" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="form-label small text-white-50 text-uppercase ls-1">Studio Location</label>
                                            <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                <span className="input-group-text bg-transparent border-0 text-white-50"><MapPin size={16} /></span>
                                                <input type="text" value={settingForm.location} onChange={e => setSettingForm({ ...settingForm, location: e.target.value })} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="e.g. Multan, Pakistan" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="form-label small text-white-50 text-uppercase ls-1">Heritage Bio</label>
                                            <textarea rows={4} value={settingForm.bio} onChange={e => setSettingForm({ ...settingForm, bio: e.target.value })} className="form-control bg-dark bg-opacity-50 border border-white-10 text-white rounded-4 p-3 shadow-none" placeholder="Tell the world about the heritage of your craft..."></textarea>
                                        </div>

                                        <button type="submit" disabled={isSaving} className="btn btn-warning rounded-pill py-3 fw-bold mt-2 shadow-lg d-flex align-items-center justify-content-center gap-2 hover-translate-y transition-all">
                                            {isSaving ? <Loader size={20} className="spin" /> : <>Save National Avatar <Sparkles size={18} /></>}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : activeTab === 'crafts' ? (
                            <div className="animate-fade-in-up">
                                <header className="mb-4 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h2 className="display-6 fw-bold mb-2 d-flex align-items-center gap-3">
                                            <Package className="text-warning" size={32} /> National Inventory
                                        </h2>
                                        <p className="text-white-50 mb-0">Present your heritage crafts to buyers nationwide.</p>
                                    </div>
                                    {!showAddCraft && (
                                        <button onClick={() => {
                                            setEditingCraftId(null)
                                            setCraftForm({ title: "", description: "", price: 0, stock: 10, category_id: categories.length > 0 ? categories[0].id : "", region: "Punjab", image_url: "" })
                                            setShowAddCraft(true)
                                        }} className="btn btn-warning rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-lg hover-scale">
                                            <Plus size={18} /> New Masterpiece
                                        </button>
                                    )}
                                </header>

                                {showAddCraft ? (
                                    <div className="p-4 p-md-5 rounded-5 border border-white-10 bg-white bg-opacity-5 animate-fade-in">
                                        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-white-10">
                                            <h4 className="fw-bold m-0">{editingCraftId ? "Update Masterpiece Details" : "Publish to National Network"}</h4>
                                            <button onClick={() => setShowAddCraft(false)} className="btn btn-outline-light rounded-pill px-3 m-0 border-opacity-20 text-white-50 hover-text-white transition-all">
                                                Cancel
                                            </button>
                                        </div>
                                        <form onSubmit={handleSaveCraft} className="d-flex flex-column gap-4">
                                            <div className="row g-4">
                                                <div className="col-md-8">
                                                    <label className="form-label small text-white-50 text-uppercase ls-1">Title</label>
                                                    <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                        <span className="input-group-text bg-transparent border-0 text-white-50"><Package size={16} /></span>
                                                        <input type="text" required value={craftForm.title} onChange={e => setCraftForm({ ...craftForm, title: e.target.value })} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="e.g. Multani Blue Pottery Vase" />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label small text-white-50 text-uppercase ls-1">Price (PKR)</label>
                                                    <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                        <span className="input-group-text bg-transparent border-0 text-warning"><DollarSign size={16} /></span>
                                                        <input type="number" step="0.01" min="0" required value={craftForm.price} onChange={e => setCraftForm({ ...craftForm, price: parseFloat(e.target.value) })} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="0.00" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row g-4">
                                                <div className="col-md-4">
                                                    <label className="form-label small text-white-50 text-uppercase ls-1">Heritage Category</label>
                                                    <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                        <span className="input-group-text bg-transparent border-0 text-white-50"><ListFilter size={16} /></span>
                                                        <select required value={craftForm.category_id} onChange={e => setCraftForm({ ...craftForm, category_id: e.target.value })} className="form-select bg-transparent border-0 text-white shadow-none">
                                                            <option value="" disabled className="text-dark">Select Category</option>
                                                            {categories.map(cat => (
                                                                <option key={cat.id} value={cat.id} className="text-dark">{cat.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label small text-white-50 text-uppercase ls-1">Regional Silo</label>
                                                    <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                        <span className="input-group-text bg-transparent border-0 text-white-50"><MapPin size={16} /></span>
                                                        <select required value={craftForm.region} onChange={e => setCraftForm({ ...craftForm, region: e.target.value })} className="form-select bg-transparent border-0 text-white shadow-none">
                                                            <option value="Punjab" className="text-dark">Punjab</option>
                                                            <option value="Sindh" className="text-dark">Sindh</option>
                                                            <option value="KPK" className="text-dark">Khyber Pakhtunkhwa (KPK)</option>
                                                            <option value="Balochistan" className="text-dark">Balochistan</option>
                                                            <option value="Gilgit-Baltistan" className="text-dark">Gilgit-Baltistan</option>
                                                            <option value="AJK" className="text-dark">Azad Kashmir</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label small text-white-50 text-uppercase ls-1">Available Quantity</label>
                                                    <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                        <input type="number" min="0" required value={craftForm.stock} onChange={e => setCraftForm({ ...craftForm, stock: parseInt(e.target.value) })} className="form-control bg-transparent border-0 text-white shadow-none ps-3" placeholder="10" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="form-label small text-white-50 text-uppercase ls-1">Main Image URL</label>
                                                <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                    <span className="input-group-text bg-transparent border-0 text-white-50"><ImageIcon size={16} /></span>
                                                    <input type="url" required value={craftForm.image_url} onChange={e => setCraftForm({ ...craftForm, image_url: e.target.value })} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="https://..." />
                                                </div>
                                                {craftForm.image_url && (
                                                    <div className="mt-3 rounded-4 overflow-hidden border border-white-10 d-inline-block" style={{ height: "100px", maxWidth: "200px" }}>
                                                        <img src={craftForm.image_url} alt="Preview" className="w-100 h-100 object-fit-cover" />
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="form-label small text-white-50 text-uppercase ls-1">Description & Heritage Detail</label>
                                                <textarea rows={4} required value={craftForm.description} onChange={e => setCraftForm({ ...craftForm, description: e.target.value })} className="form-control bg-dark bg-opacity-50 border border-white-10 text-white rounded-4 p-3 shadow-none" placeholder="Describe the materials, the process, and the history behind this masterwork..."></textarea>
                                            </div>

                                            <div className="mt-3">
                                                <button type="submit" disabled={isSavingCraft} className="btn btn-warning rounded-pill px-5 py-3 fw-bold shadow-lg d-inline-flex align-items-center gap-2 hover-scale">
                                                    {isSavingCraft ? <Loader size={20} className="spin" /> : <>{editingCraftId ? "Update Publish Settings" : "Publish"} <Sparkles size={18} /></>}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="row g-4">
                                        {products.length === 0 ? (
                                            <div className="col-12 text-center py-5 rounded-5 border border-white border-opacity-10 bg-white bg-opacity-5 mt-4">
                                                <Package size={48} className="text-white-50 mb-3 opacity-50" />
                                                <h4 className="fw-bold mb-2">Blank Canvas Active</h4>
                                                <p className="text-white-50 mb-4">You have not published any masterworks to the national nexus.</p>
                                                <button onClick={() => setShowAddCraft(true)} className="btn btn-warning rounded-pill px-4 py-3 fw-bold shadow-lg hover-scale text-dark">
                                                    Begin Publishing <Plus size={18} className="ms-1" />
                                                </button>
                                            </div>
                                        ) : (
                                            products.map((prod) => (
                                                <div key={prod.id} className="col-md-6 col-lg-4">
                                                    <div className="position-relative overflow-hidden rounded-5 border border-white border-opacity-10 bg-white bg-opacity-5 transition-all hover-translate-y d-flex flex-column h-100">
                                                        <div className="aspect-ratio-square bg-dark w-100 position-relative" style={{ height: "240px" }}>
                                                            {prod.image_url ? (
                                                                <img src={prod.image_url} alt={prod.title} className="w-100 h-100 object-fit-cover opacity-75 hover-opacity-100 transition-opacity" />
                                                            ) : (
                                                                <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white-50">
                                                                    <ImageIcon size={32} />
                                                                </div>
                                                            )}
                                                            <div className="position-absolute top-0 end-0 m-3 px-3 py-1 bg-dark bg-opacity-75 backdrop-blur-md rounded-pill fw-bold text-warning border border-warning border-opacity-25 shadow-sm">
                                                                {formatPrice(prod.price)}
                                                            </div>
                                                        </div>
                                                        <div className="p-4 flex-grow-1 d-flex flex-column">
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <h5 className="fw-bold text-white fs-5 mb-0 text-truncate" style={{ maxWidth: '80%' }}>{prod.title}</h5>
                                                                {prod.stock > 0 ? (
                                                                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 flex-shrink-0" style={{ fontSize: '0.65rem' }}>{prod.stock} left</span>
                                                                ) : (
                                                                    <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-2 py-1 flex-shrink-0" style={{ fontSize: '0.65rem' }}>Sold Out</span>
                                                                )}
                                                            </div>
                                                            <p className="small text-white-50 line-clamp-2 mb-4 flex-grow-1">{prod.description}</p>

                                                            <div className="d-flex align-items-center gap-2 mt-auto">
                                                                <button onClick={() => editCraft(prod)} className="btn btn-dark border border-white-10 rounded-pill py-2 fw-bold flex-grow-1 d-flex align-items-center justify-content-center gap-2 hover-bg-white-10 text-white-75 transition-colors">
                                                                    <Edit2 size={16} /> Edit
                                                                </button>
                                                                <button onClick={() => handleDeleteCraft(prod.id)} className="btn btn-danger bg-opacity-10 border border-danger border-opacity-25 text-danger rounded-pill py-2 px-3 fw-bold d-flex align-items-center justify-content-center hover-bg-danger hover-text-white transition-colors" title="Delete">
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : activeTab === 'wiki' ? (
                            <div className="animate-fade-in-up">
                                <header className="mb-4 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h2 className="display-6 fw-bold mb-2 d-flex align-items-center gap-3">
                                            <BookOpen className="text-warning" size={32} /> Heritage Archives
                                        </h2>
                                        <p className="text-white-50 mb-0">Document your local history, techniques, and regional materials.</p>
                                    </div>
                                    {!showAddWiki && (
                                        <button onClick={() => {
                                            setEditingWikiId(null)
                                            setWikiForm({ title: "", content: "", category: "Ceramics", image_url: "", heritage_site: profile?.location || "Pakistan" })
                                            setShowAddWiki(true)
                                        }} className="btn btn-warning rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-lg hover-scale">
                                            <Plus size={18} /> New Manuscript
                                        </button>
                                    )}
                                </header>

                                {showAddWiki ? (
                                    <div className="p-4 p-md-5 rounded-5 border border-white-10 bg-white bg-opacity-5 animate-fade-in shadow-2xl">
                                        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-white-10">
                                            <h4 className="fw-bold m-0">{editingWikiId ? "Refine Manuscript" : "Publish to Craftpedia"}</h4>
                                            <button onClick={() => setShowAddWiki(false)} className="btn btn-outline-light rounded-pill px-3 m-0 border-opacity-20 text-white-50 hover-text-white transition-all">
                                                Close Editor
                                            </button>
                                        </div>
                                        <form onSubmit={handleSaveWikiArticle} className="d-flex flex-column gap-4">
                                            <div className="row g-4">
                                                <div className="col-md-7">
                                                    <label className="form-label small text-white-50 text-uppercase ls-1">Article Title</label>
                                                    <input type="text" required value={wikiForm.title} onChange={e => setWikiForm({ ...wikiForm, title: e.target.value })} className="form-control bg-dark bg-opacity-50 border border-white-10 text-white rounded-4 p-3 shadow-none" placeholder="e.g. The Ancient Origins of Indigo Dye" />
                                                </div>
                                                <div className="col-md-5">
                                                    <label className="form-label small text-white-50 text-uppercase ls-1">Heritage Site / Region</label>
                                                    <input type="text" value={wikiForm.heritage_site} onChange={e => setWikiForm({ ...wikiForm, heritage_site: e.target.value })} className="form-control bg-dark bg-opacity-50 border border-white-10 text-white rounded-4 p-3 shadow-none" placeholder="e.g. Multan, Pakistan" />
                                                </div>
                                            </div>

                                            <div className="row g-4">
                                                <div className="col-md-6">
                                                    <label className="form-label small text-white-50 text-uppercase ls-1">Category</label>
                                                    <select required value={wikiForm.category} onChange={e => setWikiForm({ ...wikiForm, category: e.target.value })} className="form-select bg-dark bg-opacity-50 border border-white-10 text-white rounded-4 p-3 shadow-none">
                                                        <option value="Ceramics">Ceramics</option>
                                                        <option value="Textiles">Textiles</option>
                                                        <option value="Jewelry">Jewelry</option>
                                                        <option value="Woodwork">Woodwork</option>
                                                        <option value="Metalware">Metalware</option>
                                                        <option value="History">History & Culture</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small text-white-50 text-uppercase ls-1">Feature Image (URL)</label>
                                                    <input type="url" value={wikiForm.image_url} onChange={e => setWikiForm({ ...wikiForm, image_url: e.target.value })} className="form-control bg-dark bg-opacity-50 border border-white-10 text-white rounded-4 p-3 shadow-none" placeholder="https://..." />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="form-label small text-white-50 text-uppercase ls-1">Manuscript Content (Markdown Supported)</label>
                                                <textarea rows={12} required value={wikiForm.content} onChange={e => setWikiForm({ ...wikiForm, content: e.target.value })} className="form-control bg-dark bg-opacity-50 border border-white-10 text-white rounded-4 p-4 shadow-none font-monospace" placeholder="# The History of...\n\nBody content goes here..."></textarea>
                                            </div>

                                            <button type="submit" disabled={isSavingWiki} className="btn btn-warning rounded-pill py-3 fw-bold mt-2 shadow-lg d-flex align-items-center justify-content-center gap-2 hover-translate-y transition-all">
                                                {isSavingWiki ? <Loader size={20} className="spin" /> : <>Archive Manuscript <Save size={18} /></>}
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="row g-4">
                                        {wikiArticles.map((a, i) => (
                                            <div key={a.id} className="col-md-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                                <div className="p-4 rounded-5 border border-white border-opacity-10 bg-white bg-opacity-5 h-100 group transition-all d-flex flex-column shadow-xl">
                                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                                        <div className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-1 small fw-bold text-uppercase border border-warning border-opacity-25">{a.category}</div>
                                                        <div className="d-flex gap-2">
                                                            <button 
                                                                onClick={() => {
                                                                    setEditingWikiId(a.id)
                                                                    setWikiForm({ title: a.title, content: a.content, category: a.category, image_url: a.image_url || "", heritage_site: a.heritage_site || "" })
                                                                    setShowAddWiki(true)
                                                                }} 
                                                                className="btn btn-sm btn-outline-light rounded-circle p-2 border-opacity-10 hover-bg-warning hover-text-dark transition-all"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={() => deleteWikiArticle(a.id)}
                                                                className="btn btn-sm btn-outline-danger rounded-circle p-2 border-opacity-10 hover-bg-danger transition-all"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <h4 className="fw-bold mb-3 text-white">{a.title}</h4>
                                                    <p className="text-white-50 small mb-4 opacity-75 truncate-3 flex-grow-1">{a.content.substring(0, 150)}...</p>
                                                    <div className="mt-auto pt-3 border-top border-white border-opacity-5 d-flex justify-content-between align-items-center">
                                                        <div className="small text-white-50 d-flex align-items-center gap-1"><MapPin size={12} /> {a.heritage_site}</div>
                                                        <Link href={`/craftpedia/${a.slug}`} className="btn btn-link text-warning text-decoration-none p-0 small fw-bold hover-underline d-flex align-items-center gap-1">View Publicly <ChevronRight size={14} /></Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {wikiArticles.length === 0 && (
                                            <div className="col-12 py-5 text-center text-white-50 rounded-5 border border-white border-opacity-5 bg-white bg-opacity-2 mt-4">
                                                <BookOpen size={48} className="mb-3 opacity-25 mx-auto" />
                                                <h5 className="text-white fw-bold">No Manuscripts Found</h5>
                                                <p>You haven't authored any heritage manuscripts yet. Start documenting your legacy!</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : activeTab === 'live' ? (
                            <div className="animate-fade-in-up">
                                <header className="mb-4 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h2 className="display-6 fw-bold mb-2 d-flex align-items-center gap-3">
                                            <Video className="text-warning" size={32} /> Studio Stories
                                        </h2>
                                        <p className="text-white-50 mb-0">Share real-time vertical clips of your process, heritage stories, and workshop moments.</p>
                                    </div>
                                    {!showAddFeed && (
                                        <button onClick={() => setShowAddFeed(true)} className="btn btn-warning rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-lg hover-scale">
                                            <Plus size={18} /> New Studio Story
                                        </button>
                                    )}
                                </header>

                                {showAddFeed ? (
                                    <div className="p-4 p-md-5 rounded-5 border border-white-10 bg-white bg-opacity-5 animate-fade-in shadow-2xl overflow-hidden position-relative">
                                        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-white-10">
                                            <h4 className="fw-bold m-0">Go Live (Vertical Story)</h4>
                                            <button onClick={() => setShowAddFeed(false)} className="btn btn-outline-light rounded-pill px-3 m-0 border-opacity-20 text-white-50 hover-text-white transition-all">
                                                Cancel
                                            </button>
                                        </div>
                                        <form onSubmit={handleSaveLiveFeed} className="d-flex flex-column gap-4">
                                            <div className="row g-4">
                                                <div className="col-md-8">
                                                    <label className="form-label small text-white-50 text-uppercase ls-1">Video Source URL (MP4)</label>
                                                    <input type="url" required value={feedForm.video_url} onChange={e => setFeedForm({ ...feedForm, video_url: e.target.value })} className="form-control bg-dark bg-opacity-50 border border-white-10 text-white rounded-4 p-3 shadow-none" placeholder="https://cloud.storage.com/story.mp4" />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label small text-white-50 text-uppercase ls-1">Simulate Real-time</label>
                                                    <div className="form-check form-switch p-2 bg-white bg-opacity-5 rounded-4 d-flex align-items-center justify-content-between border border-white-5">
                                                        <label className="form-check-label ps-2">Mark as "LIVE"</label>
                                                        <input className="form-check-input ms-0 me-2" type="checkbox" checked={feedForm.is_live} onChange={e => setFeedForm({ ...feedForm, is_live: e.target.checked })} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="form-label small text-white-50 text-uppercase ls-1">Caption</label>
                                                <textarea rows={3} value={feedForm.caption} onChange={e => setFeedForm({ ...feedForm, caption: e.target.value })} className="form-control bg-dark bg-opacity-50 border border-white-10 text-white rounded-4 p-3 shadow-none" placeholder="What's happening in your studio today?"></textarea>
                                            </div>

                                            <div className="p-4 rounded-4 bg-info bg-opacity-10 border border-info border-opacity-20">
                                                <p className="small text-info mb-0 d-flex align-items-center gap-2">
                                                    <Sparkles size={16} /> Heritage tip: Vertical (9:16) videos get 3x more national engagement.
                                                </p>
                                            </div>

                                            <button type="submit" disabled={isSavingFeed} className="btn btn-warning rounded-pill py-3 fw-bold mt-2 shadow-lg d-flex align-items-center justify-content-center gap-2 hover-translate-y transition-all">
                                                {isSavingFeed ? <Loader size={20} className="spin" /> : <>Stream Heritage Story <Video size={18} /></>}
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="row g-4 overflow-hidden">
                                        {liveFeeds.map((feed, i) => (
                                            <div key={feed.id} className="col-md-4 col-lg-3 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                                <div className="position-relative overflow-hidden rounded-5 border border-white border-opacity-10 bg-black aspect-ratio-9-16 shadow-2xl group transition-all hover-translate-y" style={{ height: "450px" }}>
                                                    <video 
                                                        src={feed.video_url} 
                                                        className="w-100 h-100 object-fit-cover opacity-60 group-hover-opacity-90 transition-opacity" 
                                                        onMouseOver={(e) => e.currentTarget.play()}
                                                        onMouseOut={(e) => e.currentTarget.pause()}
                                                        muted
                                                        loop
                                                    />
                                                    <div className="position-absolute top-0 start-0 w-100 p-3 bg-gradient-to-b from-dark to-transparent">
                                                        {feed.is_live ? (
                                                            <div className="badge bg-danger rounded-pill px-3 py-1 fw-bold ls-1 d-inline-flex align-items-center gap-1 shadow-sm pulse-animation">
                                                                <span className="spinner-grow spinner-grow-sm" role="status"></span> LIVE
                                                            </div>
                                                        ) : (
                                                            <div className="badge bg-dark bg-opacity-80 border border-white-10 rounded-pill px-3 py-1 fw-bold text-white-50">Story</div>
                                                        )}
                                                    </div>
                                                    <div className="position-absolute bottom-0 start-0 w-100 p-4 bg-gradient-to-t from-dark to-transparent">
                                                        <p className="text-white small fw-bold mb-3 truncate-2 opacity-90">{feed.caption}</p>
                                                        <div className="d-flex justify-content-between align-items-center pt-3 border-top border-white-10 border-opacity-20 text-white-50 small fw-bold">
                                                            <div className="d-flex align-items-center gap-2"><Eye size={14} /> {feed.views_count}</div>
                                                            <button 
                                                                onClick={() => deleteFeed(feed.id)}
                                                                className="btn btn-sm btn-link text-danger p-0 opacity-25 group-hover-opacity-100 transition-opacity"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {liveFeeds.length === 0 && (
                                            <div className="col-12 py-5 text-center text-white-50 bg-white bg-opacity-5 rounded-5 border border-white-5">
                                                <Video size={48} className="mb-3 opacity-25" />
                                                <h5 className="text-white fw-bold">Studio Silence</h5>
                                                <p>Your studio story stream is currently quiet. Connect with nationwide buyers by sharing a moment.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : activeTab === 'wholesale' ? (
                            <B2BNegotiationRoom />
                        ) : null}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
