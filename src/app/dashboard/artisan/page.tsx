"use client"

import React, { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { db, auth } from "@/lib/firebase/config"
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc, addDoc, deleteDoc, orderBy } from "firebase/firestore"
import { signOut, onAuthStateChanged } from "firebase/auth"
import { LayoutDashboard, Package, Settings, LogOut, Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ArtisanDashboard() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'dashboard' | 'crafts' | 'settings'>('dashboard')
    
    // Settings state
    const [isSaving, setIsSaving] = useState(false)
    const [settingForm, setSettingForm] = useState({
        full_name: "",
        bio: "",
        location: "",
        specialty: ""
    })

    // Products state
    const [products, setProducts] = useState<any[]>([])
    const [showAddCraft, setShowAddCraft] = useState(false)
    const [editingCraftId, setEditingCraftId] = useState<string | null>(null)
    const [isSavingCraft, setIsSavingCraft] = useState(false)
    const [craftForm, setCraftForm] = useState({
        title: "",
        description: "",
        price: 0,
        stock: 10,
        image_url: ""
    })

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true)
            try {
                if (!user) {
                    router.push("/login")
                    return
                }
                setUser(user)

                // Fetch profile
                const pSnap = await getDoc(doc(db, "profiles", user.uid))
                const profileData = pSnap.exists() ? { id: pSnap.id, ...(pSnap.data() as any) } : null

                if (profileData) {
                    setProfile(profileData)
                    if (profileData.role !== "artisan") {
                        await signOut(auth)
                        router.push("/login")
                        return
                    }

                    setSettingForm({
                        full_name: profileData.full_name || "",
                        bio: profileData.bio || "",
                        location: profileData.location || "",
                        specialty: profileData.specialty || ""
                    })
                }

                // Fetch orders
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
                setOrders(myOrders)

                // Fetch products
                const prodSnap = await getDocs(query(collection(db, 'products'), where('artisan_id', '==', user.uid)))
                const prodData = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }))
                if (prodData) setProducts(prodData)

                setLoading(false)
            } catch (err: any) {
                console.error("Dashboard Load Error:", err)
                setLoading(false)
            }
        })
        return () => unsubscribe()
    }, [router])

    const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
        if (!orderId) return;
        try {
            await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
            setOrders(orders.map(o => {
                if (o.orders?.id === orderId) {
                    return { ...o, orders: { ...o.orders, status: newStatus } }
                }
                return o
            }))
        } catch (error: any) {
            alert("Could not update order status.")
        }
    }

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            await updateDoc(doc(db, "profiles", user.uid), settingForm)
            await setDoc(doc(db, "artisans", user.uid), settingForm, { merge: true })
            setProfile((prev: any) => ({ ...prev, ...settingForm }))
            alert("Profile Updated!")
        } catch (error: any) {
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
                ...craftForm,
                price: Number(craftForm.price),
                stock: Number(craftForm.stock),
                artisan_id: user.uid
            }

            if (editingCraftId) {
                await updateDoc(doc(db, 'products', editingCraftId), formData)
                setProducts(products.map(p => p.id === editingCraftId ? { ...p, id: editingCraftId, ...formData } : p))
            } else {
                const docRef = await addDoc(collection(db, 'products'), formData)
                setProducts([{ id: docRef.id, ...formData }, ...products])
            }

            setShowAddCraft(false)
            setEditingCraftId(null)
            setCraftForm({ title: "", description: "", price: 0, stock: 10, image_url: "" })
        } catch (error: any) {
            alert("Error saving product.")
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
            image_url: craft.image_url || ""
        })
        setShowAddCraft(true)
    }

    const handleDeleteCraft = async (id: string) => {
        if (!confirm("Delete this product?")) return
        try {
            await deleteDoc(doc(db, 'products', id))
            setProducts(products.filter(p => p.id !== id))
        } catch (error: any) {
            alert("Error deleting product.")
        }
    }

    const handleLogout = async () => {
        await signOut(auth)
        router.push("/")
    }

    if (loading) return (
        <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-border text-warning" role="status"></div>
        </div>
    )

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="container flex-grow-1 pt-5 mt-5 pb-5">
                <header className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h1 className="fw-bold mb-1">Welcome, {profile?.full_name?.split(' ')[0] || "Artisan"}</h1>
                        <p className="text-white-50 mb-0">Manage your shop and orders</p>
                    </div>
                </header>

                {/* SIMPLE TABS */}
                <div className="d-flex gap-2 mb-4 bg-white bg-opacity-10 p-2 rounded-4 overflow-auto">
                    <button onClick={() => setActiveTab("dashboard")} className={`btn flex-grow-1 fw-bold py-3 rounded-3 ${activeTab === 'dashboard' ? 'btn-light text-dark' : 'text-white'}`}>
                        <LayoutDashboard className="me-2" size={20} /> Orders
                    </button>
                    <button onClick={() => setActiveTab("crafts")} className={`btn flex-grow-1 fw-bold py-3 rounded-3 ${activeTab === 'crafts' ? 'btn-light text-dark' : 'text-white'}`}>
                        <Package className="me-2" size={20} /> My Products
                    </button>
                    <button onClick={() => setActiveTab("settings")} className={`btn flex-grow-1 fw-bold py-3 rounded-3 ${activeTab === 'settings' ? 'btn-light text-dark' : 'text-white'}`}>
                        <Settings className="me-2" size={20} /> Profile
                    </button>
                </div>

                {/* TAB CONTENT */}
                <div className="bg-white bg-opacity-5 rounded-4 p-4 p-md-5 border border-white-10">
                    
                    {/* ORDERS TAB */}
                    {activeTab === 'dashboard' && (
                        <div>
                            <div className="row g-4 mb-5">
                                <div className="col-6">
                                    <div className="bg-dark p-4 rounded-4 text-center border border-white-10">
                                        <div className="display-4 fw-bold text-warning">{orders.length}</div>
                                        <div className="text-white-50 mt-2">Total Orders</div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="bg-dark p-4 rounded-4 text-center border border-white-10">
                                        <div className="display-4 fw-bold text-success">{products.length}</div>
                                        <div className="text-white-50 mt-2">Active Products</div>
                                    </div>
                                </div>
                            </div>

                            <h3 className="mb-4">Recent Orders</h3>
                            {orders.length === 0 ? (
                                <div className="text-center p-5 bg-dark rounded-4 text-white-50">
                                    No orders yet. Add products to start selling!
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {orders.map((order, idx) => (
                                        <div key={idx} className="bg-dark p-4 rounded-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 border border-white-10">
                                            <div className="d-flex gap-3 align-items-center">
                                                <div className="bg-white bg-opacity-10 p-3 rounded-3">
                                                    <Package className="text-warning" />
                                                </div>
                                                <div>
                                                    <h5 className="mb-1">{order.product?.title || "Unknown Product"}</h5>
                                                    <p className="mb-0 text-white-50">Qty: {order.quantity} • Total: ${(order.price_at_time || 0) * order.quantity}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <select 
                                                    className="form-select bg-dark text-white border-white-20"
                                                    value={order.orders?.status || 'pending'}
                                                    onChange={(e) => handleOrderStatusChange(order.orders?.id, e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* PRODUCTS TAB */}
                    {activeTab === 'crafts' && (
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3>My Products</h3>
                                <button onClick={() => { setShowAddCraft(true); setEditingCraftId(null); setCraftForm({title:"", description:"", price:0, stock:10, image_url:""}) }} className="btn btn-warning fw-bold rounded-pill px-4">
                                    <Plus className="me-2" size={18} /> Add Product
                                </button>
                            </div>

                            {showAddCraft && (
                                <div className="bg-dark p-4 rounded-4 mb-4 border border-warning border-opacity-50">
                                    <h4 className="mb-4">{editingCraftId ? "Edit Product" : "New Product"}</h4>
                                    <form onSubmit={handleSaveCraft}>
                                        <div className="mb-3">
                                            <label className="form-label text-white-50">Product Name</label>
                                            <input type="text" className="form-control bg-dark text-white border-white-20" required value={craftForm.title} onChange={e => setCraftForm({...craftForm, title: e.target.value})} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-white-50">Description</label>
                                            <textarea className="form-control bg-dark text-white border-white-20" rows={4} required value={craftForm.description} onChange={e => setCraftForm({...craftForm, description: e.target.value})}></textarea>
                                        </div>
                                        <div className="row g-3 mb-3">
                                            <div className="col-6">
                                                <label className="form-label text-white-50">Price ($)</label>
                                                <input type="number" className="form-control bg-dark text-white border-white-20" required value={craftForm.price} onChange={e => setCraftForm({...craftForm, price: Number(e.target.value)})} />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label text-white-50">Stock Quantity</label>
                                                <input type="number" className="form-control bg-dark text-white border-white-20" required value={craftForm.stock} onChange={e => setCraftForm({...craftForm, stock: Number(e.target.value)})} />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label text-white-50">Image URL</label>
                                            <input type="url" className="form-control bg-dark text-white border-white-20" placeholder="https://..." value={craftForm.image_url} onChange={e => setCraftForm({...craftForm, image_url: e.target.value})} />
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button type="submit" disabled={isSavingCraft} className="btn btn-warning flex-grow-1 fw-bold">
                                                {isSavingCraft ? "Saving..." : "Save Product"}
                                            </button>
                                            <button type="button" onClick={() => setShowAddCraft(false)} className="btn btn-outline-light">Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {products.length === 0 && !showAddCraft ? (
                                <div className="text-center p-5 bg-dark rounded-4 text-white-50">
                                    You have no products listed. Click "Add Product" to start.
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {products.map(product => (
                                        <div key={product.id} className="col-md-6 col-lg-4">
                                            <div className="bg-dark rounded-4 overflow-hidden border border-white-10 h-100 d-flex flex-column">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                                ) : (
                                                    <div className="bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                                                        <ImageIcon size={48} className="text-white-50" />
                                                    </div>
                                                )}
                                                <div className="p-3 flex-grow-1 d-flex flex-column">
                                                    <h5 className="mb-1">{product.title}</h5>
                                                    <div className="text-warning fw-bold mb-2">${product.price}</div>
                                                    <div className="text-white-50 small mb-3 flex-grow-1 line-clamp-2">{product.description}</div>
                                                    <div className="d-flex justify-content-between align-items-center pt-3 border-top border-white-10 mt-auto">
                                                        <span className="small text-white-50">Stock: {product.stock}</span>
                                                        <div className="d-flex gap-2">
                                                            <button onClick={() => editCraft(product)} className="btn btn-sm btn-outline-light"><Edit2 size={14} /></button>
                                                            <button onClick={() => handleDeleteCraft(product.id)} className="btn btn-sm btn-outline-danger"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === 'settings' && (
                        <div className="max-w-md mx-auto">
                            <h3 className="mb-4">My Profile</h3>
                            <form onSubmit={handleSaveProfile} className="bg-dark p-4 rounded-4 border border-white-10">
                                <div className="mb-3">
                                    <label className="form-label text-white-50">Full Name</label>
                                    <input type="text" className="form-control bg-dark text-white border-white-20" required value={settingForm.full_name} onChange={e => setSettingForm({...settingForm, full_name: e.target.value})} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-white-50">Location / Village</label>
                                    <input type="text" className="form-control bg-dark text-white border-white-20" value={settingForm.location} onChange={e => setSettingForm({...settingForm, location: e.target.value})} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-white-50">Main Craft (e.g. Pottery, Weaving)</label>
                                    <input type="text" className="form-control bg-dark text-white border-white-20" value={settingForm.specialty} onChange={e => setSettingForm({...settingForm, specialty: e.target.value})} />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-white-50">About Me</label>
                                    <textarea className="form-control bg-dark text-white border-white-20" rows={4} value={settingForm.bio} onChange={e => setSettingForm({...settingForm, bio: e.target.value})}></textarea>
                                </div>
                                
                                <button type="submit" disabled={isSaving} className="btn btn-warning w-100 fw-bold py-3 mb-3">
                                    {isSaving ? "Saving..." : "Save Profile"}
                                </button>
                                <button type="button" onClick={handleLogout} className="btn btn-outline-danger w-100 py-3">
                                    <LogOut className="me-2" size={18} /> Logout
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    )
}
