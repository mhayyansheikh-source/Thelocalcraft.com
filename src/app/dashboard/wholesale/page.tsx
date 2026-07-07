"use client"

import React, { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { db, auth } from "@/lib/firebase/config"
import { collection, query, where, getDocs, doc, getDoc, orderBy } from "firebase/firestore"
import { onAuthStateChanged, signOut } from "firebase/auth"
import {
    User,
    Shield,
    LayoutDashboard,
    ShoppingBag,
    TrendingUp,
    Settings,
    LogOut,
    CheckCircle,
    Package,
    ArrowUpRight,
    DollarSign,
    Briefcase,
    Globe,
    Clock,
    Award,
    Database,
    ChevronRight,
    ArrowRight,
    Search
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function WholesaleDashboard() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [stats, setStats] = useState({ orders: 0, commission: 0, pendingPayout: 0 })
    const [orders, setOrders] = useState<any[]>([])
    const [commissions, setCommissions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "commission" | "settings">("dashboard")

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

                // Fetch profile
                const profileSnap = await getDoc(doc(db, "profiles", user.uid))
                if (profileSnap.exists()) {
                    const profileData = profileSnap.data()
                    setProfile(profileData)
                    if (profileData.role !== "wholesale" && profileData.role !== "admin") {
                        // Check if application is pending
                        const q = query(collection(db, "wholesale_applications"), where("user_id", "==", user.uid))
                        const appSnaps = await getDocs(q)
                        let isApproved = false
                        for (const docSnap of appSnaps.docs) {
                            if (docSnap.data().status === 'approved') isApproved = true
                        }
                        
                        if (!isApproved) {
                            router.push("/apply/wholesale")
                            return
                        }
                    }
                }

                // Fetch Data
                try {
                    const ordersQ = query(collection(db, "orders"), where("partner_id", "==", user.uid), orderBy("created_at", "desc"))
                    const ordersSnaps = await getDocs(ordersQ)
                    const myOrders = ordersSnaps.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                    setOrders(myOrders)

                    const commsQ = query(collection(db, "commissions"), where("partner_id", "==", user.uid), orderBy("created_at", "desc"))
                    const commsSnaps = await getDocs(commsQ)
                    const myCommissions: any[] = []
                    for (const c of commsSnaps.docs) {
                        const cData = c.data()
                        let orderData = null
                        if (cData.order_id) {
                            const oSnap = await getDoc(doc(db, "orders", cData.order_id))
                            if (oSnap.exists()) orderData = { id: oSnap.id, ...oSnap.data() }
                        }
                        myCommissions.push({ id: c.id, ...cData, orders: orderData })
                    }
                    
                    setCommissions(myCommissions)

                    // Calculate Stats
                    const totalCommission = myCommissions.reduce((acc, c) => acc + Number(c.amount || 0), 0)
                    const pendingPayout = myCommissions.filter(c => c.status === 'pending').reduce((acc, c) => acc + Number(c.amount || 0), 0)

                    setStats({
                        orders: myOrders.length,
                        commission: totalCommission,
                        pendingPayout: pendingPayout
                    })
                } catch (error: any) {
                    console.error("Error fetching dashboard data", error)
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

    if (loading) return (
        <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-grow text-warning" role="status">
                <span className="visually-hidden">Authenticating B2B Access...</span>
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
                            <div className="p-4 rounded-5 border border-white border-opacity-10 bg-white bg-opacity-5 h-100 d-flex flex-column shadow-2xl">
                                <div className="d-flex align-items-center gap-3 mb-5 pb-4 border-bottom border-white border-opacity-10">
                                    <div className="rounded-circle border border-warning border-opacity-25 p-1 bg-warning bg-opacity-10">
                                        <div className="rounded-circle bg-warning text-dark fw-bold d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                                            {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-0 text-white truncate-1">{profile?.full_name || "B2B Partner"}</h6>
                                        <div className="small text-warning d-flex align-items-center gap-1">
                                            <Award size={12} /> Elite Distributor
                                        </div>
                                    </div>
                                </div>

                                <nav className="d-flex flex-column gap-2 mb-auto pb-5">
                                    <button onClick={() => setActiveTab("dashboard")} className={`btn ${activeTab === 'dashboard' ? 'btn-warning shadow-lg text-dark' : 'btn-link border border-transparent text-white-50 text-decoration-none hover-bg-white-5'} rounded-pill py-3 px-4 fw-bold d-flex align-items-center gap-3 w-100 text-start transition-all`}>
                                        <LayoutDashboard size={20} /> Portal Overview
                                    </button>
                                    <button onClick={() => setActiveTab("orders")} className={`btn ${activeTab === 'orders' ? 'btn-warning shadow-lg text-dark' : 'btn-link border border-transparent text-white-50 text-decoration-none hover-bg-white-5'} rounded-pill py-3 px-4 fw-bold d-flex align-items-center gap-3 w-100 text-start transition-all`}>
                                        <ShoppingBag size={20} /> Order History
                                    </button>
                                    <button onClick={() => setActiveTab("commission")} className={`btn ${activeTab === 'commission' ? 'btn-warning shadow-lg text-dark' : 'btn-link border border-transparent text-white-50 text-decoration-none hover-bg-white-5'} rounded-pill py-3 px-4 fw-bold d-flex align-items-center gap-3 w-100 text-start transition-all`}>
                                        <DollarSign size={20} /> Commission Log
                                    </button>
                                    <button onClick={() => setActiveTab("settings")} className={`btn ${activeTab === 'settings' ? 'btn-warning shadow-lg text-dark' : 'btn-link border border-transparent text-white-50 text-decoration-none hover-bg-white-5'} rounded-pill py-3 px-4 fw-bold d-flex align-items-center gap-3 w-100 text-start transition-all`}>
                                        <Settings size={20} /> Business Settings
                                    </button>
                                </nav>

                                <button onClick={handleLogout} className="btn btn-outline-danger border-opacity-20 rounded-pill py-3 px-4 fw-bold d-flex align-items-center gap-3 w-100 text-start hover-bg-danger hover-text-white mt-auto transition-all">
                                    <LogOut size={20} /> Terminate Session
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT */}
                    <div className="col-lg-9 py-4 animate-fade-in-up">
                        {activeTab === 'dashboard' ? (
                            <>
                                <header className="mb-5 d-flex flex-wrap align-items-end justify-content-between gap-4">
                                    <div>
                                        <h1 className="display-4 fw-bold mb-2">Heritage <span className="text-warning">Partner.</span></h1>
                                        <p className="text-white-50 opacity-75 lead mb-0">Welcome to your B2B Command Center. Track global orders and growth assets.</p>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <Link href="/explore" className="btn btn-warning rounded-pill px-4 py-3 fw-bold d-flex align-items-center gap-2 shadow-lg hover-translate-y transition-all">
                                            <Search size={18} /> Exclusive Catalog
                                        </Link>
                                    </div>
                                </header>

                                {/* Stats Overview */}
                                <div className="row g-4 mb-5">
                                    <div className="col-md-4">
                                        <div className="p-4 rounded-5 border border-white-10 bg-white bg-opacity-5 h-100 hover-translate-y transition-all shadow-xl">
                                            <div className="d-flex align-items-center justify-content-between mb-3 text-warning">
                                                <ShoppingBag size={24} />
                                                <span className="small text-success fw-bold d-flex align-items-center gap-1">+8% <ArrowUpRight size={12} /></span>
                                            </div>
                                            <div className="display-5 fw-bold text-white mb-1">{stats.orders}</div>
                                            <div className="small text-white-50 text-uppercase ls-1 fw-bold">Active Orders</div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="p-4 rounded-5 border border-white-10 bg-white bg-opacity-5 h-100 hover-translate-y transition-all shadow-xl">
                                            <div className="d-flex align-items-center justify-content-between mb-3 text-info">
                                                <DollarSign size={24} />
                                                <span className="small text-success fw-bold d-flex align-items-center gap-1">+12% <ArrowUpRight size={12} /></span>
                                            </div>
                                            <div className="display-5 fw-bold text-white mb-1">${stats.commission.toLocaleString()}</div>
                                            <div className="small text-white-50 text-uppercase ls-1 fw-bold">Life Commission</div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="p-4 rounded-5 border border-warning border-opacity-25 bg-warning bg-opacity-10 h-100 hover-translate-y transition-all shadow-xl">
                                            <div className="d-flex align-items-center justify-content-between mb-3 text-warning">
                                                <Clock size={24} />
                                                <span className="small text-warning opacity-75 fw-bold">Processing</span>
                                            </div>
                                            <div className="display-5 fw-bold text-white mb-1">${stats.pendingPayout.toLocaleString()}</div>
                                            <div className="small text-white-50 text-uppercase ls-1 fw-bold">Next Payout</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Network Assets Banner */}
                                <div className="p-5 rounded-5 border border-white-10 bg-dark position-relative overflow-hidden mb-5 shadow-2xl">
                                    <div className="position-absolute w-100 h-100 top-0 start-0 opacity-10 blur-3xl" style={{ background: "radial-gradient(circle at top right, #ffc107, transparent)" }}></div>
                                    <div className="position-relative z-1 d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">
                                        <div>
                                            <h3 className="fw-bold mb-2">Heritage Sourcing Engine</h3>
                                            <p className="text-white-50 mb-0">Access exclusive high-res media kits and B2B pricing documents for your retail strategy.</p>
                                        </div>
                                        <button className="btn btn-outline-warning rounded-pill px-4 py-2 fw-bold whitespace-nowrap">
                                            Download Asset Pack
                                        </button>
                                    </div>
                                </div>

                                {/* Recent Orders Table */}
                                <div className="mb-5">
                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                        <h3 className="fw-bold mb-0">Partner Orders</h3>
                                        <button onClick={() => setActiveTab("orders")} className="btn btn-link text-warning text-decoration-none small d-flex align-items-center gap-1 hover-underline">
                                            Deep Log <ChevronRight size={14} />
                                        </button>
                                    </div>

                                    <div className="rounded-5 border border-white-10 bg-white bg-opacity-5 overflow-hidden shadow-xl">
                                        {orders.length === 0 ? (
                                            <div className="p-5 text-center text-white-50">
                                                <Package size={32} className="mb-3 opacity-25 mx-auto" />
                                                <p className="mb-0">No active network orders. Your referral pipeline is ready.</p>
                                            </div>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-dark table-hover mb-0 bg-transparent align-middle">
                                                    <thead>
                                                        <tr className="border-bottom border-white-10 opacity-75">
                                                            <th className="bg-transparent fw-bold py-3 ps-4">Ref ID</th>
                                                            <th className="bg-transparent fw-bold py-3">Customer Entity</th>
                                                            <th className="bg-transparent fw-bold py-3">Order Value</th>
                                                            <th className="bg-transparent fw-bold py-3 text-center">Status</th>
                                                            <th className="bg-transparent fw-bold py-3 pe-4 text-end">Commission</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orders.map(order => (
                                                            <tr key={order.id} className="border-bottom border-white border-opacity-5">
                                                                <td className="bg-transparent py-3 ps-4 font-monospace small text-white-50">{order.id.split('-')[0] || order.id}</td>
                                                                <td className="bg-transparent py-3 fw-bold">{order.customer_name}</td>
                                                                <td className="bg-transparent py-3 text-white-50">${order.total_amount?.toFixed(2)}</td>
                                                                <td className="bg-transparent py-3 text-center">
                                                                    <span className={`badge rounded-pill px-3 py-2 ${order.status === 'pending' ? 'bg-warning text-dark' : 'bg-success bg-opacity-10 text-success'}`}>
                                                                        {order.status}
                                                                    </span>
                                                                </td>
                                                                <td className="bg-transparent py-3 pe-4 text-end fw-bold text-warning">
                                                                    +${((order.total_amount || 0) * 0.1).toFixed(2)}
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
                        ) : activeTab === 'commission' ? (
                            <div className="animate-fade-in">
                                <header className="mb-5">
                                    <h2 className="display-4 fw-bold mb-2">Commission <span className="text-warning">Log.</span></h2>
                                    <p className="text-white-50 lead">Verified audit of your growth earnings across the platform.</p>
                                </header>

                                <div className="rounded-5 border border-white-10 bg-white bg-opacity-5 overflow-hidden shadow-2xl">
                                    <div className="table-responsive">
                                        <table className="table table-dark table-hover mb-0 bg-transparent align-middle">
                                            <thead>
                                                <tr className="border-bottom border-white-10 text-white-50 small text-uppercase ls-1">
                                                    <th className="bg-transparent py-3 ps-4 fw-bold">Transaction Node</th>
                                                    <th className="bg-transparent py-3 fw-bold">Order Depth</th>
                                                    <th className="bg-transparent py-3 fw-bold">Value Shared</th>
                                                    <th className="bg-transparent py-3 fw-bold">Timestamp</th>
                                                    <th className="bg-transparent py-3 pe-4 text-end fw-bold">System Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {commissions.map(c => (
                                                    <tr key={c.id} className="border-bottom border-white border-opacity-5">
                                                        <td className="bg-transparent py-3 ps-4 fw-bold">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Database size={14} className="text-warning" />
                                                                {c.id.split('-')[0] || c.id}
                                                            </div>
                                                        </td>
                                                        <td className="bg-transparent py-3">
                                                            <div className="small font-monospace text-white-50">#{c.orders?.id?.split('-')[0] || 'N/A'}</div>
                                                            <div className="small fw-bold">{c.orders?.customer_name}</div>
                                                        </td>
                                                        <td className="bg-transparent py-3 fw-bold text-warning">${Number(c.amount || 0).toFixed(2)}</td>
                                                        <td className="bg-transparent py-3 text-white-50 small">{c.created_at ? new Date(c.created_at).toLocaleDateString() : 'N/A'}</td>
                                                        <td className="bg-transparent py-3 pe-4 text-end">
                                                            <span className={`badge rounded-pill px-3 py-2 ${c.status === 'paid' ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                                                                {c.status === 'paid' ? 'Settled' : 'Pending Settlement'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {commissions.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="text-center py-5 text-white-50">
                                                            Commission register is empty.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'settings' ? (
                            <div className="animate-fade-in">
                                <header className="mb-5">
                                    <h2 className="display-4 fw-bold mb-2">Business <span className="text-warning">Vault.</span></h2>
                                    <p className="text-white-50 lead">Securely manage your B2B identity and payout channels.</p>
                                </header>
                                
                                <div className="p-5 rounded-5 border border-white-10 bg-white bg-opacity-5 shadow-2xl">
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div className="p-4 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-warning"><Globe size={18} /> Public Profile</h5>
                                                <p className="text-white-50 small mb-4">How your business appears to the master artisans.</p>
                                                <button className="btn btn-outline-light rounded-pill px-4 btn-sm border-opacity-20">Edit Profile</button>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-4 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-warning"><Shield size={18} /> Payout Method</h5>
                                                <p className="text-white-50 small mb-4">Settlement configured for verified Bank Transfer.</p>
                                                <button className="btn btn-outline-light rounded-pill px-4 btn-sm border-opacity-20">Configure Payout</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
