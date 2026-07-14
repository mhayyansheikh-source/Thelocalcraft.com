"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { VibeExplorer } from "@/components/search/VibeExplorer"
import { StatusBadge } from "@/components/artisan/StatusBadge"
import { ArtisanStoryViewer } from "@/components/artisan/ArtisanStoryViewer"
import { StudioLive } from "@/components/artisan/StudioLive"
import { ArrowRight, Sparkles, Shield, Truck, Award, ShoppingBag, Box, Link as LinkIcon, Flame, Globe, Building, CheckCircle } from "lucide-react"
import Image from "next/image"

import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, limit } from "firebase/firestore"

export default function Homepage() {
    const [email, setEmail] = useState("")
    const [featuredArtisans, setFeaturedArtisans] = useState<any[]>([])

    React.useEffect(() => {
        async function fetchFeatured() {
            const q = query(collection(db, 'profiles'), where('role', '==', 'artisan'), limit(2))
            const snap = await getDocs(q)
            if (!snap.empty) {
                setFeaturedArtisans(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
            }
        }
        fetchFeatured()
    }, [])

    const handleNewsletter = (e: React.FormEvent) => {
        e.preventDefault()
        alert(`Heritage list joined! Check your inbox ${email}`)
        setEmail("")
    }

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            {/* HERO SECTION */}
            <section className="position-relative vh-100 d-flex align-items-center justify-content-center overflow-hidden">
                <Image
                    src="/images/hero.png"
                    alt="Heritage Crafts "
                    fill
                    priority
                    quality={90}
                    style={{ objectFit: "cover", objectPosition: "center", zIndex: 1 }}
                />
                <div className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                        background: "var(--bg-color)",
                        opacity: 0.6,
                        zIndex: 2
                    }}
                />

                <div className="container position-relative text-center pt-5" style={{ zIndex: 10 }}>
                    <div className="animate-fade-in-up">
                        <h1 className="fw-bold mb-4" style={{ letterSpacing: "-4px", fontSize: "clamp(3rem, 10vw, 5.5rem)" }}>
                            A Portal to <span className="text-warning">Heritage</span>
                        </h1>
                        <p className="lead text-white-50 mb-5 mx-auto opacity-75" style={{ maxWidth: "700px", fontSize: "clamp(1.1rem, 3vw, 1.25rem)", lineHeight: "1.6" }}>
                            Pure craftsmanship, delivered directly to you.
                        </p>
                        <div className="d-flex flex-column flex-md-row justify-content-md-center align-items-center gap-3 mx-auto">
                            <Link href="/explore" className="btn btn-accent fs-5 d-flex align-items-center justify-content-center gap-2 text-decoration-none px-5 py-3 w-100 w-md-auto">
                                Shop Collection <ArrowRight size={20} />
                            </Link>
                            <Link href="/dashboard/wholesale" className="btn btn-outline-light fs-5 d-flex align-items-center justify-content-center gap-2 text-decoration-none px-5 py-3 w-100 w-md-auto bg-dark bg-opacity-50" style={{ backdropFilter: "blur(10px)" }}>
                                Partner Wholesale <Building size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST & FEATURES */}
            <section className="py-responsive position-relative bg-dark">
                <div className="container position-relative" style={{ zIndex: 1 }}>
                    <div className="row g-4 justify-content-center">
                        {[
                            {
                                icon: Shield,
                                title: "Verified Heritage",
                                desc: "Strict curation and authenticity."
                            },
                            {
                                icon: LinkIcon,
                                title: "Blockchain Provenance",
                                desc: "Immutable digital ledger for every piece."
                            },
                            {
                                icon: Award,
                                title: "Ethical Craft",
                                desc: "100% fair-trade model."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="col-lg-4 col-md-6">
                                <div className="p-4 h-100 text-center transition-all hover-translate-up"
                                    style={{
                                        background: "var(--surface-color)",
                                        border: "1px solid var(--border-color)"
                                    }}>
                                    <div className="mb-4">
                                        <item.icon className="text-warning" size={32} strokeWidth={1.5} />
                                    </div>
                                    <h4 className="fw-bold mb-3 text-white" style={{ letterSpacing: "-0.5px" }}>{item.title}</h4>
                                    <p className="text-white-50 mb-0" style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.8 }}>
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5">
                        <StudioLive />
                    </div>
                </div>
            </section>

            {/* IMMERSIVE HERITAGE (CONSUMER INNOVATION) */}
            <section className="py-responsive bg-dark position-relative border-top border-white-10">
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-6">
                            <div className="d-flex align-items-center gap-3 text-warning mb-4">
                                <span className="small text-uppercase fw-bold" style={{ letterSpacing: "4px", fontSize: "0.75rem" }}>Consumer Innovation</span>
                                <div className="flex-grow-1" style={{ height: "1px", background: "linear-gradient(to right, rgba(245, 114, 36, 0.4), transparent)" }} />
                            </div>
                            <h2 className="fw-bold mb-4 text-white" style={{ letterSpacing: "-2px", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
                                Experience <span className="text-warning">Heritage</span> Like Never Before
                            </h2>
                            <p className="text-white-50 mb-5" style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
                                We merge ancient craftsmanship with frontier technology. Try pieces in your space before purchasing and verify their entire origin story.
                            </p>
                            
                            <div className="d-flex flex-column gap-4">
                                <div className="d-flex gap-3 align-items-start">
                                    <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-4 shadow">
                                        <Box size={24} />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold text-white mb-2">Augmented Reality Showroom</h5>
                                        <p className="text-white-50 mb-0 small" style={{ lineHeight: "1.6" }}>Use your camera to place life-sized artifacts in your living room. See the texture and scale perfectly.</p>
                                    </div>
                                </div>
                                <div className="d-flex gap-3 align-items-start">
                                    <div className="p-3 bg-info bg-opacity-10 text-info rounded-4 shadow">
                                        <LinkIcon size={24} />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold text-white mb-2">Blockchain Provenance Ledger</h5>
                                        <p className="text-white-50 mb-0 small" style={{ lineHeight: "1.6" }}>Every purchase comes with an immutable digital certificate. Trace the exact artisan, materials, and journey of your piece.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="position-relative p-2 rounded-5 border border-white-10 bg-white bg-opacity-5" style={{ minHeight: "450px" }}>
                                <div className="position-absolute top-50 start-50 translate-middle text-center w-100 p-4">
                                    <Box size={64} className="text-white-50 mb-4 opacity-50 mx-auto" />
                                    <h4 className="fw-bold text-white mb-3">AR Experience Active</h4>
                                    <p className="text-white-50 small">Scan any product from our catalog to launch the immersive showroom on your mobile device.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* EXCLUSIVE VILLAGE DROPS */}
            <section className="py-responsive bg-dark position-relative border-top border-white-10">
                <div className="container text-center mb-5">
                    <Flame className="text-danger mb-3" size={48} />
                    <h2 className="fw-bold text-white" style={{ letterSpacing: "-1.5px", fontSize: "clamp(2rem, 5vw, 3rem)" }}>Village Drops</h2>
                    <p className="text-white-50 mx-auto" style={{ maxWidth: "600px", fontSize: "1.1rem" }}>Exclusive, limited-edition runs straight from artisan collectives. Fund the craft, own the legacy.</p>
                </div>
                
                <div className="container">
                    <div className="row g-4 justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <div className="p-4 rounded-5 border border-danger border-opacity-25 bg-danger bg-opacity-10 position-relative overflow-hidden transition-all hover-translate-up text-center">
                                <div className="position-absolute top-0 end-0 p-3">
                                    <span className="badge bg-danger text-white rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-2">
                                        <div className="bg-white rounded-circle blink" style={{ width: "8px", height: "8px", animation: "pulse 2s infinite" }} /> LIVE
                                    </span>
                                </div>
                                <h3 className="fw-bold text-white mt-4 mb-3">Multan Blue Pottery Collection 01</h3>
                                <p className="text-white-70 mb-4 px-md-4">Only 50 pieces will be crafted by Master Artisan Ustad Alam. Secure your spot in the drop.</p>
                                <div className="progress bg-dark mb-3 rounded-pill" style={{ height: "12px" }}>
                                    <div className="progress-bar bg-danger rounded-pill" style={{ width: "85%" }}></div>
                                </div>
                                <div className="d-flex justify-content-between text-white-50 small fw-bold text-uppercase ls-1 mb-4">
                                    <span>85% Funded</span>
                                    <span>Ending Soon</span>
                                </div>
                                <Link href="/explore" className="btn btn-outline-danger border-2 rounded-pill px-5 py-3 fw-bold shadow hover-scale w-100">
                                    Participate Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ENTERPRISE & SYNDICATES (WHOLESALE FOCUS) */}
            <section className="py-responsive bg-dark position-relative border-top border-white-10">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-white mb-3" style={{ letterSpacing: "-1.5px", fontSize: "clamp(2rem, 5vw, 3rem)" }}>Built for <span className="text-info">Scale</span></h2>
                        <p className="text-white-50 mx-auto" style={{ maxWidth: "600px", fontSize: "1.1rem" }}>B2B tools that redefine how national retailers source authentic heritage craft.</p>
                    </div>

                    <div className="d-flex overflow-auto pb-4 hide-scrollbar snap-x align-items-stretch" style={{ scrollSnapType: "x mandatory", gap: "1.5rem" }}>
                        {[
                            {
                                icon: Globe,
                                title: "Wholesale Syndicates",
                                color: "info",
                                desc: "Join forces with other retailers to pool purchasing power and unlock massive volume discounts on heritage crafts."
                            },
                            {
                                icon: Box,
                                title: "Smart Restock AI",
                                color: "success",
                                desc: "Our predictive algorithms analyze demand signals to automate your inventory replenishment before you run out."
                            },
                            {
                                icon: Truck,
                                title: "National Supply Map",
                                color: "warning",
                                desc: "Real-time visibility into the exact geographic origin of your inventory, from the village kiln to your warehouse."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="col-10 col-md-5 col-lg-4 flex-shrink-0" style={{ scrollSnapAlign: "center" }}>
                                <div className={`p-5 h-100 rounded-5 border border-${feature.color} border-opacity-25 bg-white bg-opacity-5 transition-all hover-translate-y d-flex flex-column`}>
                                    <div className={`mb-4 d-inline-block rounded-circle p-3 bg-${feature.color} bg-opacity-10 text-${feature.color}`}>
                                        <feature.icon size={32} />
                                    </div>
                                    <h4 className="fw-bold text-white mb-3">{feature.title}</h4>
                                    <p className="text-white-50 mb-0 flex-grow-1" style={{ lineHeight: "1.6" }}>{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-5">
                        <Link href="/dashboard/wholesale" className="btn btn-info text-dark rounded-pill px-5 py-3 fw-bold shadow-lg d-inline-flex align-items-center gap-2 hover-scale">
                            Explore B2B Solutions <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* AI DISCOVERY (EXPLORE) SECTION */}
            <section id="explore" className="py-responsive bg-dark">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-12">
                            <VibeExplorer />
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED STORIES SECTION */}
            <section id="stories" className="py-responsive position-relative overflow-hidden bg-dark">
                {/* Subtle Decorative Pattern Overlay Removed for Lamborghini aesthetic */}

                <div className="container position-relative" style={{ zIndex: 2 }}>
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-5">
                            <div className="d-flex align-items-center gap-3 text-warning mb-4">
                                <span className="small text-uppercase fw-bold" style={{ letterSpacing: "4px", fontSize: "0.75rem" }}>The Artisan Soul</span>
                                <div className="flex-grow-1" style={{ height: "1px", background: "linear-gradient(to right, rgba(245, 114, 36, 0.4), transparent)" }} />
                            </div>

                            <h2 className="fw-bold mb-4 text-white" style={{ letterSpacing: "-2px", fontSize: "clamp(2.5rem, 8vw, 4rem)" }}>
                                Behind Every <span className="text-warning">Stitch</span>
                            </h2>

                            <p className="text-white-50 mb-5 opacity-75" style={{ lineHeight: "1.8", fontSize: "clamp(1.1rem, 3vw, 1.25rem)" }}>
                                Every handicraft is a living archive, a narrative of resilience passed down through generations.
                            </p>

                            <div className="d-flex flex-column gap-3 mb-5">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="bg-success" style={{ width: "8px", height: "8px" }} />
                                    <span className="small text-white-50 fw-bold text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>Direct Artisan Connection Live</span>
                                </div>
                                <div className="d-flex gap-3">
                                    {featuredArtisans.length > 0 ? featuredArtisans.map(a => (
                                        <StatusBadge key={a.id} artisanId={a.id} />
                                    )) : (
                                        <p className="text-white-50 small mb-0">Connecting to artisan workshops...</p>
                                    )}
                                </div>
                            </div>

                            <Link href="/stories" className="btn btn-ghost px-5 py-3 text-decoration-none d-inline-block hover-scale">
                                View Documentary Library
                            </Link>
                        </div>

                        <div className="col-lg-7">
                            <div className="position-relative">
                                <div className="p-2 border-white-10 position-relative overflow-hidden"
                                    style={{
                                        background: "var(--surface-color)",
                                        border: "1px solid var(--border-color)"
                                    }}>

                                    {featuredArtisans.length > 0 && (
                                        <ArtisanStoryViewer artisanId={featuredArtisans[0].id} />
                                    )}

                                    {/* Fallback pattern if story is loading/missing */}
                                    <div className="p-5 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "350px" }}>
                                        <div className="mb-4 d-inline-flex p-4 rounded-circle" style={{ background: "rgba(245, 114, 36, 0.1)" }}>
                                            <Sparkles className="text-warning" size={40} />
                                        </div>
                                        <h4 className="fw-bold mb-2">Heritage Soundscape</h4>
                                        <p className="text-white-50 small mb-4 px-5">Select an artisan above to hear their journey come to life through our AI narrator.</p>
                                        <div className="d-flex gap-2 align-items-end" style={{ height: "40px" }}>
                                            {[0.2, 0.4, 0.8, 0.6, 0.3].map((op, i) => (
                                                <div key={i} className="bg-warning" style={{ width: "4px", height: `${op * 100}%`, borderRadius: "2px", opacity: op }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEWSLETTER SECTION */}
            <section className="py-responsive mb-5 bg-dark">
                <div className="container">
                    <div className="p-5 border-white-10 text-center position-relative overflow-hidden"
                        style={{
                            background: "var(--surface-color)",
                            border: "1px solid var(--border-color)"
                        }}>
                        <div className="position-relative" style={{ zIndex: 5 }}>
                            <ShoppingBag className="text-warning mb-4" size={48} />
                            <h2 className="display-5 fw-bold mb-3">Join the Heritage List</h2>
                            <p className="text-white-50 mb-5 mx-auto" style={{ maxWidth: "600px" }}>
                                Be the first to know about new artisan launches and seasonal drops. Get exclusive backstories from our creators.
                            </p>
                            <form onSubmit={handleNewsletter} className="d-grid d-md-flex gap-3 justify-content-md-center align-items-center mx-auto" style={{ maxWidth: "500px" }}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="form-control bg-dark border-white-10 py-3 px-4 text-white w-100"
                                    style={{ borderRadius: 0 }}
                                    required
                                />
                                <button type="submit" className="btn btn-accent px-5 py-3 w-100 text-nowrap">
                                    Keep Me Updated
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
