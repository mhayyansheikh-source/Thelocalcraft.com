"use client"

import React, { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { db, auth } from "@/lib/firebase/config"
import { collection, query, where, getDocs, doc, getDoc, updateDoc, orderBy } from "firebase/firestore"
import { onAuthStateChanged, signOut } from "firebase/auth"
import {
    User,
    LogOut,
    Package,
    Settings,
    MapPin,
    AlertCircle,
    Loader,
    CheckCircle,
    ShoppingBag,
    Calendar,
    ArrowRight,
    QrCode,
    Phone,
    Clock
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"

export default function CustomerDashboard() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [activeTab, setActiveTab] = useState('orders') // orders, settings
    const [isSaving, setIsSaving] = useState(false)

    // A generic metadata form. Since customer auth records initially just created 'role', 
    // we manage their name/address inside purely orders right now, but we can store defaults in profiles.
    const [settingForm, setSettingForm] = useState({
        full_name: "",
        location: "",
        whatsapp_number: ""
    })

    const router = useRouter()

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

                // Verify customer role from profiles
                const profileRef = doc(db, "profiles", user.uid)
                const profileSnap = await getDoc(profileRef)

                if (profileSnap.exists()) {
                    const profileData = { id: profileSnap.id, ...profileSnap.data() } as any
                    
                    // if somehow they hit customer route but aren't, redirect them
                    if (profileData.role !== 'customer') {
                        router.push(`/dashboard/${profileData.role}`)
                        return
                    }

                    if (profileData.status === 'pending' || profileData.status === 'rejected') {
                        setProfile(profileData)
                        setLoading(false)
                        return // Stop data fetch for unapproved users
                    }

                    setProfile(profileData)
                    setSettingForm({
                        full_name: profileData.full_name || "",
                        location: profileData.location || "",
                        whatsapp_number: profileData.whatsapp_number || ""
                    })
                }

                // Fetch this specific customer's order history natively mapped by user.id
                try {
                    const q = query(collection(db, "orders"), where("customer_id", "==", user.uid), orderBy("created_at", "desc"))
                    const querySnapshot = await getDocs(q)
                    
                    const myOrders = []
                    for (const docSnapshot of querySnapshot.docs) {
                        const orderData = { id: docSnapshot.id, ...docSnapshot.data() } as any
                        
                        // Fetch items
                        const itemsQ = query(collection(db, "order_items"), where("order_id", "==", orderData.id))
                        const itemsSnap = await getDocs(itemsQ)
                        
                        const items = []
                        for (const itemSnap of itemsSnap.docs) {
                            const itemData = itemSnap.data()
                            
                            // Fetch product for item
                            let productData = null;
                            if (itemData.product_id) {
                                const productRef = doc(db, "products", itemData.product_id)
                                const productSnap = await getDoc(productRef)
                                if (productSnap.exists()) {
                                    productData = { id: productSnap.id, ...productSnap.data() }
                                }
                            }
                            
                            items.push({
                                ...itemData,
                                product: productData
                            })
                        }
                        orderData.order_items = items
                        myOrders.push(orderData)
                    }

                    setOrders(myOrders)
                } catch (error: any) {
                    console.error("Error fetching orders", error)
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

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            if (user) {
                const profileRef = doc(db, "profiles", user.uid)
                await updateDoc(profileRef, {
                    full_name: settingForm.full_name,
                    location: settingForm.location,
                    whatsapp_number: settingForm.whatsapp_number
                })
                setProfile((prev: any) => ({ ...prev, ...settingForm }))
                alert("Delivery Preferences Updated")
            }
        } catch (error: any) {
            console.error("Failed to update profile", error)
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) return (
        <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )

    if (profile?.status === 'pending') {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex flex-column">
                <Navbar />
                <main className="container flex-grow-1 d-flex align-items-center justify-content-center py-5 mt-5">
                    <div className="text-center p-5 rounded-5 border border-warning border-opacity-25 bg-white bg-opacity-5 shadow-lg max-w-md w-100" style={{ backdropFilter: "blur(10px)" }}>
                        <div className="mb-4 d-inline-block rounded-circle p-4 bg-warning bg-opacity-10 text-warning shadow">
                            <Clock size={48} />
                        </div>
                        <h2 className="fw-bold mb-3 text-white">Account Under Review</h2>
                        <p className="text-white-50 mx-auto mb-5" style={{ maxWidth: '400px', lineHeight: '1.6' }}>
                            Your customer account is currently pending verification. This usually takes just a few hours. We appreciate your patience.
                        </p>
                        <button onClick={handleLogout} className="btn btn-warning rounded-pill px-5 py-3 fw-bold shadow-lg hover-scale transition-all d-flex align-items-center gap-2 mx-auto">
                            <LogOut size={20} /> Logout
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
                            Unfortunately, we are unable to process your request for a customer profile at this time.
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
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="container flex-grow-1 py-5 mt-5">
                <div className="row g-5">
                    {/* SIDEBAR NAVIGATION */}
                    <div className="col-lg-3">
                        <div className="p-4 rounded-5 border border-white border-opacity-10 bg-white bg-opacity-5 sticky-top" style={{ top: "100px", zIndex: 10 }}>
                            <div className="text-center mb-4">
                                <div className="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 text-warning mb-3">
                                    <User size={32} />
                                </div>
                                <h5 className="fw-bold mb-1">{profile?.full_name || "Valued Collector"}</h5>
                                <div className="small text-white-50">{user?.email}</div>
                                <span className="badge bg-white bg-opacity-10 text-white-70 mt-2 rounded-pill fw-normal px-3 py-2 border border-white-10">
                                    Heritage Account
                                </span>
                            </div>

                            <div className="d-flex flex-column gap-2 border-top border-white-10 pt-4">
                                <button
                                    className={`btn text-start p-3 rounded-4 transition-all d-flex align-items-center gap-3 ${activeTab === 'orders' ? 'bg-warning text-dark fw-bold shadow-lg' : 'btn-link text-white-50 text-decoration-none hover-bg-white-5 hover-text-white'}`}
                                    onClick={() => setActiveTab('orders')}
                                >
                                    <Package size={20} /> Order History
                                </button>
                                <button
                                    className={`btn text-start p-3 rounded-4 transition-all d-flex align-items-center gap-3 ${activeTab === 'settings' ? 'bg-warning text-dark fw-bold shadow-lg' : 'btn-link text-white-50 text-decoration-none hover-bg-white-5 hover-text-white'}`}
                                    onClick={() => setActiveTab('settings')}
                                >
                                    <Settings size={20} /> Shipping Defaults
                                </button>
                                <button
                                    className="btn btn-link text-danger text-decoration-none text-start p-3 rounded-4 hover-bg-danger-10 transition-all d-flex align-items-center gap-3 mt-4 border border-danger border-opacity-10"
                                    onClick={handleLogout}
                                >
                                    <LogOut size={20} /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="col-lg-9">
                        {activeTab === 'orders' ? (
                            <div className="animate-fade-in-up">
                                <header className="mb-4">
                                    <h2 className="display-6 fw-bold mb-2 d-flex align-items-center gap-3">
                                        <Package className="text-warning" size={32} /> Your Collection
                                    </h2>
                                    <p className="text-white-50 mb-0">Track your heritage pieces as they journey from the artisan to you.</p>
                                </header>

                                {orders.length === 0 ? (
                                    <div className="p-5 mt-4 rounded-5 border border-white border-opacity-10 bg-white bg-opacity-5 text-center">
                                        <ShoppingBag size={48} className="text-white-50 mb-3 opacity-50 mx-auto" />
                                        <h4 className="fw-bold mb-2">Your collection is empty</h4>
                                        <p className="text-white-50 mb-4">You have not claimed any heritage masterworks yet.</p>
                                        <Link href="/explore" className="btn btn-warning rounded-pill px-4 py-3 fw-bold shadow-lg text-dark">
                                            Explore The Catalog <ArrowRight size={18} className="ms-1" />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="p-4 rounded-5 border border-white border-opacity-10 bg-white bg-opacity-5 transition-all hover-translate-y d-flex flex-column gap-4">
                                                {/* Header Bar */}
                                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 border-bottom border-white-10 pb-3">
                                                    <div>
                                                        <div className="small text-white-50 text-uppercase ls-1 fw-bold d-flex align-items-center gap-2 mb-1">
                                                            <Calendar size={14} /> {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                                                        </div>
                                                        <div className="font-monospace small text-white-70">Order #{order.id.split('-')[0] || order.id}</div>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-4">
                                                        <div className="text-end d-none d-sm-block">
                                                            <div className="small text-white-50">Total Value</div>
                                                            <div className="fw-bold text-warning">${order.total_amount?.toFixed(2)}</div>
                                                        </div>
                                                        <span className={`badge px-3 py-2 rounded-pill fw-bold fs-6 ${order.status === 'pending' ? 'bg-warning text-dark' : order.status === 'processing' ? 'bg-info text-dark' : order.status === 'shipped' ? 'bg-primary text-white' : order.status === 'cancelled' ? 'bg-danger text-white' : 'bg-success text-white'}`}>
                                                            {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : ''}
                                                        </span>
                                                    </div>
                                                </div>

                                                {order.status === 'pending' && (
                                                    <div className="alert alert-warning bg-warning bg-opacity-10 border-0 text-warning d-flex align-items-center gap-2 m-0 p-3 rounded-4 small">
                                                        <AlertCircle size={16} className="flex-shrink-0" />
                                                        <div>Your order is received. Please prepare cash (COD) for your impending delivery to <strong>{order.customer_address}</strong>.</div>
                                                    </div>
                                                )}

                                                {/* Line Items */}
                                                <div className="d-flex flex-column gap-3 mt-3">
                                                    {(order.order_items || []).map((item: any, idx: number) => (
                                                        <div key={idx} className="d-flex flex-wrap align-items-center justify-content-between gap-3 bg-dark bg-opacity-50 p-3 rounded-4 border border-white-5 relative">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <img
                                                                    src={item.product?.image_url || "/images/hero.png"}
                                                                    alt="Product"
                                                                    className="rounded-3 object-fit-cover shadow-sm bg-dark"
                                                                    style={{ width: "60px", height: "60px" }}
                                                                />
                                                                <div className="flex-grow-1 min-w-0">
                                                                    <h6 className="fw-bold mb-1 text-truncate">{item.product?.title || "Unknown Art"}</h6>
                                                                    <div className="small text-white-50">Qty: {item.quantity} · ${item.price_at_time?.toFixed(2)}</div>
                                                                </div>
                                                            </div>
                                                            {/* Digital Provenance QR Code */}
                                                            <div className="d-flex flex-column justify-content-center align-items-center bg-white p-2 rounded-3 shadow-sm flex-shrink-0" style={{ minWidth: "70px" }} title="Scan to verify Digital Provenance">
                                                                <QRCodeSVG value={`https://thelocalcraft.com/provenance/${order.id}/${item.product?.id || idx}`} size={56} bgColor="#ffffff" fgColor="#000000" level="Q" />
                                                                <div className="text-dark fw-bold mt-1 d-flex align-items-center gap-1" style={{ fontSize: "0.5rem", letterSpacing: "1px" }}><QrCode size={10} /> PROVENANCE</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : activeTab === 'settings' ? (
                            <div className="animate-fade-in-up">
                                <header className="mb-4">
                                    <h2 className="display-6 fw-bold mb-2 d-flex align-items-center gap-3">
                                        <Settings className="text-warning" size={32} /> Account Preferences
                                    </h2>
                                    <p className="text-white-50 mb-0">Update your default shipping details for faster checkout.</p>
                                </header>

                                <div className="p-4 p-md-5 rounded-5 border border-white-10 bg-white bg-opacity-5">
                                    <form onSubmit={handleSaveProfile} className="d-flex flex-column gap-4">
                                        <div>
                                            <label className="form-label small text-white-50 text-uppercase ls-1">Default Full Name</label>
                                            <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                <span className="input-group-text bg-transparent border-0 text-white-50"><User size={16} /></span>
                                                <input required type="text" value={settingForm.full_name} onChange={e => setSettingForm({ ...settingForm, full_name: e.target.value })} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="First Last" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="form-label small text-white-50 text-uppercase ls-1">Default Shipping City & Region</label>
                                            <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                <span className="input-group-text bg-transparent border-0 text-warning"><MapPin size={16} /></span>
                                                <input required type="text" value={settingForm.location} onChange={e => setSettingForm({ ...settingForm, location: e.target.value })} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="e.g. Lahore, Punjab" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="form-label small text-white-50 text-uppercase ls-1">WhatsApp Number</label>
                                            <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                <span className="input-group-text bg-transparent border-0 text-success"><Phone size={16} /></span>
                                                <input required type="text" value={settingForm.whatsapp_number} onChange={e => setSettingForm({ ...settingForm, whatsapp_number: e.target.value })} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="(e.g. +92 300 1234567)" />
                                            </div>
                                            <div className="form-text text-white-50 small mt-2 d-inline-block">Used exclusively for order coordination and artisan communication. You can always overwrite this constraint per individual order checkout.</div>
                                        </div>

                                        <button type="submit" disabled={isSaving} className="btn btn-warning rounded-pill py-3 fw-bold mt-2 shadow-lg d-flex align-items-center justify-content-center gap-2 hover-translate-y transition-all w-100 w-md-auto align-self-md-start px-5">
                                            {isSaving ? <Loader size={20} className="spin" /> : <>Save Defaults <CheckCircle size={18} /></>}
                                        </button>
                                    </form>
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
