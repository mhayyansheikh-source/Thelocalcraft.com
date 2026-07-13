"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { db, auth } from "@/lib/firebase/config"
import { collection, query, where, getDocs, doc, getDoc, addDoc, orderBy } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import {
    Tag,
    Sparkles,
    ShieldCheck,
    Award,
    Truck,
    Hammer,
    MapPin,
    ArrowLeft,
    ShoppingBag,
    CheckCircle,
    Star,
    MessageSquare,
    Box,
    View,
    Volume2,
    Play,
    Pause,
    Package,
    Loader,
    X
} from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useCurrency } from "@/context/CurrencyContext"
import Link from "next/link"
import Script from "next/script"

export default function ProductDetailPage() {
    const { id } = useParams()
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [checkoutComplete, setCheckoutComplete] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const { addToCart } = useCart()
    const { formatPrice } = useCurrency()
    const [shippingDetails, setShippingDetails] = useState({ name: "", phone: "", address: "", city: "" })
    const [impactFundTip, setImpactFundTip] = useState<number>(0)

    // View mode state
    const [viewMode, setViewMode] = useState<'image' | '3d'>('image')

    // Audio Playback
    const [isPlayingAudio, setIsPlayingAudio] = useState(false)
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

    // Reviews state
    const [reviews, setReviews] = useState<any[]>([])
    const [isAuthCustomer, setIsAuthCustomer] = useState(false)
    const [customerProfile, setCustomerProfile] = useState<any>(null)
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" })
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)


    useEffect(() => {
        let unsubscribe: any;
        async function fetchProduct() {
            setLoading(true)
            
            try {
                // Fetch Product
                const productSnap = await getDoc(doc(db, "products", id as string))
                if (productSnap.exists()) {
                    const pData = productSnap.data()
                    if (pData.artisan_id) {
                        const artisanSnap = await getDoc(doc(db, "profiles", pData.artisan_id))
                        if (artisanSnap.exists()) pData.artisans = artisanSnap.data()
                    }
                    setProduct({ id: productSnap.id, ...pData })

                    if (pData.audio_story_url) {
                        const aud = new Audio(pData.audio_story_url)
                        aud.onended = () => setIsPlayingAudio(false)
                        setAudioElement(aud)
                    }
                }

                // Fetch Reviews
                const revQ = query(collection(db, "reviews"), where("product_id", "==", id), orderBy("created_at", "desc"))
                const revSnap = await getDocs(revQ)
                setReviews(revSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))

                // Check Auth for Reviews
                unsubscribe = onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        const profSnap = await getDoc(doc(db, "profiles", user.uid))
                        if (profSnap.exists()) {
                            const prof = profSnap.data()
                            if (prof.role === 'customer') {
                                setIsAuthCustomer(true)
                                setCustomerProfile(prof)
                                setShippingDetails(prev => ({
                                    ...prev,
                                    name: prof.full_name || prev.name,
                                    city: prof.location ? prof.location.split(',')[0] : prev.city
                                }))
                            }
                        }
                    }
                })
            } catch (err: any) {
                console.error("Error fetching product", err)
            }

            setLoading(false)
        }
        if (id) fetchProduct()
        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [id])

    if (loading) return (

        <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )

    if (loading) return (
        <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )

    const handleCheckoutClick = () => {
        setShowModal(true)
    }

    const confirmCodOrder = async (e: any) => {
        e.preventDefault()
        setIsCheckingOut(true)

        try {
            const user = auth.currentUser

            const orderPayload = {
                customer_id: user?.uid || null,
                customer_name: shippingDetails.name,
                customer_phone: shippingDetails.phone,
                customer_address: `${shippingDetails.address}, ${shippingDetails.city}, Pakistan`,
                total_amount: product.price + impactFundTip,
                impact_fund: impactFundTip,
                status: 'pending',
                created_at: new Date().toISOString()
            }
            const orderRef = await addDoc(collection(db, 'orders'), orderPayload)

            await addDoc(collection(db, 'order_items'), {
                order_id: orderRef.id,
                product_id: product.id,
                artisan_id: product.artisan_id,
                quantity: 1,
                price_at_time: product.price
            })

            // Generate WhatsApp Order Message
            let waMessage = `✨ *New Heritage Order (One-Click)* ✨\n`
            waMessage += `*Order ID:* ${orderRef.id.split('-')[0]}\n\n`
            waMessage += `*Customer Details:*\n`
            waMessage += `- Name: ${shippingDetails.name}\n`
            waMessage += `- Phone: ${shippingDetails.phone}\n`
            waMessage += `- Address: ${shippingDetails.address}, ${shippingDetails.city}\n\n`
            waMessage += `*Order Item:*\n`
            waMessage += `▪ 1x ${product.title} (${formatPrice(product.price)})\n`
            if (impactFundTip > 0) {
                waMessage += `▪ Direct-to-Artisan Impact Fund: ${formatPrice(impactFundTip)}\n`
            }
            waMessage += `\n*Total Amount:* ${formatPrice(product.price + impactFundTip)}\n`
            waMessage += `-------------------------\n`
            waMessage += `*Status:* Pending COD Dispatch`

            const encodedMessage = encodeURIComponent(waMessage)
            const waPhoneNumber = "923001234567" // Application Master Number

            // Open WhatsApp silently in new tab
            window.open(`https://wa.me/${waPhoneNumber}?text=${encodedMessage}`, '_blank')

            setCheckoutComplete(true)

            setTimeout(() => {
                setShowModal(false)
                setCheckoutComplete(false)
                setShippingDetails({ name: "", phone: "", address: "", city: "Karachi" })
                setImpactFundTip(0)
            }, 3000)

        } catch (error: any) {
            console.error("Failed to checkout:", error)
            alert("Error confirming your order. Please try again.")
        } finally {
            setIsCheckingOut(false)
        }
    }

    const toggleAudio = () => {
        if (!audioElement) return
        if (isPlayingAudio) {
            audioElement.pause()
            setIsPlayingAudio(false)
        } else {
            audioElement.play()
            setIsPlayingAudio(true)
        }
    }

    const handleSubmitReview = async (e: any) => {
        e.preventDefault()
        if (!isAuthCustomer || !customerProfile) return;

        setIsSubmittingReview(true)
        try {
            const user = auth.currentUser
            const payload = {
                product_id: product.id,
                customer_id: user?.uid,
                customer_name: customerProfile.full_name || "Valued Customer",
                rating: reviewForm.rating,
                comment: reviewForm.comment,
                created_at: new Date().toISOString()
            }

            const docRef = await addDoc(collection(db, 'reviews'), payload)
            
            setReviews([{ id: docRef.id, ...payload }, ...reviews])
            setReviewForm({ rating: 5, comment: "" })
            alert("Thank you! Your heritage review has been published.")
        } catch (error: any) {
            console.error("Failed to submit review:", error)
            alert("Could not post review. Please try again.")
        } finally {
            setIsSubmittingReview(false)
        }
    }

    if (!product) return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column align-items-center justify-content-center">
            <h2 className="mb-4">Craft Not Found</h2>
            <Link href="/explore" className="btn btn-warning rounded-pill px-5">Back to Explore</Link>
        </div>
    )

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="container flex-grow-1 pt-5 mt-5 pb-5">
                <Link href="/explore" className="text-white-50 text-decoration-none d-inline-flex align-items-center gap-2 mb-5 hover-white transition-colors">
                    <ArrowLeft size={18} /> Back to Collection
                </Link>

                <div className="row g-5">
                    {/* PRODUCT IMAGE & CAROUSEL */}
                    <div className="col-lg-6">
                        <div className="position-relative p-2 rounded-5 border border-white border-opacity-10 bg-white bg-opacity-5 animate-fade-in">
                            <div className="aspect-ratio-square overflow-hidden rounded-4 bg-dark position-relative">
                                {viewMode === 'image' ? (
                                    <img
                                        src={product.image_url || "https://images.unsplash.com/photo-1541533848490-bc8115cd6522?auto=format&fit=crop&q=80"}
                                        alt={product.title}
                                        className="w-100 h-100 object-fit-cover opacity-90"
                                    />
                                ) : (
                                    <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-dark">
                                        {/* @ts-ignore */}
                                        <model-viewer
                                            src={product.ar_model_url}
                                            ios-src={product.ios_ar_model_url || undefined}
                                            alt={product.title}
                                            auto-rotate
                                            camera-controls
                                            ar
                                            ar-modes="webxr scene-viewer quick-look"
                                            shadow-intensity="1"
                                            style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                                        >
                                            <button slot="ar-button" className="btn btn-warning position-absolute bottom-0 start-50 translate-middle-x mb-4 rounded-pill shadow-lg fw-bold px-4 d-flex align-items-center gap-2">
                                                <View size={18} /> View in your space
                                            </button>
                                            {/* @ts-ignore */}
                                        </model-viewer>
                                    </div>
                                )}

                                {/* AR Toggle Button Overlay */}
                                {product.ar_model_url && (
                                    <div className="position-absolute top-0 end-0 m-3 d-flex gap-2">
                                        <button
                                            onClick={() => setViewMode('image')}
                                            className={`btn btn-sm rounded-pill p-2 ${viewMode === 'image' ? 'btn-warning' : 'btn-dark border border-white-50'}`}
                                            title="View Image"
                                        >
                                            <img src={product.image_url || "/images/hero.png"} alt="Preview" width={24} height={24} className="rounded-circle object-fit-cover bg-dark" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('3d')}
                                            className={`btn btn-sm rounded-pill p-2 px-3 d-flex align-items-center gap-2 fw-bold ${viewMode === '3d' ? 'btn-warning' : 'btn-dark border border-white-50 text-white-50'}`}
                                            title="View 3D Model"
                                        >
                                            <Box size={16} /> 3D AR
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* AI Signature Badge */}
                            <div className="position-absolute bottom-0 start-0 m-4 p-3 rounded-4 bg-dark bg-opacity-80 backdrop-blur border border-warning border-opacity-30 d-flex align-items-center gap-3">
                                <div className="p-2 rounded-circle bg-warning bg-opacity-20 text-warning">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <div className="fw-bold small text-warning text-uppercase ls-1">AI Verified Origin</div>
                                    <div className="small text-white-50">Heritage Fingerprint: {product.id.substring(0, 8)}...</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PRODUCT INFO */}
                    <div className="col-lg-6">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill small text-uppercase fw-bold ls-1">
                                {product.category}
                            </span>
                            <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill small text-uppercase fw-bold ls-1 d-flex align-items-center gap-1">
                                <Award size={14} /> Heritage Certified
                            </span>
                        </div>

                        <h1 className="display-4 fw-bold mb-3">{product.title}</h1>
                        <div className="mb-4 d-flex align-items-center gap-3">
                            <div className="display-5 text-warning fw-bold">{formatPrice(product.price)}</div>
                        </div>

                        <p className="lead text-white-70 mb-5 pb-4 border-bottom border-white-10" style={{ lineHeight: "1.8" }}>
                            {product.description}
                        </p>

                        {/* MASTER ARTISAN MINI CARD */}
                        {product.artisans && (
                            <div className="mb-5 p-4 rounded-4 border border-white border-opacity-10 bg-white bg-opacity-5">
                                <div className="d-flex align-items-center gap-3">
                                    <img
                                        src={product.artisans.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.artisans.full_name)}&background=random&color=fff`}
                                        className="rounded-circle border border-warning border-opacity-25 shadow-lg"
                                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                        alt={product.artisans.full_name}
                                    />
                                    <div>
                                        <div className="small text-uppercase ls-1 text-white-50">Crafted By</div>
                                        <h5 className="fw-bold mb-0 text-white d-flex align-items-center flex-wrap gap-2 mt-1">
                                            {product.artisans.full_name}
                                            {product.artisans?.mastery_tier && (
                                                <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-2 py-1 rounded-pill small fw-normal d-flex align-items-center gap-1" style={{ fontSize: "0.7rem", transform: "translateY(-1px)" }}>
                                                    <Award size={10} /> {product.artisans.mastery_tier}
                                                </span>
                                            )}
                                        </h5>
                                        <div className="small text-white-50 mt-1">Specialty: {product.artisans.specialty}</div>
                                    </div>
                                    <Link href="/artisans" className="ms-auto btn btn-outline-warning btn-sm rounded-pill">Meet Master</Link>
                                </div>
                            </div>
                        )}

                        {/* USP GRID */}
                        <div className="row g-4 mb-5">
                            <div className="col-sm-6">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 bg-white bg-opacity-10 rounded-3 text-info">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div className="small">
                                        <div className="text-white fw-bold">Heritage Guarantee</div>
                                        <div className="text-white-50">100% Authentic Handcraft</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <Link href="/delivery/pakistan" className="text-decoration-none">
                                    <div className="d-flex align-items-center gap-3 p-2 rounded-3 hover-bg-white-5 transition-all">
                                        <div className="p-2 bg-warning bg-opacity-10 rounded-3 text-warning">
                                            <Truck size={20} />
                                        </div>
                                        <div className="small text-start">
                                            <div className="text-white fw-bold">Free Pakistan Delivery</div>
                                            <div className="text-white-50">Available across all 50+ major cities</div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {checkoutComplete ? (
                            <div className="p-4 mt-4 rounded-5 border border-success border-opacity-50 bg-success bg-opacity-10 d-flex flex-column align-items-center justify-content-center text-center animate-fade-in shadow-lg">
                                <CheckCircle size={48} className="text-success mb-3 pulse-animation" />
                                <h4 className="fw-bold text-white mb-2">Order Confirmed (Cash on Delivery)</h4>
                                <p className="text-white-50 mb-0">Your piece of tradition is being prepared by {product.artisans?.full_name || 'the artisan'}. You will pay upon delivery. Thank you for supporting Pakistani heritage!</p>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3 mt-4">
                                {product.stock === 0 && (
                                    <div className="alert alert-danger bg-danger bg-opacity-10 border border-danger border-opacity-25 text-danger rounded-4 py-3 d-flex align-items-center justify-content-center gap-2 mb-0">
                                        <Package size={20} />
                                        <span><strong>Out of Stock</strong> - This heritage piece is currently unavailable.</span>
                                    </div>
                                )}
                                <div className="d-flex gap-3">
                                    <button
                                        className={`btn ${isCheckingOut || product.stock === 0 ? 'btn-secondary position-relative overflow-hidden' : 'btn-warning'} rounded-pill px-5 py-3 fw-bold flex-grow-1 fs-5 d-flex align-items-center justify-content-center gap-2 shadow-lg hover-translate-y transition-all`}
                                        onClick={handleCheckoutClick}
                                        disabled={isCheckingOut || product.stock === 0}
                                    >
                                        {isCheckingOut ? (
                                            <>
                                                <span className="position-absolute w-100 h-100 bg-white bg-opacity-25 start-0 top-0 pulse-animation"></span>
                                                <Loader size={24} className="spin position-relative z-1" />
                                                <span className="position-relative z-1">Confirming COD...</span>
                                            </>
                                        ) : product.stock === 0 ? (
                                            "Out of Stock"
                                        ) : (
                                            <><ShoppingBag size={20} /> Buy with Cash on Delivery</>
                                        )}
                                    </button>
                                    <button
                                        className="btn btn-outline-light rounded-pill px-4 py-3 border-opacity-25 hover-bg-white hover-text-dark transition-all hover-translate-y d-flex align-items-center gap-2 fw-bold"
                                        onClick={() => addToCart(product)}
                                        disabled={product.stock === 0}
                                    >
                                        <Package size={20} /> Add to Cart
                                    </button>
                                </div>
                                <div className="text-center text-white-50 small mt-2 d-flex align-items-center justify-content-center gap-2">
                                    <Truck size={14} /> Free Shipping & Pay at your Doorstep
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* DETAILED FEATURES / STORY */}
                <div className="mt-5 pt-5 border-top border-white-10">
                    <div className="row g-5">
                        <div className="col-lg-8">
                            <h3 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <Hammer className="text-warning" /> The Craftsmanship Behind It
                            </h3>
                            <div className="text-white-50" style={{ lineHeight: "2" }}>
                                <p>
                                    This unique piece is the result of centuries of refined techniques passed down through generations.
                                    Using local materials and traditional toolsets, the artisan spends days ensuring every detail
                                    reflects the cultural significance of the {product.category} heritage.
                                </p>
                                <p>
                                    The dyes and materials are sourced ethically from the region of {product.artisans?.location || 'South Asia'},
                                    maintaining a low carbon footprint and supporting the local ecosystem of master craftsmen.
                                </p>

                                {product.audio_story_url && (
                                    <div className="mt-4 p-4 rounded-4 bg-white bg-opacity-5 border border-white-10 d-flex align-items-center justify-content-between flex-wrap gap-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="p-2 bg-warning bg-opacity-20 text-warning rounded-circle">
                                                <Volume2 size={24} />
                                            </div>
                                            <div>
                                                <div className="fw-bold text-white mb-1">Listen to the Artisan's Story</div>
                                                <div className="small text-white-50">AI-generated multi-modal narration in English</div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={toggleAudio}
                                            className="btn btn-warning rounded-pill px-4 d-flex align-items-center gap-2 fw-bold"
                                        >
                                            {isPlayingAudio ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Play Story</>}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="p-4 rounded-5 border border-white border-opacity-10 bg-white bg-opacity-2">
                                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                    <MapPin className="text-warning" size={18} /> Origin Details
                                </h5>
                                <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
                                    <li className="d-flex justify-content-between small">
                                        <span className="text-white-50">Region:</span>
                                        <span className="text-white">{product.artisans?.location || 'Heritage Site'}</span>
                                    </li>
                                    <li className="d-flex justify-content-between small">
                                        <span className="text-white-50">Technique:</span>
                                        <span className="text-white">{product.artisans?.specialty || 'Traditional'}</span>
                                    </li>
                                    <li className="d-flex justify-content-between small">
                                        <span className="text-white-50">Authenticity:</span>
                                        <span className="text-success fw-bold d-flex align-items-center gap-1">
                                            <ShieldCheck size={14} /> AI Verified
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* REVIEWS & RATINGS */}
                <div className="mt-5 pt-5 border-top border-white-10">
                    <div className="row g-5">
                        <div className="col-lg-12">
                            <h3 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <MessageSquare className="text-warning" /> Heritage Reviews
                            </h3>

                            {/* Write Review conditionally based on Auth */}
                            {isAuthCustomer ? (
                                <div className="p-4 rounded-5 border border-white-10 bg-white bg-opacity-5 mb-5">
                                    <h5 className="fw-bold mb-3 d-flex align-items-center gap-2"><Star size={18} className="text-warning" /> Write a Review</h5>
                                    <form onSubmit={handleSubmitReview} className="d-flex flex-column gap-3">
                                        <div>
                                            <label className="form-label small text-white-70">Rating</label>
                                            <div className="d-flex gap-2 mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button type="button" key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })} className={`btn btn-sm rounded-circle p-2 ${reviewForm.rating >= star ? 'btn-warning text-dark' : 'btn-outline-light border-opacity-25 text-white-50'}`}>
                                                        <Star size={16} fill={reviewForm.rating >= star ? "currentColor" : "none"} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="form-label small text-white-70">Your Review</label>
                                            <textarea required rows={3} className="form-control bg-dark text-white border-white-10 rounded-4 p-3 shadow-none" placeholder="Share your experience with this heritage piece..." value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}></textarea>
                                        </div>
                                        <div className="text-end">
                                            <button type="submit" disabled={isSubmittingReview} className="btn btn-warning rounded-pill px-4 py-2 fw-bold shadow-lg">
                                                {isSubmittingReview ? "Submitting..." : "Publish Review"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="p-4 rounded-4 bg-white bg-opacity-5 border border-white-10 mb-5 d-flex align-items-center justify-content-between flex-wrap gap-3">
                                    <div>
                                        <h6 className="fw-bold mb-1">Own this heritage piece?</h6>
                                        <p className="small text-white-50 mb-0">Sign in as a registered collector to leave a review.</p>
                                    </div>
                                    <Link href="/login" className="btn btn-outline-light rounded-pill px-4 text-nowrap">Sign In</Link>
                                </div>
                            )}

                            {/* Review List */}
                            <div className="d-flex flex-column gap-4">
                                {reviews.length === 0 ? (
                                    <div className="text-center p-5 border border-white-5 rounded-4 bg-white bg-opacity-2">
                                        <Star size={32} className="text-white-50 opacity-50 mb-3 mx-auto" />
                                        <p className="text-white-50 mb-0">Be the first collector to review this masterwork.</p>
                                    </div>
                                ) : (
                                    reviews.map((rev) => (
                                        <div key={rev.id} className="p-4 rounded-4 bg-dark bg-opacity-50 border border-white-5">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div className="fw-bold">{rev.customer_name}</div>
                                                <div className="small text-white-50">{new Date(rev.created_at).toLocaleDateString()}</div>
                                            </div>
                                            <div className="d-flex gap-1 mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} className={i < rev.rating ? "text-warning" : "text-white-50 opacity-25"} fill={i < rev.rating ? "currentColor" : "none"} />
                                                ))}
                                            </div>
                                            <p className="text-white-70 mb-0 small" style={{ lineHeight: "1.6" }}>{rev.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CHECKOUT MODAL */}
                {showModal && (
                    <div className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-75 d-flex align-items-center justify-content-center" style={{ zIndex: 1050 }}>
                        <div className="bg-dark p-5 rounded-5 border border-white border-opacity-10 position-relative shadow-lg animate-fade-in" style={{ maxWidth: '500px', width: '90%' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn btn-link text-white-50 position-absolute top-0 end-0 m-3 hover-text-white"
                            >
                                <X size={24} />
                            </button>

                            <h3 className="fw-bold mb-2">Shipping Details</h3>
                            <p className="text-white-50 mb-4 small">Please enter your details for Cash on Delivery. Pay only when you receive your heritage piece.</p>

                            <form onSubmit={confirmCodOrder} className="d-flex flex-column gap-3">
                                <div>
                                    <label className="form-label small text-white-70">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="form-control bg-white bg-opacity-10 border-white-10 text-white rounded-3 py-2"
                                        placeholder="Enter your name"
                                        value={shippingDetails.name}
                                        onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })}
                                        disabled={isCheckingOut}
                                    />
                                </div>
                                <div>
                                    <label className="form-label small text-white-70">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        className="form-control bg-white bg-opacity-10 border-white-10 text-white rounded-3 py-2"
                                        placeholder="For delivery updates"
                                        value={shippingDetails.phone}
                                        onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                                        disabled={isCheckingOut}
                                    />
                                </div>
                                <div>
                                    <label className="form-label small text-white-70">Pakistan Delivery City</label>
                                    <select
                                        required
                                        className="form-select bg-white bg-opacity-10 border-white-10 text-white rounded-3 py-2"
                                        value={shippingDetails.city}
                                        onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                                        disabled={isCheckingOut}
                                        style={{ backgroundColor: "rgb(33, 37, 41)" }}
                                    >
                                        <option value="" disabled>Select your city (All Pakistan)</option>
                                        {[
                                            "Abbottabad", "Bahawalnagar", "Bahawalpur", "Burewala", "Chaman", "Chiniot",
                                            "Dadu", "Dera Ghazi Khan", "Faisalabad", "Gojra", "Gujranwala", "Gujrat",
                                            "Hafizabad", "Hyderabad", "Islamabad", "Jacobabad", "Jhang", "Jhelum",
                                            "Kamoke", "Karachi", "Kasur", "Khanewal", "Khushab", "Khuzdar", "Kohat",
                                            "Lahore", "Larkana", "Mandi Bahauddin", "Mardan", "Mianwali", "Mingora",
                                            "Mirpur Khas", "Multan", "Muridke", "Muzaffargarh", "Nawabshah", "Nowshera",
                                            "Okara", "Pakpattan", "Peshawar", "Quetta", "Rahim Yar Khan", "Rawalpindi",
                                            "Sadikabad", "Sahiwal", "Sargodha", "Sheikhupura", "Shikarpur", "Sialkot",
                                            "Sukkur", "Swabi", "Tando Adam", "Vehari", "Wazirabad"
                                        ].map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label small text-white-70">Delivery Address</label>
                                    <textarea
                                        required
                                        className="form-control bg-white bg-opacity-10 border-white-10 text-white rounded-3 py-2"
                                        rows={2}
                                        placeholder="Complete local shipping address"
                                        value={shippingDetails.address}
                                        onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                                        disabled={isCheckingOut}
                                    ></textarea>
                                </div>

                                {/* Impact Fund Implementation */}
                                <div className="mt-2 p-3 bg-white bg-opacity-5 border border-warning border-opacity-25 rounded-4 shadow-sm">
                                    <label className="form-label small fw-bold text-warning d-flex align-items-center gap-2 mb-2">
                                        ✨ Direct-to-Artisan Impact Fund
                                    </label>
                                    <p className="small text-white-50 mb-3" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>
                                        100% of this contribution is routed directly to the master artisan, helping preserve centuries-old heritage techniques.
                                    </p>
                                    <div className="d-flex flex-wrap gap-2">
                                        {[0, 2, 5, 10, 20].map((tip) => (
                                            <button
                                                key={tip}
                                                type="button"
                                                className={`btn btn-sm rounded-pill fw-bold ${impactFundTip === tip ? "btn-warning text-dark" : "btn-outline-light border-opacity-25 text-white-50"} flex-grow-1 transition-all`}
                                                onClick={() => setImpactFundTip(tip)}
                                            >
                                                {tip === 0 ? "No Tip" : `+${formatPrice(tip)}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={`btn ${isCheckingOut ? 'btn-secondary position-relative overflow-hidden' : 'btn-warning'} rounded-pill mt-3 py-3 fw-bold d-flex align-items-center justify-content-center gap-2`}
                                    disabled={isCheckingOut}
                                >
                                    {isCheckingOut ? (
                                        <>
                                            <span className="position-absolute w-100 h-100 bg-white bg-opacity-25 start-0 top-0 pulse-animation"></span>
                                            <Loader size={20} className="spin position-relative z-1" />
                                            <span className="position-relative z-1">Confirming COD...</span>
                                        </>
                                    ) : (
                                        "Confirm & Place Order"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"></Script>
        </div>
    )
}
