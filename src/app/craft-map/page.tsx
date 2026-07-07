"use client"

import React, { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs } from "firebase/firestore"
import { MapPin, Search, Navigation, Filter, Star, Fingerprint, ChevronRight, X } from "lucide-react"
import Link from "next/link"

// Define rough relative coordinates for major craft hubs in Pakistan
// Top and Left percentages relative to a bounding box representing Pakistan
const CRAFT_HUBS = [
    { id: "gilgit", city: "Gilgit", region: "Gilgit-Baltistan", top: 15, left: 70 },
    { id: "peshawar", city: "Peshawar", region: "KPK", top: 35, left: 45 },
    { id: "islamabad", city: "Islamabad", region: "Punjab", top: 38, left: 60 },
    { id: "lahore", city: "Lahore", region: "Punjab", top: 48, left: 75 },
    { id: "chiniot", city: "Chiniot", region: "Punjab", top: 52, left: 63 },
    { id: "multan", city: "Multan", region: "Punjab", top: 62, left: 55 },
    { id: "bahawalpur", city: "Bahawalpur", region: "Punjab", top: 70, left: 45 },
    { id: "quetta", city: "Quetta", region: "Balochistan", top: 60, left: 25 },
    { id: "sukkur", city: "Sukkur", region: "Sindh", top: 75, left: 35 },
    { id: "hyderabad", city: "Hyderabad", region: "Sindh", top: 85, left: 38 },
    { id: "karachi", city: "Karachi", region: "Sindh", top: 92, left: 30 },
    { id: "gwadar", city: "Gwadar", region: "Balochistan", top: 88, left: 10 },
]

export default function CraftMapPage() {
    const [artisans, setArtisans] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedHub, setSelectedHub] = useState<any | null>(null)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        async function fetchMapData() {
            setLoading(true)
            // Fetch all Master Artisans
            const q = query(collection(db, 'profiles'), where('role', '==', 'artisan'))
            const snapshot = await getDocs(q)

            if (!snapshot.empty) {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                setArtisans(data)
            }
            setLoading(false)
        }
        fetchMapData()
    }, [])

    // Map artisans to hubs if their location string contains the hub city
    const getHubArtisans = (hubCity: string) => {
        return artisans.filter(a => a.location?.toLowerCase().includes(hubCity.toLowerCase()))
    }

    const filteredHubs = CRAFT_HUBS.filter(hub => {
        if (!searchQuery) return true
        const hubArtisans = getHubArtisans(hub.city)
        return hub.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hub.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hubArtisans.some(a => a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || a.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
    })

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="flex-grow-1 position-relative overflow-hidden" style={{ minHeight: "calc(100vh - 80px)", marginTop: "80px" }}>

                {/* Map Interface Background Overlay */}
                <div className="position-absolute w-100 h-100 z-0 bg-dark pointer-events-none opacity-50"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%)' }}></div>
                <div className="position-absolute w-100 h-100 z-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.95) 100%)' }}></div>

                {/* Search Bar Floating */}
                <div className="position-absolute top-0 start-50 translate-middle-x mt-4 z-2" style={{ width: "90%", maxWidth: "600px" }}>
                    <div className="bg-dark bg-opacity-80 backdrop-blur rounded-pill p-3 border border-white-10 shadow-lg d-flex align-items-center gap-3">
                        <Search className="text-white-50 ms-2" size={20} />
                        <input
                            type="text"
                            className="form-control bg-transparent border-0 text-white shadow-none p-0"
                            placeholder="Explore by city, craft, or master artisan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-warning rounded-pill px-4 fw-bold shadow-sm d-none d-sm-block">Explore</button>
                    </div>
                </div>

                {/* THE MAP CONTAINER */}
                <div className="container h-100 position-relative z-1 d-flex align-items-center justify-content-center pt-5 mt-5">

                    {/* The "Map" SVG overlay (abstract) */}
                    <div className="position-relative w-100" style={{ maxWidth: "600px", height: "70vh", minHeight: "600px" }}>

                        {/* Connecting Lines for Aesthetic */}
                        <svg className="position-absolute w-100 h-100 pointer-events-none opacity-25" style={{ top: 0, left: 0 }}>
                            {CRAFT_HUBS.map((hub, i) => {
                                const nextHub = CRAFT_HUBS[i + 1]
                                if (!nextHub) return null
                                return (
                                    <line
                                        key={hub.id}
                                        x1={`${hub.left}%`} y1={`${hub.top}%`}
                                        x2={`${nextHub.left}%`} y2={`${nextHub.top}%`}
                                        stroke="#ffca2c" strokeWidth="1" strokeDasharray="5,5"
                                    />
                                )
                            })}
                        </svg>

                        {/* Drop Pins */}
                        {filteredHubs.map(hub => {
                            const hubArtisans = getHubArtisans(hub.city)
                            const isSelected = selectedHub?.id === hub.id
                            const hasActiveMakers = hubArtisans.length > 0

                            return (
                                <div
                                    key={hub.id}
                                    className="position-absolute translate-middle transition-all cursor-pointer"
                                    style={{ top: `${hub.top}%`, left: `${hub.left}%`, zIndex: isSelected ? 100 : 10 }}
                                    onClick={() => setSelectedHub(hub)}
                                >
                                    <div className="position-relative d-flex flex-column align-items-center">

                                        {/* Pin Marker */}
                                        <div className={`rounded-circle d-flex align-items-center justify-content-center transition-all ${isSelected ? 'bg-warning text-dark shadow-lg scale-110' : hasActiveMakers ? 'bg-white bg-opacity-20 text-white backdrop-blur border border-white-25 hover-bg-warning hover-text-dark' : 'bg-dark border border-white-10 text-white-50 opacity-50'}`}
                                            style={{ width: isSelected ? "48px" : "36px", height: isSelected ? "48px" : "36px" }}>
                                            <MapPin size={isSelected ? 24 : 16} />
                                        </div>

                                        {/* Pulse effect if selected or has makers */}
                                        {isSelected && <span className="position-absolute w-100 h-100 bg-warning rounded-circle start-0 top-0 pulse-animation z-n1"></span>}

                                        {/* Label */}
                                        <div className={`mt-2 px-2 py-1 rounded small fw-bold text-nowrap transition-all ${isSelected ? 'bg-warning text-dark shadow' : 'bg-dark bg-opacity-80 text-white border border-white-10'}`} style={{ backdropFilter: 'blur(5px)' }}>
                                            {hub.city}
                                        </div>

                                        {/* Artisan Count Badge */}
                                        {hasActiveMakers && !isSelected && (
                                            <div className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-dark" style={{ transform: 'translate(-30%, -30%)' }}>
                                                {hubArtisans.length}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* SLIDE-UP DRAWER FOR SELECTED HUB */}
                <div className={`position-fixed bottom-0 start-0 w-100 bg-dark bg-opacity-95 shadow-lg border-top border-white-10 transition-transform duration-300 ${selectedHub ? 'translate-y-0' : 'translate-y-100'}`} style={{ zIndex: 1050, backdropFilter: 'blur(20px)', maxHeight: '60vh', overflowY: 'auto' }}>
                    <div className="container py-4">
                        {selectedHub && (
                            <>
                                <div className="d-flex align-items-center justify-content-between border-bottom border-white-10 pb-3 mb-4 sticky-top bg-dark pt-2">
                                    <div>
                                        <div className="badge bg-warning bg-opacity-20 text-warning px-3 py-2 rounded-pill small mb-2 text-uppercase fw-bold ls-1">{selectedHub.region}</div>
                                        <h3 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                            <Navigation className="text-white-50" size={24} /> Discover {selectedHub.city}
                                        </h3>
                                    </div>
                                    <button onClick={() => setSelectedHub(null)} className="btn btn-outline-light rounded-circle p-2 border-opacity-25 hover-bg-white hover-text-dark transition-all flex-shrink-0">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="row g-4 pb-5">
                                    {getHubArtisans(selectedHub.city).length === 0 ? (
                                        <div className="col-12 text-center py-5 text-white-50">
                                            <Fingerprint size={48} className="opacity-25 mb-3 mx-auto" />
                                            <h5 className="fw-bold">No active masters found here yet.</h5>
                                            <p className="mb-0">We are actively sourcing new heritage creators from {selectedHub.city}.</p>
                                        </div>
                                    ) : (
                                        getHubArtisans(selectedHub.city).map(artisan => (
                                            <div key={artisan.id} className="col-md-6 col-lg-4">
                                                <div className="p-3 rounded-4 border border-white-10 bg-white bg-opacity-5 d-flex gap-3 hover-bg-white-10 transition-colors h-100">
                                                    <img
                                                        src={artisan.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(artisan.full_name)}&background=random&color=fff`}
                                                        className="rounded-3 object-fit-cover shadow-sm"
                                                        style={{ width: "80px", height: "80px" }}
                                                        alt={artisan.full_name}
                                                    />
                                                    <div className="d-flex flex-column justify-content-between">
                                                        <div>
                                                            <div className="fw-bold text-white mb-1 d-flex gap-1 align-items-center">
                                                                {artisan.full_name} <Star size={12} className="text-warning" fill="currentColor" />
                                                            </div>
                                                            <div className="small text-warning">{artisan.specialty}</div>
                                                        </div>
                                                        <Link href={`/artisans`} className="small text-white-50 text-decoration-none hover-text-white d-flex align-items-center gap-1 mt-2">
                                                            View Masterwork <ChevronRight size={14} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </main>
        </div>
    )
}
