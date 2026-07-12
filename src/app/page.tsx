"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { VibeExplorer } from "@/components/search/VibeExplorer"
import { StatusBadge } from "@/components/artisan/StatusBadge"
import { ArtisanStoryViewer } from "@/components/artisan/ArtisanStoryViewer"
import { StudioLive } from "@/components/artisan/StudioLive"
import { ArrowRight, Sparkles, Shield, Truck, Award, ShoppingBag } from "lucide-react"
import Image from "next/image"

export default function Homepage() {
    const [email, setEmail] = useState("")

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
                        <div className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-1 bg-white bg-opacity-10 border-white-10 small text-uppercase fw-bold" style={{ letterSpacing: "2px", fontSize: "0.7rem" }}>
                            <Sparkles size={14} className="text-warning" /> New Arrival: Swat Valley Woodwork
                        </div>
                        <h1 className="fw-bold mb-4" style={{ letterSpacing: "-4px", fontSize: "clamp(3rem, 10vw, 5.5rem)" }}>
                            A Portal to <span className="text-warning">Heritage</span>
                        </h1>
                        <p className="lead text-white-50 mb-5 mx-auto opacity-75" style={{ maxWidth: "700px", fontSize: "clamp(1.1rem, 3vw, 1.25rem)", lineHeight: "1.6" }}>
                            Directly from the artisan's hand to your door. We use AI to preserve South Asia's dying arts and bring you the soul of authentic craftsmanship.
                        </p>
                        <div className="d-grid d-md-flex justify-content-md-center gap-3 mx-auto" style={{ maxWidth: "100%" }}>
                            <Link href="/explore" className="btn btn-accent fs-5 d-flex align-items-center justify-content-center gap-2 text-decoration-none">
                                Shop Collection <ArrowRight size={20} />
                            </Link>
                            <Link href="/artisans" className="btn btn-ghost fs-5 text-decoration-none d-flex align-items-center justify-content-center">
                                Meet the Artisans
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
                                desc: "Every unique piece is curated and authenticated by our heritage experts.",
                                glow: "rgba(245, 114, 36, 0.15)"
                            },
                            {
                                icon: Truck,
                                title: "Global Passage",
                                desc: "Premium tracked shipping from our artisans' workshops to your doorstep.",
                                glow: "rgba(13, 202, 240, 0.15)"
                            },
                            {
                                icon: Award,
                                title: "Ethical Craft",
                                desc: "100% fair-trade model ensuring sustainable livelihoods for artisan families.",
                                glow: "rgba(255, 193, 7, 0.15)"
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="col-lg-4 col-md-6">
                                <div className="feature-card p-4 h-100 text-center transition-all hover-translate-up"
                                    style={{
                                        background: "var(--surface-color)",
                                        border: "1px solid var(--border-color)"
                                    }}>
                                    <div className="d-inline-flex p-4 mb-4"
                                        style={{
                                            background: "var(--bg-color)",
                                            border: "1px solid var(--border-color)"
                                        }}>
                                        <item.icon className="text-warning" size={32} strokeWidth={1.5} />
                                    </div>
                                    <h4 className="fw-bold mb-3 text-white" style={{ letterSpacing: "-0.5px" }}>{item.title}</h4>
                                    <p className="text-white-50 px-3 mb-0" style={{ fontSize: "0.95rem", lineHeight: "1.6", opacity: 0.8 }}>
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
                                Our AI Storyteller bridges the gap between the weaver's loom and your heart.
                            </p>

                            <div className="row g-4 mb-5">
                                <div className="col-6">
                                    <div className="p-3 border-white-10" style={{ background: "var(--surface-color)", border: "1px solid var(--border-color)" }}>
                                        <div className="h3 fw-bold text-warning mb-0">500+</div>
                                        <div className="small text-white-50 text-uppercase" style={{ fontSize: "0.65rem", letterSpacing: "1px" }}>Artisans Empowered</div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-3 border-white-10" style={{ background: "var(--surface-color)", border: "1px solid var(--border-color)" }}>
                                        <div className="h3 fw-bold text-warning mb-0">12+</div>
                                        <div className="small text-white-50 text-uppercase" style={{ fontSize: "0.65rem", letterSpacing: "1px" }}>Heritage Hubs</div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex flex-column gap-3 mb-5">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="bg-success" style={{ width: "8px", height: "8px" }} />
                                    <span className="small text-white-50 fw-bold text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>Direct Artisan Connection Live</span>
                                </div>
                                <div className="d-flex gap-3">
                                    <StatusBadge artisanId="multan-pottery-1" />
                                    <StatusBadge artisanId="sindh-ajrak-2" />
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

                                    <ArtisanStoryViewer artisanId="featured-artisan-1" />

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
