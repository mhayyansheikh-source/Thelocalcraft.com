"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingBag, User, Menu, X } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { auth, db } from "@/lib/firebase/config"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // Auth State
    const [userAuth, setUserAuth] = useState<{ id: string, role: string } | null>(null)
    const [isAuthLoading, setIsAuthLoading] = useState(true)

    const { items, setIsCartOpen } = useCart()

    useEffect(() => {
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

        return () => unsubscribe()
    }, [])

    return (
        <>
            <nav className="fixed-top w-100 py-3 bg-dark border-bottom border-white-10" style={{ zIndex: 1000 }}>
                <div className="container d-flex justify-content-between align-items-center">
                    {/* Logo */}
                    <Link href="/" className="text-decoration-none d-flex align-items-center">
                        <div className="fw-bold text-white fs-4 text-uppercase">
                            The Local <span className="text-warning">Crafts</span>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="d-none d-md-flex align-items-center gap-4">
                        <Link href="/" className="text-white text-decoration-none fw-bold">Home</Link>
                        <Link href="/explore" className="text-white text-decoration-none fw-bold">Shop</Link>
                        <Link href="/artisans" className="text-white text-decoration-none fw-bold">Artisans</Link>
                    </div>

                    {/* Actions */}
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="btn btn-link text-white p-2 position-relative"
                            onClick={() => setIsCartOpen(true)}
                            aria-label="Shopping cart"
                        >
                            <ShoppingBag size={24} />
                            {items.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark" style={{ fontSize: "0.7rem" }}>
                                    {items.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </button>

                        {!isAuthLoading && (
                            userAuth ? (
                                <Link href={
                                    userAuth.role === 'admin' ? "/dashboard/admin" : 
                                    userAuth.role === 'customer' ? "/dashboard/customer" : 
                                    "/dashboard/artisan"
                                }
                                    className="btn btn-warning text-dark px-3 py-2 fw-bold d-none d-md-flex align-items-center gap-2">
                                    <User size={18} /> Dashboard
                                </Link>
                            ) : (
                                <Link href="/login" className="btn btn-warning text-dark px-3 py-2 fw-bold d-none d-md-flex align-items-center gap-2">
                                    <User size={18} /> Sign In
                                </Link>
                            )
                        )}

                        {/* Mobile Menu Toggle */}
                        <button className="btn btn-link text-white p-2 d-md-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="position-fixed top-0 start-0 w-100 vh-100 bg-dark d-flex flex-column align-items-center justify-content-center gap-4 d-md-none" style={{ zIndex: 1050 }}>
                    <button
                        className="btn btn-link text-white position-absolute top-0 end-0 m-3 p-3"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X size={40} />
                    </button>

                    <Link href="/" className="text-white text-decoration-none fs-1 fw-bold" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link href="/explore" className="text-white text-decoration-none fs-1 fw-bold" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                    <Link href="/artisans" className="text-white text-decoration-none fs-1 fw-bold" onClick={() => setIsMobileMenuOpen(false)}>Artisans</Link>

                    {!isAuthLoading && (
                        userAuth ? (
                            <Link href={
                                userAuth.role === 'admin' ? "/dashboard/admin" : 
                                userAuth.role === 'customer' ? "/dashboard/customer" : 
                                "/dashboard/artisan"
                            }
                                className="btn btn-warning text-dark px-5 py-3 mt-4 fw-bold fs-4 rounded-pill" onClick={() => setIsMobileMenuOpen(false)}>
                                Dashboard
                            </Link>
                        ) : (
                            <Link href="/login" className="btn btn-warning text-dark px-5 py-3 mt-4 fw-bold fs-4 rounded-pill" onClick={() => setIsMobileMenuOpen(false)}>
                                Sign In
                            </Link>
                        )
                    )}
                </div>
            )}
        </>
    )
}
