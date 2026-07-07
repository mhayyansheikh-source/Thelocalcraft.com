"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, Search, Menu, X, User, Trash2, ArrowRight, Loader, CheckCircle, Globe, Truck } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useCurrency } from "@/context/CurrencyContext"
import { auth, db } from "@/lib/firebase/config"
import { onAuthStateChanged } from "firebase/auth"
import { collection, doc, getDoc, getDocs, addDoc, setDoc } from "firebase/firestore"

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isRegionsOpen, setIsRegionsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Checkout state
    const [showCheckoutModal, setShowCheckoutModal] = useState(false)
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [checkoutComplete, setCheckoutComplete] = useState(false)
    const [shippingDetails, setShippingDetails] = useState({ name: "", phone: "", address: "", city: "", province: "Punjab" })
    const [logistics, setLogistics] = useState<any[]>([])
    const [currentShippingFee, setCurrentShippingFee] = useState(0)
    const [deliveryEstimate, setDeliveryEstimate] = useState("")
    const [impactFundTip, setImpactFundTip] = useState<number>(0)

    // Auth State
    const [userAuth, setUserAuth] = useState<{ id: string, role: string } | null>(null)
    const [isAuthLoading, setIsAuthLoading] = useState(true)

    const router = useRouter()
    const { items, isCartOpen, setIsCartOpen, removeFromCart, clearCart, cartTotal } = useCart()
    const { currency, toggleCurrency, formatPrice, rate } = useCurrency()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)

        // Check authentication
        const checkAuth = async () => {
            const user = auth.currentUser
            if (user) {
                // Fetch role
                const docRef = doc(db, 'profiles', user.uid)
                const docSnap = await getDoc(docRef)
                
                if (docSnap.exists()) {
                    setUserAuth({ id: user.uid, role: docSnap.data().role })
                } else {
                    setUserAuth({ id: user.uid, role: 'artisan' }) // fallback
                }
            }
            setIsAuthLoading(false)
        }
        checkAuth()

        // Fetch logistics config
        async function fetchLogistics() {
            const querySnapshot = await getDocs(collection(db, 'logistics_config'))
            const data = querySnapshot.docs.map(d => d.data())
            if (data.length > 0) setLogistics(data)
        }
        fetchLogistics()

        // Listen for auth changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, 'profiles', user.uid)
                const docSnap = await getDoc(docRef)
                setUserAuth({ id: user.uid, role: docSnap.exists() ? docSnap.data().role : 'artisan' })
            } else {
                setUserAuth(null)
            }
            setIsAuthLoading(false)
        })

        // Check for referral code
        const urlParams = new URLSearchParams(window.location.search)
        const ref = urlParams.get('ref')
        if (ref) {
            localStorage.setItem('heritage_referral', ref)
        }

        return () => {
            window.removeEventListener("scroll", handleScroll)
            unsubscribe()
        }
    }, [])


    useEffect(() => {
        const provinceLogistics = logistics.find(l => l.region_name === shippingDetails.province)
        if (provinceLogistics) {
            const isFree = cartTotal >= (provinceLogistics.free_shipping_threshold / rate)
            if (isFree) {
                setCurrentShippingFee(0)
            } else {
                setCurrentShippingFee(provinceLogistics.standard_rate / rate)
            }
            setDeliveryEstimate(`${provinceLogistics.estimated_days_min}-${provinceLogistics.estimated_days_max} days`)
        }
    }, [shippingDetails.province, cartTotal, logistics, rate])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setIsSearchOpen(false)
            // Route to explore page with the search query mapped
            router.push(`/explore?q=${encodeURIComponent(searchQuery)}`)
            setSearchQuery("")
        }
    }

    const handleCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCheckingOut(true)

        try {
            const user = auth.currentUser

            // Check for referral
            const referralId = localStorage.getItem('heritage_referral')

            // Save master order
            const orderRef = doc(collection(db, 'orders'))
            await setDoc(orderRef, {
                customer_id: user?.uid || null,
                partner_id: referralId || null,
                customer_name: shippingDetails.name,
                customer_phone: shippingDetails.phone,
                customer_address: `${shippingDetails.address}, ${shippingDetails.city}, Pakistan`,
                total_amount: cartTotal + impactFundTip + currentShippingFee,
                impact_fund: impactFundTip,
                shipping_fee: currentShippingFee,
                status: 'pending'
            })

            const orderId = orderRef.id

            if (items.length > 0) {
                // Prepare order items
                for (const item of items) {
                    await addDoc(collection(db, 'order_items'), {
                        order_id: orderId,
                        product_id: item.product.id,
                        artisan_id: item.product.artisan_id,
                        quantity: item.quantity,
                        price_at_time: item.product.price
                    })
                }

                // Generate Commission if referral exists
                if (referralId) {
                    const commissionAmount = cartTotal * 0.1 // 10% commission
                    await addDoc(collection(db, 'commissions'), {
                        partner_id: referralId,
                        order_id: orderId,
                        amount: commissionAmount,
                        status: 'pending'
                    })
                    // Clear referral after successful order
                    localStorage.removeItem('heritage_referral')
                }
            }

            // Generate WhatsApp Order Message
            let waMessage = `✨ *New Heritage Order* ✨\n`
            waMessage += `*Order ID:* ${orderId?.split('-')[0]}\n\n`
            waMessage += `*Customer Details:*\n`
            waMessage += `- Name: ${shippingDetails.name}\n`
            waMessage += `- Phone: ${shippingDetails.phone}\n`
            waMessage += `- Address: ${shippingDetails.address}, ${shippingDetails.city}\n\n`
            waMessage += `*Order Items:*\n`
            items.forEach(item => {
                waMessage += `▪ ${item.quantity}x ${item.product.title} (Rs. ${item.product.price})\n`
            })
            if (impactFundTip > 0) {
                waMessage += `▪ Impact Fund: ${formatPrice(impactFundTip)}\n`
            }
            waMessage += `▪ Shipping: ${currentShippingFee > 0 ? formatPrice(currentShippingFee) : 'FREE'}\n`
            waMessage += `\n*Total Order Amount:* ${formatPrice(cartTotal + impactFundTip + currentShippingFee)}\n`
            waMessage += `-------------------------\n`
            waMessage += `*Status:* Pending Dispatch`

            const encodedMessage = encodeURIComponent(waMessage)
            const waPhoneNumber = "923001234567" // Application Master Number

            // Open WhatsApp silently in new tab
            window.open(`https://wa.me/${waPhoneNumber}?text=${encodedMessage}`, '_blank')

            setCheckoutComplete(true)

            // Auto close after success
            setTimeout(() => {
                setShowCheckoutModal(false)
                setCheckoutComplete(false)
                setShippingDetails({ name: "", phone: "", address: "", city: "Karachi", province: "Punjab" })
                setImpactFundTip(0)
                clearCart() // empty cart explicitly
            }, 3000)

        } catch (error: any) {
            console.error("Failed to checkout:", error)
            alert("Error confirming your order. Please try again.")
        } finally {
            setIsCheckingOut(false)
        }
    }

    return (
        <>
            <nav className={`fixed-top w-100 transition-all duration-300 ${isScrolled ? "py-2 shadow-lg" : "py-4"}`}
                style={{
                    background: isScrolled ? "rgba(10, 10, 10, 0.85)" : "transparent",
                    backdropFilter: isScrolled ? "blur(15px)" : "none",
                    zIndex: 1000,
                    borderBottom: isScrolled ? "1px solid rgba(255, 255, 255, 0.1)" : "none"
                }}>
                <div className="container d-flex justify-content-between align-items-center">
                    {/* Logo */}
                    <Link href="/" className="text-decoration-none d-flex align-items-center gap-2">
                        <div className="fw-bold text-white fs-4" style={{ letterSpacing: "-1px" }}>
                            The Local <span className="text-warning">Crafts</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="d-none d-lg-flex align-items-center gap-3 gap-xl-4">
                        <Link href="/explore" className="text-white-50 text-decoration-none small text-uppercase fw-bold hover-white transition-colors" style={{ letterSpacing: "1.5px", fontSize: "0.75rem" }}>
                            Explore
                        </Link>

                        <Link href="/craft-map" className="text-warning text-decoration-none small text-uppercase fw-bold hover-white transition-colors" style={{ letterSpacing: "1.5px", fontSize: "0.75rem" }}>
                            Craft Map
                        </Link>

                        <div className="position-relative" onMouseEnter={() => setIsRegionsOpen(true)} onMouseLeave={() => setIsRegionsOpen(false)}>
                            <button className="btn btn-link p-0 text-white-50 text-decoration-none small text-uppercase fw-bold hover-white transition-colors d-flex align-items-center gap-1" style={{ letterSpacing: "1.5px", fontSize: "0.75rem" }}>
                                Regions
                            </button>
                            {isRegionsOpen && (
                                <div className="position-absolute top-100 start-0 pt-3" style={{ minWidth: "200px" }}>
                                    <div className="bg-dark border border-white-10 rounded-4 overflow-hidden shadow-lg" style={{ backdropFilter: "blur(20px)" }}>
                                        {["Punjab", "Sindh", "KPK", "Balochistan", "Gilgit-Baltistan", "AJK"].map(region => (
                                            <Link key={region} href={`/region/${region.toLowerCase()}`} className="d-block px-4 py-3 text-white-50 text-decoration-none hover-bg-white-5 hover-text-white transition-all small fw-bold">
                                                {region}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {["Artisans", "Heritage", "Stories", "Wholesale"].map((item) => (
                            <Link key={item} href={item === 'Wholesale' ? "/apply/wholesale" : `/${item.toLowerCase()}`}
                                className="text-white-50 text-decoration-none small text-uppercase fw-bold hover-white transition-colors"
                                style={{ letterSpacing: "1.5px", fontSize: "0.75rem" }}>
                                {item}
                            </Link>
                        ))}

                        <button onClick={toggleCurrency} className="btn btn-outline-light border-opacity-10 rounded-pill px-3 py-1 small fw-bold text-uppercase d-flex align-items-center gap-2 hover-bg-warning hover-text-dark transition-all" style={{ fontSize: "0.65rem", letterSpacing: "1px" }}>
                            <Globe size={14} /> {currency}
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="d-flex align-items-center gap-3">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="btn btn-link text-white p-2 d-none d-md-block opacity-75 hover-opacity-100 transition-opacity"
                        >
                            <Search size={20} />
                        </button>
                        <button
                            className="btn btn-link text-white p-2 opacity-75 hover-opacity-100 transition-opacity position-relative"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingBag size={20} />
                            {items.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark" style={{ fontSize: "0.6rem" }}>
                                    {items.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </button>

                        {!isAuthLoading && (
                            userAuth ? (
                                <Link href={
                                    userAuth.role === 'admin' ? "/dashboard/admin" : 
                                    userAuth.role === 'wholesale' ? "/dashboard/wholesale" :
                                    userAuth.role === 'customer' ? "/dashboard/customer" : 
                                    "/dashboard/artisan"
                                }
                                    className="btn btn-warning rounded-pill px-4 py-2 fw-bold d-none d-md-flex align-items-center gap-2 shadow-sm" style={{ fontSize: "0.85rem" }}>
                                    <User size={16} /> Dashboard
                                </Link>
                            ) : (
                                <Link href="/login" className="btn btn-warning rounded-pill px-4 py-2 fw-bold d-none d-md-flex align-items-center gap-2 shadow-sm" style={{ fontSize: "0.85rem" }}>
                                    <User size={16} /> Sign In
                                </Link>
                            )
                        )}

                        {/* Mobile Toggle */}
                        <button className="btn btn-link text-white d-lg-none p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="position-fixed top-0 start-0 w-100 vh-100 bg-dark d-flex flex-column align-items-center justify-content-center gap-4 animate-fade-in" style={{ zIndex: 999 }}>
                        {["Explore", "Artisans", "Heritage", "Stories", "Wholesale"].map((item) => (
                            <Link key={item} href={item === 'Wholesale' ? "/apply/wholesale" : `/${item.toLowerCase()}`}
                                className="text-white text-decoration-none fs-2 fw-bold"
                                onClick={() => setIsMobileMenuOpen(false)}>
                                {item}
                            </Link>
                        ))}

                        <div className="text-center mt-3">
                            <h6 className="text-white-50 small text-uppercase mb-3 ls-1">Regional Silos</h6>
                            <div className="d-flex flex-wrap justify-content-center gap-2">
                                {["Punjab", "Sindh", "KPK", "Balochistan", "Gilgit-Baltistan", "AJK"].map(region => (
                                    <Link key={region} href={`/region/${region.toLowerCase()}`} className="btn btn-sm btn-outline-light border-white-10 text-white-50 rounded-pill px-3 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                                        {region}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {!isAuthLoading && (
                            userAuth ? (
                                <Link href={
                                    userAuth.role === 'admin' ? "/dashboard/admin" : 
                                    userAuth.role === 'wholesale' ? "/dashboard/wholesale" :
                                    "/dashboard/artisan"
                                }
                                    className="btn btn-warning rounded-pill px-5 py-3 fs-5 fw-bold mt-4 shadow-lg d-flex align-items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                    <User size={20} /> Dashboard
                                </Link>
                            ) : (
                                <Link href="/login" className="btn btn-warning rounded-pill px-5 py-3 fs-5 fw-bold mt-4 shadow-lg d-flex align-items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                    <User size={20} /> Sign In
                                </Link>
                            )
                        )}
                    </div>
                )}
            </nav>

            {/* Global Search Overlay */}
            {isSearchOpen && (
                <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex flex-column"
                    style={{ zIndex: 1050, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)" }}>
                    <button
                        className="btn btn-link text-white position-absolute top-0 end-0 m-4 p-2 opacity-75 hover-opacity-100 transition-all hover-scale"
                        onClick={() => setIsSearchOpen(false)}
                        style={{ zIndex: 1060 }}
                    >
                        <X size={40} />
                    </button>

                    <div className="container flex-grow-1 d-flex flex-column justify-content-center align-items-center animate-fade-in-up" style={{ marginTop: "-10vh" }}>
                        <div className="text-center mb-4">
                            <h2 className="display-5 fw-bold text-white mb-2">What heritage are you looking for?</h2>
                            <p className="text-white-50">Search for artisans, materials, heritage sites, or historic categories...</p>
                        </div>

                        <form onSubmit={handleSearchSubmit} className="w-100" style={{ maxWidth: "800px" }}>
                            <div className="input-group p-2 rounded-pill bg-white bg-opacity-5 border border-white border-opacity-10 shadow-2xl">
                                <span className="input-group-text bg-transparent border-0 text-warning ps-4 pe-2">
                                    <Search size={28} />
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="form-control bg-transparent border-0 text-white py-4 fs-4 outline-none"
                                    placeholder="Try 'Swat Valley Embroidery' or 'Rosewood'"
                                    autoFocus
                                    style={{ boxShadow: 'none' }}
                                />
                                <button type="submit" className="btn btn-warning rounded-pill px-5 fw-bold fs-5 shadow">
                                    Search
                                </button>
                            </div>
                        </form>

                        <div className="d-flex flex-wrap gap-2 justify-content-center mt-5">
                            <span className="text-white-50 small pe-3 d-flex align-items-center">Popular:</span>
                            {["Multan Pottery", "Hardwood Inlay", "Ajrak", "Textiles"].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => {
                                        setSearchQuery(tag)
                                        setIsSearchOpen(false)
                                        router.push(`/explore?q=${encodeURIComponent(tag)}`)
                                    }}
                                    className="btn btn-sm rounded-pill btn-outline-light border-opacity-25"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Drawer Overlay */}
            {isCartOpen && (
                <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex" style={{ zIndex: 1050, background: "rgba(0,0,0,0.5)" }}>
                    {/* Clickable background to close */}
                    <div className="flex-grow-1" onClick={() => setIsCartOpen(false)} />

                    {/* Sidebar */}
                    <div className="bg-dark text-white h-100 shadow-lg d-flex flex-column animate-slide-in-right" style={{ width: "100%", maxWidth: "400px", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
                        <div className="p-4 border-bottom border-white-10 d-flex justify-content-between align-items-center">
                            <h4 className="mb-0 fw-bold d-flex align-items-center gap-2"><ShoppingBag className="text-warning" /> Your Bag</h4>
                            <button className="btn btn-link text-white p-0 opacity-75 hover-opacity-100" onClick={() => setIsCartOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-grow-1 overflow-auto p-4">
                            {items.length === 0 ? (
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center opacity-50 text-center">
                                    <ShoppingBag size={48} className="mb-3" />
                                    <p>Your collection is empty.</p>
                                    <button className="btn btn-outline-light rounded-pill mt-3" onClick={() => { setIsCartOpen(false); router.push('/explore'); }}>Explore Crafts</button>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-4">
                                    {items.map((item: any) => (
                                        <div key={item.product.id} className="d-flex gap-3 align-items-start">
                                            <img src={item.product.image_url || "/images/hero.png"} alt={item.product.title} className="rounded-3 object-fit-cover" style={{ width: "80px", height: "80px" }} />
                                            <div className="flex-grow-1">
                                                <h6 className="fw-bold mb-1">{item.product.title}</h6>
                                                <div className="text-warning small mb-2">{formatPrice(item.product.price)} x {item.quantity}</div>
                                            </div>
                                            <button className="btn btn-link text-danger p-0" title="Remove" onClick={() => removeFromCart(item.product.id)}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-4 border-top border-white-10" style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                                <div className="d-flex justify-content-between mb-3 fs-5 fw-bold">
                                    <span>Total:</span>
                                    <div className="text-end">
                                        <div className="text-warning fs-4">{formatPrice(cartTotal)}</div>
                                    </div>
                                </div>
                                <button className="btn btn-warning w-100 rounded-pill py-3 fw-bold d-flex justify-content-center align-items-center gap-2 hover-scale transition-all" onClick={() => { setIsCartOpen(false); setShowCheckoutModal(true); }}>
                                    Secure Checkout <ArrowRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* COD Checkout Modal Overlay */}
            {showCheckoutModal && (
                <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center animate-fade-in" style={{ zIndex: 1100, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)" }}>
                    <div className="bg-dark p-5 rounded-5 border border-white border-opacity-10 position-relative w-100 shadow-2xl mx-3" style={{ maxWidth: "500px", background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)" }}>

                        <button
                            className="btn btn-link text-white position-absolute top-0 end-0 m-3 p-2 opacity-50 hover-opacity-100"
                            onClick={() => setShowCheckoutModal(false)}
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-4">
                            <h3 className="fw-bold text-white mb-1">Confirm Order</h3>
                            <div className="text-white-50 small mb-0 d-flex flex-column align-items-center gap-1">
                                <div className="d-flex justify-content-between w-100 px-4">
                                    <span>Subtotal:</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="d-flex justify-content-between w-100 px-4">
                                    <span>Shipping ({shippingDetails.province}):</span>
                                    <span className={currentShippingFee === 0 ? "text-success fw-bold" : ""}>{currentShippingFee === 0 ? "FREE" : formatPrice(currentShippingFee)}</span>
                                </div>
                                {impactFundTip > 0 && (
                                    <div className="d-flex justify-content-between w-100 px-4">
                                        <span>Impact Fund:</span>
                                        <span>{formatPrice(impactFundTip)}</span>
                                    </div>
                                )}
                                <div className="d-flex justify-content-between w-100 px-4 mt-2 pt-2 border-top border-white-10 text-white fw-bold fs-5">
                                    <span>Total:</span>
                                    <span className="text-warning">{formatPrice(cartTotal + impactFundTip + currentShippingFee)}</span>
                                </div>
                                <div className="mt-2 text-warning fw-bold d-flex align-items-center gap-1" style={{ fontSize: "0.7rem" }}>
                                    <Truck size={12} /> Est. Arrival: {deliveryEstimate}
                                </div>
                            </div>
                        </div>

                        {checkoutComplete ? (
                            <div className="text-center py-4 animate-fade-in">
                                <CheckCircle size={64} className="text-success mb-3 pulse-animation mx-auto" />
                                <h4 className="fw-bold text-white mb-2">Order Captured!</h4>
                                <p className="text-white-50">Your heritage pieces are reserved. Please have cash ready upon delivery.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleCheckoutSubmit} className="d-flex flex-column gap-3">
                                <div>
                                    <label className="form-label small text-uppercase text-white-50 ls-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="form-control bg-dark bg-opacity-50 border-white border-opacity-10 text-white rounded-4 py-2"
                                        placeholder="Enter your name"
                                        value={shippingDetails.name}
                                        onChange={(e) => setShippingDetails(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="form-label small text-uppercase text-white-50 ls-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        className="form-control bg-dark bg-opacity-50 border-white border-opacity-10 text-white rounded-4 py-2"
                                        placeholder="+92 300 1234567"
                                        value={shippingDetails.phone}
                                        onChange={(e) => setShippingDetails(prev => ({ ...prev, phone: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="form-label small text-uppercase text-white-50 ls-1">Province / Region</label>
                                    <select
                                        required
                                        className="form-select bg-dark bg-opacity-50 border-white border-opacity-10 text-white rounded-4 py-2"
                                        value={shippingDetails.province}
                                        onChange={(e) => setShippingDetails(prev => ({ ...prev, province: e.target.value }))}
                                        style={{ backgroundColor: "rgba(33,37,41,0.5)" }}
                                    >
                                        {logistics.map(l => (
                                            <option key={l.region_name} value={l.region_name}>{l.region_name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label small text-uppercase text-white-50 ls-1">Pakistan Delivery City</label>
                                    <input 
                                        type="text"
                                        required
                                        className="form-control bg-dark bg-opacity-50 border-white border-opacity-10 text-white rounded-4 py-2"
                                        placeholder="e.g. Lahore, Karachi"
                                        value={shippingDetails.city}
                                        onChange={(e) => setShippingDetails(prev => ({ ...prev, city: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="form-label small text-uppercase text-white-50 ls-1">Delivery Address</label>
                                    <textarea
                                        required
                                        rows={2}
                                        className="form-control bg-dark bg-opacity-50 border-white border-opacity-10 text-white rounded-4 py-2"
                                        placeholder="Complete local shipping address"
                                        value={shippingDetails.address}
                                        onChange={(e) => setShippingDetails(prev => ({ ...prev, address: e.target.value }))}
                                    />
                                </div>

                                {/* Impact Fund Implementation */}
                                <div className="mt-3 p-3 bg-white bg-opacity-5 border border-warning border-opacity-25 rounded-4 shadow-sm">
                                    <label className="form-label small fw-bold text-warning d-flex align-items-center gap-2 mb-2">
                                        ✨ Direct-to-Artisan Impact Fund
                                    </label>
                                    <p className="small text-white-50 mb-3" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>
                                        100% of this contribution is routed directly to the master artisans crafting your pieces, helping preserve centuries-old heritage techniques.
                                    </p>
                                    <div className="d-flex flex-wrap gap-2">
                                        {[0, 2, 5, 10, 20].map((tip) => (
                                            <button
                                                key={tip}
                                                type="button"
                                                className={`btn btn-sm rounded-pill fw-bold ${impactFundTip === tip ? "btn-warning text-dark" : "btn-outline-light border-opacity-25 text-white-50"} flex-grow-1 transition-all`}
                                                onClick={() => setImpactFundTip(tip)}
                                            >
                                                {tip === 0 ? "No Tip" : `+$${tip}`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isCheckingOut}
                                    className="btn btn-warning w-100 rounded-pill py-3 fw-bold d-flex justify-content-center align-items-center gap-2 mt-3 hover-translate-y shadow-lg"
                                >
                                    {isCheckingOut ? (
                                        <><Loader size={20} className="spin" /> Processing...</>
                                    ) : (
                                        <>Confirm Cash on Delivery</>
                                    )}
                                </button>
                                <div className="text-center text-white-50 small mt-2">
                                    <span className="opacity-75">Pay securely when the items arrive at your doorstep.</span>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
