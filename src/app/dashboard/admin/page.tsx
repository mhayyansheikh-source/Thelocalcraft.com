"use client"

import React, { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { db, auth } from "@/lib/firebase/config"
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc, addDoc, orderBy, getCountFromServer } from "firebase/firestore"
import { onAuthStateChanged, signOut } from "firebase/auth"
import {
    User,
    Shield,
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Database,
    Activity,
    Globe,
    ShoppingBag,
    FolderTree,
    Plus,
    Edit2,
    Trash2,
    Image as ImageIcon,
    MapPin,
    Loader,
    CheckCircle,
    XCircle,
    Briefcase
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [stats, setStats] = useState({ artisans: 0, orders: 0, revenue: 0 })
    const [recentOrders, setRecentOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const [activeTab, setActiveTab] = useState<"core" | "categories" | "users" | "wholesale">("core")
    const [categories, setCategories] = useState<any[]>([])
    const [pendingUsers, setPendingUsers] = useState<any[]>([])
    const [wholesaleApps, setWholesaleApps] = useState<any[]>([])
    const [allCommissions, setAllCommissions] = useState<any[]>([])
    const [showCatForm, setShowCatForm] = useState(false)
    const [editingCatId, setEditingCatId] = useState<string | null>(null)
    const [isSavingCat, setIsSavingCat] = useState(false)
    const [catForm, setCatForm] = useState({ name: "", description: "", image_url: "", heritage_site: "" })


    useEffect(() => {
        let unsubscribe: any;
        const checkUser = async () => {
            setLoading(true)
            
            unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    router.push("/login")
                    return
                }

                setUser(user)

                // Verify admin role
                const profileRef = doc(db, "profiles", user.uid)
                const profileSnap = await getDoc(profileRef)

                if (!profileSnap.exists() || profileSnap.data().role !== "admin") {
                    await signOut(auth)
                    router.push("/login")
                    return
                }

                const profileData = profileSnap.data()
                setProfile(profileData)

                // Fetch high-level platform stats
                try {
                    const artisansQ = query(collection(db, 'profiles'), where('role', '==', 'artisan'))
                    const artisansSnap = await getCountFromServer(artisansQ)
                    const artisansCount = artisansSnap.data().count

                    const ordersQ = query(collection(db, 'orders'), orderBy('created_at', 'desc'))
                    const ordersSnap = await getDocs(ordersQ)
                    const globalOrders = ordersSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })).slice(0, 10)
                    
                    const totalRevenue = globalOrders.reduce((acc, order) => acc + (order.total_amount || 0), 0)

                    setStats({
                        artisans: artisansCount || 0,
                        orders: globalOrders.length || 0,
                        revenue: totalRevenue
                    })

                    setRecentOrders(globalOrders)

                    const catQ = query(collection(db, 'categories'), orderBy('created_at', 'desc'))
                    const catSnap = await getDocs(catQ)
                    setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })))

                    const pendingQ = query(collection(db, 'profiles'), where('status', '==', 'pending'))
                    const pendingSnap = await getDocs(pendingQ)
                    setPendingUsers(pendingSnap.docs.map(d => ({ id: d.id, ...d.data() })))

                    const wsQ = query(collection(db, 'wholesale_applications'), orderBy('created_at', 'desc'))
                    const wsSnap = await getDocs(wsQ)
                    const wsData = []
                    for (const w of wsSnap.docs) {
                        const wD = w.data()
                        let pData = null
                        if (wD.user_id) {
                            const pSnap = await getDoc(doc(db, "profiles", wD.user_id))
                            if (pSnap.exists()) pData = pSnap.data()
                        }
                        wsData.push({ id: w.id, ...wD, profiles: pData })
                    }
                    setWholesaleApps(wsData)

                    const commQ = query(collection(db, 'commissions'), orderBy('created_at', 'desc'))
                    const commSnap = await getDocs(commQ)
                    const commData = []
                    for (const c of commSnap.docs) {
                        const cD = c.data()
                        let oData = null
                        let pData = null
                        if (cD.order_id) {
                            const oSnap = await getDoc(doc(db, 'orders', cD.order_id))
                            if (oSnap.exists()) oData = oSnap.data()
                        }
                        if (cD.partner_id) {
                            const pSnap = await getDoc(doc(db, 'profiles', cD.partner_id))
                            if (pSnap.exists()) pData = pSnap.data()
                        }
                        commData.push({ id: c.id, ...cD, orders: oData, profiles: pData })
                    }
                    setAllCommissions(commData)
                } catch (err: any) {
                    console.error("Dashboard error", err)
                }

                setLoading(false)
            })
        }
        checkUser()
        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [router])

    const handleLogout = async () => {
        await signOut(auth)
        router.push("/")
    }

    const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, 'orders', orderId), { status: newStatus })
            setRecentOrders(recentOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        } catch (error: any) {
            console.error("Status Update Failed", error)
            alert("Could not update order status.")
        }
    }

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSavingCat(true)
        try {
            if (editingCatId) {
                await updateDoc(doc(db, 'categories', editingCatId), catForm)
                setCategories(categories.map(c => c.id === editingCatId ? { ...c, ...catForm } : c))
            } else {
                const docRef = await addDoc(collection(db, 'categories'), { ...catForm, created_at: new Date().toISOString() })
                setCategories([{ id: docRef.id, ...catForm }, ...categories])
            }
            setShowCatForm(false)
            setEditingCatId(null)
            setCatForm({ name: "", description: "", image_url: "", heritage_site: "" })
        } catch (error: any) {
            console.error("Save failed", error)
            alert(error.message || "Failed to save category.")
        } finally {
            setIsSavingCat(false)
        }
    }

    const editCategory = (cat: any) => {
        setEditingCatId(cat.id)
        setCatForm({
            name: cat.name || "",
            description: cat.description || "",
            image_url: cat.image_url || "",
            heritage_site: cat.heritage_site || ""
        })
        setShowCatForm(true)
    }

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Permanently delete this master category and unbind all products?")) return
        try {
            await deleteDoc(doc(db, 'categories', id))
            setCategories(categories.filter(c => c.id !== id))
        } catch (error: any) {
            console.error(error)
            alert("Delete failed.")
        }
    }

    const handleUserStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, 'profiles', id), { status: newStatus })
            setPendingUsers(pendingUsers.filter(u => u.id !== id))
        } catch (error: any) {
            console.error(error)
            alert("Failed to update user status")
        }
    }

    const handleWholesaleAction = async (id: string, userId: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, 'wholesale_applications', id), { status: newStatus })
            if (newStatus === 'approved') {
                await updateDoc(doc(db, 'profiles', userId), { role: 'wholesale', status: 'approved' })
            }
            setWholesaleApps(wholesaleApps.map(a => a.id === id ? { ...a, status: newStatus } : a))
        } catch (error: any) {
            console.error(error)
            alert("Failed to update wholesale application")
        }
    }

    if (loading) return (

        <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Syncing Core...</span>
            </div>
        </div>
    )

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="container-fluid flex-grow-1 pt-5 mt-5 px-lg-5">
                <div className="row g-5 h-100">
                    {/* SIDEBAR */}
                    <aside className="col-lg-3 d-none d-lg-block">
                        <div className="sticky-top pt-4 h-100" style={{ top: "100px" }}>
                            <div className="p-4 rounded-5 h-100 d-flex flex-column" style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
                                <div className="d-flex align-items-center gap-3 mb-5 pb-4 border-bottom border-white border-opacity-10">
                                    <div className="rounded-circle border border-danger border-opacity-50 p-2 bg-danger bg-opacity-10">
                                        <Shield size={32} className="text-danger shadow-lg" />
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-0 text-white truncate-1">{profile?.full_name || "System Admin"}</h6>
                                        <div className="small text-danger d-flex align-items-center gap-1">
                                            <Globe size={12} /> Global Access
                                        </div>
                                    </div>
                                </div>

                                <nav className="d-flex flex-column gap-2 mb-auto pb-5">
                                    <button onClick={() => setActiveTab("core")} className={`btn ${activeTab === 'core' ? 'btn-danger shadow-lg text-white' : 'btn-link border border-transparent text-white-50 text-decoration-none hover-bg-white-5'} rounded-pill py-3 px-4 fw-bold d-flex align-items-center gap-3 w-100 text-start transition-all`}>
                                        <LayoutDashboard size={20} /> System Core
                                    </button>
                                    <button onClick={() => setActiveTab("categories")} className={`btn ${activeTab === 'categories' ? 'btn-danger shadow-lg text-white' : 'btn-link border border-transparent text-white-50 text-decoration-none hover-bg-white-5'} rounded-pill py-3 px-4 fw-bold d-flex align-items-center gap-3 w-100 text-start transition-all`}>
                                        <FolderTree size={20} /> Heritage Categories
                                    </button>
                                    <button onClick={() => setActiveTab("users")} className={`btn ${activeTab === 'users' ? 'btn-danger shadow-lg text-white' : 'btn-link border border-transparent text-white-50 text-decoration-none hover-bg-white-5'} rounded-pill py-3 px-4 fw-bold d-flex align-items-center gap-3 w-100 text-start transition-all`}>
                                        <Users size={20} /> Identity Access {pendingUsers.length > 0 && <span className="badge bg-white text-danger fw-bold ms-auto rounded-pill">{pendingUsers.length}</span>}
                                    </button>
                                    <button onClick={() => setActiveTab("wholesale")} className={`btn ${activeTab === 'wholesale' ? 'btn-danger shadow-lg text-white' : 'btn-link border border-transparent text-white-50 text-decoration-none hover-bg-white-5'} rounded-pill py-3 px-4 fw-bold d-flex align-items-center gap-3 w-100 text-start transition-all`}>
                                        <Briefcase size={20} /> Wholesale Management {wholesaleApps.filter(a => a.status === 'pending').length > 0 && <span className="badge bg-white text-danger fw-bold ms-auto rounded-pill">{wholesaleApps.filter(a => a.status === 'pending').length}</span>}
                                    </button>
                                    <button className="btn btn-link text-white-50 text-decoration-none rounded-pill py-3 px-4 fw-bold d-flex align-items-center gap-3 w-100 text-start hover-bg-white-5 transition-all">
                                        <Database size={20} /> Supabase Nodes
                                    </button>
                                </nav>

                                <button
                                    onClick={handleLogout}
                                    className="btn btn-outline-danger border-opacity-20 rounded-pill py-3 px-4 fw-bold d-flex align-items-center gap-3 w-100 text-start hover-bg-danger hover-text-white mt-auto transition-all"
                                >
                                    <LogOut size={20} /> Terminate Session
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <div className="col-lg-9 py-4">
                        {/* MOBILE NAV */}
                        <div className="d-lg-none mb-4 overflow-hidden">
                            <div className="d-flex overflow-x-auto pb-2 gap-2 hide-scrollbar" style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                <button onClick={() => setActiveTab("core")} className={`btn ${activeTab === 'core' ? 'btn-danger' : 'btn-outline-light border-opacity-25'} rounded-pill px-4 py-2 text-nowrap fw-bold flex-shrink-0 d-flex align-items-center gap-2`}>
                                    <LayoutDashboard size={16} /> Core
                                </button>
                                <button onClick={() => setActiveTab("categories")} className={`btn ${activeTab === 'categories' ? 'btn-danger' : 'btn-outline-light border-opacity-25'} rounded-pill px-4 py-2 text-nowrap fw-bold flex-shrink-0 d-flex align-items-center gap-2`}>
                                    <FolderTree size={16} /> Categories
                                </button>
                                <button onClick={() => setActiveTab("users")} className={`btn ${activeTab === 'users' ? 'btn-danger' : 'btn-outline-light border-opacity-25'} rounded-pill px-4 py-2 text-nowrap fw-bold flex-shrink-0 d-flex align-items-center gap-2`}>
                                    <Users size={16} /> Identity {pendingUsers.length > 0 && `(${pendingUsers.length})`}
                                </button>
                                <button onClick={() => setActiveTab("wholesale")} className={`btn ${activeTab === 'wholesale' ? 'btn-danger' : 'btn-outline-light border-opacity-25'} rounded-pill px-4 py-2 text-nowrap fw-bold flex-shrink-0 d-flex align-items-center gap-2`}>
                                    <Briefcase size={16} /> Wholesale {wholesaleApps.filter(a => a.status === 'pending').length > 0 && `(${wholesaleApps.filter(a => a.status === 'pending').length})`}
                                </button>
                            </div>
                        </div>

                        {activeTab === 'core' ? (
                            <>
                                <header className="mb-5 d-flex flex-wrap align-items-end justify-content-between gap-4 animate-fade-in">
                                    <div>
                                        <h1 className="fw-bold mb-2 text-uppercase" style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", letterSpacing: "-1px" }}>Central <span className="text-danger">Command.</span></h1>
                                        <p className="text-white-50 opacity-75 lead mb-0" style={{ fontSize: "clamp(1rem, 3vw, 1.25rem)" }}>System operations are nominal. AI safeguards and global logistics are actively tracking.</p>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <button className="btn btn-danger rounded-pill px-4 py-3 fw-bold d-flex align-items-center gap-2 shadow-lg hover-translate-y transition-all">
                                            <Activity size={18} /> Diagnostics
                                        </button>
                                    </div>
                                </header>

                                <div className="row g-4 mb-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                    <div className="col-md-4">
                                        <div className="p-4 rounded-4 h-100 hover-translate-y transition-all" style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
                                            <div className="d-flex align-items-center justify-content-between mb-4">
                                                <h6 className="text-white-50 mb-0 fw-bold ls-1 text-uppercase small">Network Artisans</h6>
                                                <div className="p-2 bg-info bg-opacity-10 text-info rounded-circle">
                                                    <Users size={20} />
                                                </div>
                                            </div>
                                            <div className="display-4 fw-bold text-white">{stats.artisans}</div>
                                            <div className="text-success small mt-2 d-flex align-items-center justify-content-start gap-1">
                                                Active globally
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="p-4 rounded-4 h-100 hover-translate-y transition-all" style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
                                            <div className="d-flex align-items-center justify-content-between mb-4">
                                                <h6 className="text-white-50 mb-0 fw-bold ls-1 text-uppercase small">Transaction Node</h6>
                                                <div className="p-2 bg-warning bg-opacity-10 text-warning rounded-circle">
                                                    <ShoppingBag size={20} />
                                                </div>
                                            </div>
                                            <div className="display-4 fw-bold text-white">{stats.orders}</div>
                                            <div className="text-white-50 small mt-2 d-flex align-items-center justify-content-start gap-1">
                                                Orders scaling nominal
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="p-4 rounded-4 border border-danger border-opacity-25 bg-danger bg-opacity-10 h-100 hover-translate-y transition-all">
                                            <div className="d-flex align-items-center justify-content-between mb-4">
                                                <h6 className="text-danger opacity-75 mb-0 fw-bold ls-1 text-uppercase small">Global Pipeline</h6>
                                                <div className="p-2 bg-danger bg-opacity-25 text-white rounded-circle">
                                                    <Activity size={20} />
                                                </div>
                                            </div>
                                            <div className="display-4 fw-bold text-white">${stats.revenue.toFixed(2)}</div>
                                            <div className="text-white-50 small mt-2 d-flex align-items-center justify-content-start gap-1">
                                                Captured revenue metrics
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Deep Metrics */}
                                <div className="p-4 p-md-5 rounded-4 position-relative overflow-hidden mb-5 animate-fade-in-up" style={{ animationDelay: '0.2s', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
                                    <div className="position-absolute w-100 h-100 top-0 start-0 opacity-10 blur-3xl" style={{ background: "radial-gradient(circle at top right, #dc3545, transparent)" }}></div>

                                    <div className="position-relative z-1">
                                        <h4 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                            <Globe className="text-danger" /> Live Network Stream
                                        </h4>

                                        {recentOrders.length === 0 ? (
                                            <div className="text-center py-5">
                                                <Database size={32} className="mb-3 opacity-25 mx-auto text-white-50" />
                                                <p className="text-white-50">Log stream empty. Waiting for transaction payloads.</p>
                                            </div>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-dark table-borderless table-hover align-middle mb-0">
                                                    <thead>
                                                        <tr className="border-bottom border-white-10 text-white-50 small text-uppercase ls-1">
                                                            <th className="py-3 font-weight-bold">Order UID</th>
                                                            <th className="py-3 font-weight-bold">Customer Entity</th>
                                                            <th className="py-3 font-weight-bold">Routing Addr</th>
                                                            <th className="py-3 font-weight-bold text-end">Payload Value</th>
                                                            <th className="py-3 font-weight-bold text-center">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {recentOrders.map(order => (
                                                            <tr key={order.id} className="border-bottom border-white border-opacity-5">
                                                                <td className="py-3 font-monospace small text-white-50">{order.id.split('-')[0]}</td>
                                                                <td className="py-3 fw-bold">{order.customer_name}</td>
                                                                <td className="py-3 text-white-50 small text-truncate" style={{ maxWidth: "200px" }}>{order.customer_address}</td>
                                                                <td className="py-3 fw-bold text-warning text-end">${order.total_amount?.toFixed(2)}</td>
                                                                <td className="py-3 text-center">
                                                                    <select
                                                                        className={`form-select form-select-sm text-center d-inline w-auto fw-bold shadow-sm ${order.status === 'pending' ? 'bg-warning text-dark' : order.status === 'processing' ? 'bg-info text-dark' : order.status === 'shipped' ? 'bg-primary text-white' : order.status === 'cancelled' ? 'bg-danger text-white' : 'bg-success text-white'} border-0 rounded-pill`}
                                                                        value={order.status}
                                                                        onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                                                                        style={{ cursor: "pointer", appearance: "none", paddingRight: "1.5rem" }}
                                                                    >
                                                                        <option value="pending" className="bg-dark text-white">Pending</option>
                                                                        <option value="processing" className="bg-dark text-white">Processing</option>
                                                                        <option value="shipped" className="bg-dark text-white">Shipped</option>
                                                                        <option value="delivered" className="bg-dark text-white">Delivered</option>
                                                                        <option value="cancelled" className="bg-dark text-white">Cancelled</option>
                                                                    </select>
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
                        ) : activeTab === 'categories' ? (
                            <div className="animate-fade-in-up">
                                <header className="mb-4 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h2 className="display-6 fw-bold mb-2 d-flex align-items-center gap-3">
                                            <FolderTree className="text-danger" size={32} /> Category Registry
                                        </h2>
                                        <p className="text-white-50 mb-0">Define strict heritage structural paths for platform filtering.</p>
                                    </div>
                                    {!showCatForm && (
                                        <button onClick={() => {
                                            setEditingCatId(null)
                                            setCatForm({ name: "", description: "", image_url: "", heritage_site: "" })
                                            setShowCatForm(true)
                                        }} className="btn btn-danger rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow-lg hover-scale">
                                            <Plus size={18} /> Append Category
                                        </button>
                                    )}
                                </header>

                                {showCatForm ? (
                                    <div className="p-4 p-md-5 rounded-5 animate-fade-in relative z-1" style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
                                        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-white-10">
                                            <h4 className="fw-bold m-0">{editingCatId ? "Modify Infrastructure" : "Deploy Validation Path"}</h4>
                                            <button onClick={() => setShowCatForm(false)} className="btn btn-outline-light rounded-pill px-3 m-0 border-opacity-20 text-white-50 hover-text-white transition-all">
                                                Cancel
                                            </button>
                                        </div>
                                        <form onSubmit={handleSaveCategory} className="d-flex flex-column gap-4">
                                            <div className="row g-4">
                                                <div className="col-md-6">
                                                    <label className="form-label small text-white-50 text-uppercase ls-1">Registry Key / Name</label>
                                                    <input type="text" required value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} className="form-control bg-dark bg-opacity-50 border border-white-10 text-white rounded-4 p-3 shadow-none" placeholder="e.g. Copperware" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label small text-white-50 text-uppercase ls-1">Heritage Mapping Site</label>
                                                    <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                        <span className="input-group-text bg-transparent border-0 text-white-50"><MapPin size={16} /></span>
                                                        <input type="text" value={catForm.heritage_site} onChange={e => setCatForm({ ...catForm, heritage_site: e.target.value })} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="e.g. Peshawar" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="form-label small text-white-50 text-uppercase ls-1">Thumbnail Stream Addr (URL)</label>
                                                <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                    <span className="input-group-text bg-transparent border-0 text-white-50"><ImageIcon size={16} /></span>
                                                    <input type="url" required value={catForm.image_url} onChange={e => setCatForm({ ...catForm, image_url: e.target.value })} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="https://..." />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="form-label small text-white-50 text-uppercase ls-1">Core Description</label>
                                                <textarea rows={3} required value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} className="form-control bg-dark bg-opacity-50 border border-white-10 text-white rounded-4 p-3 shadow-none" placeholder="Historical parameters..."></textarea>
                                            </div>

                                            <div className="mt-3">
                                                <button type="submit" disabled={isSavingCat} className="btn btn-danger rounded-pill px-5 py-3 fw-bold shadow-lg d-inline-flex align-items-center gap-2 hover-scale">
                                                    {isSavingCat ? <Loader size={20} className="spin" /> : <>Execute Transaction <Database size={18} /></>}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="table-responsive rounded-4 mt-4 overflow-hidden" style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
                                        <table className="table table-dark table-borderless table-hover align-middle mb-0">
                                            <thead>
                                                <tr className="border-bottom border-white-10 text-white-50 small text-uppercase ls-1 bg-white bg-opacity-5">
                                                    <th className="py-3 px-4 font-weight-bold">Registry</th>
                                                    <th className="py-3 font-weight-bold">Heritage Link</th>
                                                    <th className="py-3 font-weight-bold">Nodes Connected</th>
                                                    <th className="py-3 font-weight-bold text-end pe-4">System Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categories.map(cat => (
                                                    <tr key={cat.id} className="border-bottom border-white border-opacity-5 hover-bg-white-5 transition-all">
                                                        <td className="py-3 px-4">
                                                            <div className="d-flex align-items-center gap-3">
                                                                {cat.image_url && (
                                                                    <div className="rounded-3 overflow-hidden bg-white bg-opacity-10 d-none d-sm-block flex-shrink-0" style={{ width: "40px", height: "40px" }}>
                                                                        <img src={cat.image_url} alt="" className="w-100 h-100 object-fit-cover" />
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <div className="fw-bold">{cat.name}</div>
                                                                    <div className="small text-white-50 text-truncate" style={{ maxWidth: '250px' }}>{cat.description}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 text-white-50">
                                                            {cat.heritage_site ? (
                                                                <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 rounded-pill px-2">
                                                                    <MapPin size={10} className="me-1" /> {cat.heritage_site}
                                                                </span>
                                                            ) : (
                                                                <span className="small opacity-50">Null pointer</span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 font-monospace small text-white-50">
                                                            Auto-scaling
                                                        </td>
                                                        <td className="py-3 pe-4 text-end">
                                                            <div className="d-flex align-items-center justify-content-end gap-2">
                                                                <button onClick={() => editCategory(cat)} className="btn btn-sm btn-outline-light border-white-20 rounded-pill px-3 py-1 hover-bg-white-10 hover-text-white transition-all d-flex align-items-center gap-1">
                                                                    <Edit2 size={14} /> Update
                                                                </button>
                                                                <button onClick={() => handleDeleteCategory(cat.id)} className="btn btn-sm bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 rounded-pill p-2 hover-bg-danger hover-text-white transition-all" title="Purge Node">
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {categories.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="text-center py-5 text-white-50">
                                                            No categories registered in global index.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ) : activeTab === 'wholesale' ? (
                            <div className="animate-fade-in">
                                <header className="mb-5 d-flex flex-wrap align-items-center justify-content-between gap-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 bg-danger bg-opacity-10 rounded-4">
                                            <Briefcase className="text-danger" size={32} />
                                        </div>
                                        <div>
                                            <h1 className="display-6 fw-bold mb-1">Wholesale Command</h1>
                                            <p className="text-white-50 lead fs-6 mb-0">Manage B2B partners and commission settlements.</p>
                                        </div>
                                    </div>
                                </header>

                                <div className="mb-5">
                                    <h4 className="fw-bold mb-4">Pending Applications</h4>
                                    <div className="table-responsive rounded-4 overflow-hidden shadow-lg" style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
                                        <table className="table table-dark table-borderless align-middle mb-0">
                                            <thead>
                                                <tr className="bg-white bg-opacity-5 text-white-50 small text-uppercase">
                                                    <th className="py-3 px-4">Business</th>
                                                    <th className="py-3">Contact</th>
                                                    <th className="py-3">Type</th>
                                                    <th className="py-3 text-end pe-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {wholesaleApps.filter(a => a.status === 'pending').map(app => (
                                                    <tr key={app.id} className="border-bottom border-white-5">
                                                        <td className="py-3 px-4">
                                                            <div className="fw-bold">{app.business_name}</div>
                                                            <div className="small text-white-50">{app.profiles?.full_name}</div>
                                                        </td>
                                                        <td className="py-3">
                                                            <div className="small font-monospace">{app.phone}</div>
                                                            <div className="small text-white-50 text-truncate" style={{ maxWidth: '150px' }}>{app.website}</div>
                                                        </td>
                                                        <td className="py-3">
                                                            <span className="badge bg-info bg-opacity-10 text-info rounded-pill px-2">{app.business_type}</span>
                                                        </td>
                                                        <td className="py-3 pe-4 text-end">
                                                            <div className="d-flex gap-2 justify-content-end">
                                                                <button onClick={() => handleWholesaleAction(app.id, app.user_id, 'approved')} className="btn btn-sm btn-success rounded-pill px-3 shadow-sm">Approve</button>
                                                                <button onClick={() => handleWholesaleAction(app.id, app.user_id, 'rejected')} className="btn btn-sm btn-outline-danger rounded-pill px-3">Reject</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {wholesaleApps.filter(a => a.status === 'pending').length === 0 && (
                                                    <tr><td colSpan={4} className="text-center py-5 text-white-50">No pending B2B applications.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="fw-bold mb-4">Commission Register</h4>
                                    <div className="table-responsive rounded-4 overflow-hidden shadow-lg" style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
                                        <table className="table table-dark table-borderless align-middle mb-0">
                                            <thead>
                                                <tr className="bg-white bg-opacity-5 text-white-50 small text-uppercase">
                                                    <th className="py-3 px-4">Partner</th>
                                                    <th className="py-3">Earnings</th>
                                                    <th className="py-3">Status</th>
                                                    <th className="py-3 text-end pe-4">Order Ref</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allCommissions.map(comm => (
                                                    <tr key={comm.id} className="border-bottom border-white-5">
                                                        <td className="py-3 px-4">
                                                            <div className="fw-bold">{comm.profiles?.full_name}</div>
                                                        </td>
                                                        <td className="py-3 text-warning fw-bold">${comm.amount}</td>
                                                        <td className="py-3">
                                                            <span className={`badge rounded-pill px-2 ${comm.status === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>{comm.status}</span>
                                                        </td>
                                                        <td className="py-3 pe-4 text-end text-white-50 small font-monospace">#{comm.orders?.id?.split('-')[0]}</td>
                                                    </tr>
                                                ))}
                                                {allCommissions.length === 0 && (
                                                    <tr><td colSpan={4} className="text-center py-5 text-white-50">No commission payouts registered.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'users' ? (
                            <div className="animate-fade-in">
                                <header className="mb-5 d-flex flex-wrap align-items-center justify-content-between gap-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-3 bg-danger bg-opacity-10 rounded-4">
                                            <Users className="text-danger" size={32} />
                                        </div>
                                        <div>
                                            <h1 className="display-6 fw-bold mb-1">Identity Access</h1>
                                            <p className="text-white-50 lead fs-6 mb-0">Manage platform onboarding approvals.</p>
                                        </div>
                                    </div>
                                </header>

                                <div className="table-responsive bg-dark rounded-4 border border-white-10 overflow-hidden">
                                    <table className="table table-dark table-borderless table-hover align-middle mb-0">
                                        <thead>
                                            <tr className="border-bottom border-white-10 text-white-50 small text-uppercase ls-1 bg-white bg-opacity-5">
                                                <th className="py-3 px-4 font-weight-bold">User Identity</th>
                                                <th className="py-3 font-weight-bold">Role Attempt</th>
                                                <th className="py-3 font-weight-bold">Created On</th>
                                                <th className="py-3 font-weight-bold text-end pe-4">Approval Override</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingUsers.map(u => (
                                                <tr key={u.id} className="border-bottom border-white border-opacity-5 hover-bg-white-5 transition-all">
                                                    <td className="py-3 px-4">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="rounded-circle bg-white bg-opacity-10 d-flex align-items-center justify-content-center text-white" style={{ width: "40px", height: "40px" }}>
                                                                <User size={18} />
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold">{u.full_name || u.username || 'Anonymous Node'}</div>
                                                                <div className="small text-white-50 font-monospace" style={{ fontSize: '10px' }}>{u.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className={`badge ${u.role === 'artisan' ? 'bg-warning text-dark' : 'bg-info bg-opacity-10 text-info'} rounded-pill px-3 py-2 text-uppercase ls-1`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-white-50 small">
                                                        {new Date(u.updated_at || new Date()).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-3 pe-4 text-end">
                                                        <div className="d-flex align-items-center justify-content-end gap-2">
                                                            <button onClick={() => handleUserStatusUpdate(u.id, 'approved')} className="btn btn-sm btn-outline-success border-success border-opacity-25 rounded-pill px-3 py-1 hover-bg-success hover-text-white transition-all d-flex align-items-center gap-1">
                                                                <CheckCircle size={14} /> Approve
                                                            </button>
                                                            <button onClick={() => handleUserStatusUpdate(u.id, 'rejected')} className="btn btn-sm btn-outline-danger border-danger border-opacity-25 rounded-pill px-3 py-1 hover-bg-danger hover-text-white transition-all d-flex align-items-center gap-1">
                                                                <XCircle size={14} /> Reject
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {pendingUsers.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="text-center py-5 text-white-50">
                                                        No pending access requests. System is completely synchronized.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </main>
        </div>
    )
}
