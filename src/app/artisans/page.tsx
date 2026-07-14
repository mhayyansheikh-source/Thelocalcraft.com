"use client"

import React, { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { MapPin, Star, Hammer, Users, Award } from "lucide-react"

export default function ArtisansPage() {
    const [artisans, setArtisans] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchArtisans() {
            setLoading(true)

            // Fetch artisans without orderBy to avoid needing a Firestore composite index
            const q = query(collection(db, 'profiles'), where('role', '==', 'artisan'))
            
            try {
                const snapshot = await getDocs(q)

                if (!snapshot.empty) {
                    const formattedArtisans = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        product_count: 0
                    })).sort((a: any, b: any) => (a.full_name || '').localeCompare(b.full_name || ''))
                    
                    setArtisans(formattedArtisans)
                }
            } catch (error) {
                console.error("Error fetching artisans:", error)
            }
            setLoading(false)
        }
        fetchArtisans()
    }, [])

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="container flex-grow-1 pt-5 mt-5">
                <header className="py-5 text-center">
                    <h1 className="display-4 fw-bold mb-3">The <span className="text-warning">Masters</span></h1>
                    <p className="text-white-50 mx-auto" style={{ maxWidth: "600px" }}>
                        Meet the guardians of ancient techniques. We partner with over 500 artisans across South Asia to preserve heritage.
                    </p>
                </header>

                <div className="row g-4 mb-5">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="col-md-4 animate-pulse">
                                <div className="rounded-5 bg-white bg-opacity-5" style={{ height: "350px" }} />
                            </div>
                        ))
                    ) : artisans.length > 0 ? (
                        artisans.map((artisan) => (
                            <div key={artisan.id} className="col-md-4">
                                <div className="p-4 rounded-5 border border-white border-opacity-10 transition-all hover-translate-y h-100 d-flex flex-column" style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(10px)" }}>
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="rounded-circle overflow-hidden shadow-lg border border-warning border-opacity-25" style={{ width: "80px", height: "80px" }}>
                                            <img
                                                src={artisan.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(artisan.full_name || "")}&background=random&color=fff`}
                                                alt={artisan.full_name}
                                                className="w-100 h-100 object-fit-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="fw-bold mb-1 d-flex align-items-center flex-wrap gap-2">
                                                {artisan.full_name || "Anonymous Master"}
                                                {artisan.mastery_tier && (
                                                    <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-2 py-1 rounded-pill small fw-normal d-flex align-items-center gap-1" style={{ fontSize: "0.7rem", transform: "translateY(-1px)" }}>
                                                        <Award size={10} /> {artisan.mastery_tier}
                                                    </span>
                                                )}
                                            </h4>
                                            <span className="badge bg-white bg-opacity-10 text-white-50 px-3 py-2 rounded-pill small mt-1">
                                                {artisan.specialty || "Master Artisan"}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-white-50 flex-grow-1 small mb-4" style={{ lineHeight: "1.6" }}>
                                        {artisan.bio || "Preserving generations of cultural heritage through meticulous craftsmanship and dedication to tradition."}
                                    </p>

                                    <div className="d-flex flex-column gap-3 border-top border-white-10 pt-4 mt-auto">
                                        <div className="d-flex align-items-center gap-2 text-white-50 small">
                                            <MapPin size={14} className="text-warning flex-shrink-0" />
                                            <span className="text-truncate">{artisan.location || "South Asian Heritage Hub"}</span>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between text-white-50 small">
                                            <div className="d-flex align-items-center gap-2">
                                                <Star size={14} className="text-warning flex-shrink-0" />
                                                <span>{artisan.years_experience || "15+"} Years</span>
                                            </div>
                                            {artisan.product_count > 0 && (
                                                <div className="d-flex align-items-center gap-2 px-2 py-1 rounded bg-white bg-opacity-10 text-white shadow-sm">
                                                    <Hammer size={12} className="text-info" />
                                                    <span>{artisan.product_count} piece{artisan.product_count !== 1 ? 's' : ''}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <a href={`/artisans/${artisan.id}`} className="btn btn-warning rounded-pill w-100 mt-4 fw-bold shadow-sm hover-scale transition-all d-flex align-items-center justify-content-center gap-2">
                                        View Stories & Art
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <Users size={64} className="text-warning opacity-25 mb-4" />
                            <h3>No artisans listed yet</h3>
                            <p className="text-white-50">Our community is growing. Check back soon.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
