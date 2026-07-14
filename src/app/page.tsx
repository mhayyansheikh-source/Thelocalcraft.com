"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ArrowRight, Shield, Award, ShoppingBag, Store } from "lucide-react"
import Image from "next/image"

import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, limit } from "firebase/firestore"

export default function Homepage() {
    const [email, setEmail] = useState("")
    const [featuredArtisans, setFeaturedArtisans] = useState<any[]>([])

    React.useEffect(() => {
        async function fetchFeatured() {
            const q = query(collection(db, 'profiles'), where('role', '==', 'artisan'), limit(3))
            const snap = await getDocs(q)
            if (!snap.empty) {
                setFeaturedArtisans(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
            }
        }
        fetchFeatured()
    }, [])

    const handleNewsletter = (e: React.FormEvent) => {
        e.preventDefault()
        alert(`Thank you for subscribing! Check your inbox ${email}`)
        setEmail("")
    }

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            {/* HERO SECTION */}
            <section className="position-relative vh-100 d-flex align-items-center justify-content-center overflow-hidden">
                <Image
                    src="/images/hero.png"
                    alt="Heritage Crafts"
                    fill
                    priority
                    quality={90}
                    style={{ objectFit: "cover", objectPosition: "center", zIndex: 1 }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                        background: "var(--bg-color)",
                        opacity: 0.7,
                        zIndex: 2
                    }}
                />

                <div className="container position-relative text-center pt-5" style={{ zIndex: 10 }}>
                    <div className="animate-fade-in-up">
                        <h1 className="fw-bold mb-4" style={{ letterSpacing: "-2px", fontSize: "clamp(3rem, 10vw, 5rem)" }}>
                            Beautiful Handmade <span className="text-warning">Crafts</span>
                        </h1>
                        <p className="lead text-white-75 mb-5 mx-auto" style={{ maxWidth: "700px", fontSize: "1.25rem", lineHeight: "1.6" }}>
                            Buy authentic products directly from local artisans.
                        </p>
                        <div className="d-flex flex-column flex-md-row justify-content-md-center align-items-center gap-3 mx-auto">
                            <Link href="/explore" className="btn btn-warning text-dark fs-5 fw-bold d-flex align-items-center justify-content-center gap-2 px-5 py-3 w-100 w-md-auto rounded-pill">
                                Shop Now <ArrowRight size={20} />
                            </Link>
                            <Link href="/artisans" className="btn btn-outline-light fs-5 fw-bold d-flex align-items-center justify-content-center gap-2 px-5 py-3 w-100 w-md-auto rounded-pill">
                                Meet the Artisans
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST & FEATURES */}
            <section className="py-5 bg-dark border-top border-white-10">
                <div className="container py-4">
                    <div className="row g-4 justify-content-center">
                        {[
                            {
                                icon: Shield,
                                title: "Verified Artisans",
                                desc: "We personally verify every seller."
                            },
                            {
                                icon: Store,
                                title: "Direct Purchase",
                                desc: "Buy directly from the makers."
                            },
                            {
                                icon: Award,
                                title: "Fair Price",
                                desc: "Artisans set their own prices."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="col-lg-4 col-md-6 text-center">
                                <div className="p-4 bg-white bg-opacity-5 rounded-4 h-100 border border-white-10">
                                    <div className="mb-4 d-inline-block p-3 rounded-circle bg-warning bg-opacity-10">
                                        <item.icon className="text-warning" size={32} />
                                    </div>
                                    <h4 className="fw-bold mb-3 text-white">{item.title}</h4>
                                    <p className="text-white-50 mb-0">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURED ARTISANS */}
            {featuredArtisans.length > 0 && (
                <section className="py-5 bg-dark border-top border-white-10">
                    <div className="container py-4 text-center">
                        <h2 className="fw-bold mb-5 text-white">Our Top Artisans</h2>
                        <div className="row g-4 justify-content-center">
                            {featuredArtisans.map(artisan => (
                                <div key={artisan.id} className="col-md-4">
                                    <div className="p-4 bg-white bg-opacity-5 rounded-4 border border-white-10 h-100">
                                        <h4 className="text-white fw-bold">{artisan.full_name}</h4>
                                        <p className="text-white-50">{artisan.specialty || "Craftsman"}</p>
                                        <p className="text-white-75 small">{artisan.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* NEWSLETTER SECTION */}
            <section className="py-5 bg-dark border-top border-white-10">
                <div className="container py-4 text-center">
                    <div className="p-5 bg-white bg-opacity-5 rounded-5 border border-white-10 max-w-md mx-auto" style={{ maxWidth: "800px" }}>
                        <ShoppingBag className="text-warning mb-4" size={48} />
                        <h2 className="fw-bold mb-3">Stay Updated</h2>
                        <p className="text-white-50 mb-4">
                            Get emails about new products and artisans.
                        </p>
                        <form onSubmit={handleNewsletter} className="d-flex flex-column flex-md-row gap-3 justify-content-center mx-auto" style={{ maxWidth: "500px" }}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="form-control bg-dark border-white-20 py-3 px-4 text-white rounded-pill"
                                required
                            />
                            <button type="submit" className="btn btn-warning text-dark fw-bold px-4 py-3 rounded-pill text-nowrap">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
