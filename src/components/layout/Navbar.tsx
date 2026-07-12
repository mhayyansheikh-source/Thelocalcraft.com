"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, Search, Menu, X, User, Trash2, ArrowRight, Loader, CheckCircle, Globe, Truck } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useCurrency } from "@/context/CurrencyContext"
import { auth, db } from "@/lib/firebase/config"
import { onAuthStateChanged } from "firebase/auth"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { CheckoutModal } from "@/components/checkout/CheckoutModal"

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isRegionsOpen, setIsRegionsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Checkout state
    const [showCheckoutModal, setShowCheckoutModal] = useState(false)

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

        // Fetch logistics config removed here as it is moved to CheckoutModal

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


    // Shipping calculation moved to CheckoutModal

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setIsSearchOpen(false)
            // Route to explore page with the search query mapped
            router.push(`/explore?q=${encodeURIComponent(searchQuery)}`)
            setSearchQuery("")
        }
    }

    // Checkout handler moved to CheckoutModal

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
                        <div className="fw-bold text-white fs-4 text-uppercase" style={{ letterSpacing: "-1px" }}>
                            The Local <span className="text-warning">Crafts</span>
                        </div>
                    </Link>



                    {/* Actions */}
                    <div className="d-flex align-items-center gap-3">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="btn btn-link text-white p-3 p-md-2 d-none d-md-block opacity-75 hover-opacity-100 transition-opacity"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>
                        <button
                            className="btn btn-link text-white p-3 p-md-2 opacity-75 hover-opacity-100 transition-opacity position-relative"
                            onClick={() => setIsCartOpen(true)}
                            aria-label="Shopping cart"
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
                                    className="btn btn-accent px-4 py-2 d-none d-md-flex align-items-center gap-2" style={{ fontSize: "0.85rem" }}>
                                    <User size={16} /> Dashboard
                                </Link>
                            ) : (
                                <Link href="/login" className="btn btn-accent px-4 py-2 d-none d-md-flex align-items-center gap-2" style={{ fontSize: "0.85rem" }}>
                                    <User size={16} /> Sign In
                                </Link>
                            )
                        )}

                        {/* Universal Menu Toggle */}
                        <button className="btn btn-link text-white p-3 p-md-2 d-flex align-items-center gap-2 text-decoration-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? (
                                <>
                                    <span className="small text-uppercase fw-bold d-none d-md-block" style={{ letterSpacing: "2px", fontSize: "0.75rem" }}>CLOSE</span>
                                    <X size={24} />
                                </>
                            ) : (
                                <>
                                    <span className="small text-uppercase fw-bold d-none d-md-block" style={{ letterSpacing: "2px", fontSize: "0.75rem" }}>MENU</span>
                                    <Menu size={24} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </nav>

            {/* Fullscreen Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="position-fixed top-0 start-0 w-100 vh-100 bg-dark d-flex flex-column align-items-center justify-content-center gap-4 animate-fade-in" style={{ zIndex: 1050 }}>
                    <button
                        className="btn btn-link text-white position-absolute top-0 end-0 m-3 p-3 opacity-75 hover-opacity-100 transition-all hover-scale"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{ zIndex: 1060 }}
                        aria-label="Close menu"
                    >
                        <X size={40} />
                    </button>

                    {["Explore", "Artisans", "Stories"].map((item) => (
                        <Link key={item} href={`/${item.toLowerCase()}`}
                            className="text-white text-decoration-none fs-2 fw-bold text-uppercase"
                            onClick={() => setIsMobileMenuOpen(false)}>
                            {item}
                        </Link>
                    ))}

                    <div className="d-flex align-items-center gap-3 mt-3">
                        <button onClick={toggleCurrency} className="btn btn-ghost px-4 py-2 small text-uppercase d-flex align-items-center gap-2 hover-bg-warning hover-text-dark transition-all">
                            <Globe size={16} /> {currency}
                        </button>
                    </div>

                    {!isAuthLoading && (
                        userAuth ? (
                            <Link href={
                                userAuth.role === 'admin' ? "/dashboard/admin" : 
                                userAuth.role === 'wholesale' ? "/dashboard/wholesale" :
                                "/dashboard/artisan"
                            }
                                className="btn btn-accent px-5 py-3 fs-5 mt-4 d-flex align-items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                <User size={20} /> Dashboard
                            </Link>
                        ) : (
                            <Link href="/login" className="btn btn-accent px-5 py-3 fs-5 mt-4 d-flex align-items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                                <User size={20} /> Sign In
                            </Link>
                        )
                    )}
                </div>
            )}

            {/* Global Search Overlay */}
            {isSearchOpen && (
                <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex flex-column"
                    style={{ zIndex: 1050, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)" }}>
                    <button
                        className="btn btn-link text-white position-absolute top-0 end-0 m-3 p-3 opacity-75 hover-opacity-100 transition-all hover-scale"
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
                            <button className="btn btn-link text-white p-3 opacity-75 hover-opacity-100" onClick={() => setIsCartOpen(false)}>
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

            <CheckoutModal isOpen={showCheckoutModal} onClose={() => setShowCheckoutModal(false)} />
        </>
    )
}
