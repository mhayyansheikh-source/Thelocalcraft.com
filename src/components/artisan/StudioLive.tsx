"use client"

import React, { useEffect, useState } from "react"
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, orderBy, doc, getDoc } from "firebase/firestore"
import { Play, Eye, Heart, Video, X, Maximize2, User } from "lucide-react"
import Link from "next/link"
export const StudioLive = () => {
    const [feeds, setFeeds] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedFeed, setSelectedFeed] = useState<any>(null)

    useEffect(() => {
        async function fetchFeeds() {
            const q = query(collection(db, "artisan_feeds"), where("status", "==", "active"), orderBy("is_live", "desc"), orderBy("created_at", "desc"))
            const snap = await getDocs(q)
            const feedsData = []
            for (const docSnap of snap.docs) {
                const feed = docSnap.data()
                if (feed.artisan_id) {
                    const profSnap = await getDoc(doc(db, "profiles", feed.artisan_id))
                    if (profSnap.exists()) feed.profiles = profSnap.data()
                }
                feedsData.push({ id: docSnap.id, ...feed })
            }
            if (feedsData) setFeeds(feedsData)
            setLoading(false)
        }
        fetchFeeds()
    }, [])

    if (loading) return (
        <div className="d-flex gap-4 overflow-hidden py-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-shrink-0 rounded-5 bg-white bg-opacity-5 animate-pulse shadow-lg" style={{ width: "180px", height: "300px" }} />
            ))}
        </div>
    )

    if (feeds.length === 0) return null

    return (
        <section className="py-5 overflow-hidden">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-3">
                    <div className="p-2 bg-danger bg-opacity-10 rounded-circle pulse-animation shadow-sm">
                        <Video size={24} className="text-danger" />
                    </div>
                    <div>
                        <h4 className="fw-bold mb-0 text-white">Live from the Studio</h4>
                        <p className="text-white-50 small mb-0 opacity-75">Witness heritage in the making, real-time.</p>
                    </div>
                </div>
            </div>

            <div className="d-flex gap-4 overflow-auto pb-4 custom-scrollbar scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
                {feeds.map((feed) => (
                    <div 
                        key={feed.id} 
                        onClick={() => setSelectedFeed(feed)}
                        className="flex-shrink-0 position-relative rounded-5 overflow-hidden shadow-2xl transition-all hover-translate-y pointer group" 
                        style={{ width: "180px", height: "300px", cursor: "pointer", border: feed.is_live ? "3px solid #dc3545" : "1px solid rgba(255,255,255,0.1)" }}
                    >
                        <video 
                            src={feed.video_url} 
                            className="w-100 h-100 object-fit-cover opacity-60 group-hover-opacity-90 transition-opacity" 
                            muted
                            loop
                            playsInline
                            onMouseOver={(e) => e.currentTarget.play()}
                            onMouseOut={(e) => e.currentTarget.pause()}
                        />
                        
                        <div className="position-absolute top-0 start-0 w-100 p-3 bg-gradient-to-b from-dark to-transparent">
                            {feed.is_live ? (
                                <div className="badge bg-danger rounded-pill px-2 py-1 small fw-bold shadow-lg d-flex align-items-center gap-1">
                                    <span className="spinner-grow spinner-grow-sm" role="status"></span> LIVE
                                </div>
                            ) : (
                                <div className="badge bg-dark bg-opacity-50 blur-sm rounded-pill px-2 py-1 small fw-bold text-white-50">Story</div>
                            )}
                        </div>

                        <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-to-t from-dark to-transparent">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <div className="rounded-circle bg-warning bg-opacity-20 d-flex align-items-center justify-content-center text-warning fw-bold small shadow-sm" style={{ width: "24px", height: "24px", fontSize: "10px" }}>
                                    {feed.profiles?.full_name?.charAt(0)}
                                </div>
                                <div className="small text-white fw-bold truncate-1 opacity-90">{feed.profiles?.full_name}</div>
                            </div>
                            <div className="text-white-50 x-small truncate-1 opacity-75">{feed.profiles?.specialty}</div>
                        </div>

                        <div className="position-absolute start-50 top-50 translate-middle opacity-0 group-hover-opacity-100 transition-opacity bg-warning rounded-circle p-3 text-dark shadow-2xl">
                            <Play size={24} fill="currentColor" strokeWidth={0} />
                        </div>
                    </div>
                ))}
            </div>

            {/* FULL SCREEN STORY PLAYER MODAL */}
            {selectedFeed && (
                <div className="fixed-top w-100 h-100 bg-black bg-opacity-95 d-flex align-items-center justify-content-center z-max animate-fade-in" style={{ zIndex: 9999 }}>
                    <button 
                        onClick={() => setSelectedFeed(null)} 
                        className="btn btn-outline-light border-0 rounded-circle p-3 position-absolute top-0 end-0 m-4 hover-bg-white-10 transition-all z-2 shadow-lg"
                    >
                        <X size={32} />
                    </button>

                    <div className="row w-100 h-100 g-0 flex-column flex-lg-row">
                        {/* THE VIDEO PLAYER */}
                        <div className="col-12 col-lg-5 h-50 h-lg-100 bg-black d-flex align-items-center justify-content-center position-relative">
                            <video 
                                src={selectedFeed.video_url} 
                                className="h-100 w-100 object-fit-contain shadow-2xl" 
                                autoPlay 
                                controls={false}
                                loop
                                playsInline
                            />
                            
                            {/* OVERLAY ELEMENTS */}
                            <div className="position-absolute bottom-0 start-0 w-100 p-4 p-lg-5 bg-gradient-to-t from-black to-transparent z-1">
                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-circle bg-warning p-3 text-dark fw-bold fs-5 shadow-lg">
                                            {selectedFeed.profiles?.full_name?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="fw-bold mb-0 text-white shadow-sm">{selectedFeed.profiles?.full_name}</h3>
                                            <div className="text-warning small fw-bold drop-shadow">{selectedFeed.profiles?.specialty} — {selectedFeed.profiles?.location}</div>
                                        </div>
                                    </div>
                                    <p className="fs-5 text-white-70 opacity-90" style={{ maxWidth: "500px", lineHeight: "1.6" }}>{selectedFeed.caption}</p>
                                    
                                    <div className="d-flex align-items-center gap-4 mt-3">
                                        <button className="btn btn-warning rounded-pill px-5 py-3 fw-bold shadow-lg d-flex align-items-center gap-2 hover-scale">
                                            <User size={20} /> View Artisan Profile
                                        </button>
                                        <div className="d-flex gap-4 text-white-50">
                                            <div className="d-flex align-items-center gap-2"><Eye size={20} /> {selectedFeed.views_count}</div>
                                            <div className="d-flex align-items-center gap-2 text-danger hover-scale pointer"><Heart size={20} fill="currentColor" /> {selectedFeed.likes_count}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* LIVE INDICATOR ON TOP */}
                            {selectedFeed.is_live && (
                                <div className="position-absolute top-0 start-0 p-4 pt-5">
                                    <div className="badge bg-danger rounded-pill px-4 py-2 fs-5 fw-bold shadow-lg d-flex align-items-center gap-2 pulse-animation">
                                        <span className="spinner-grow" role="status" style={{ width: '1rem', height: '1rem' }}></span> LIVE NOW
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ENGAGEMENT / COMMERCE SIDEBAR (Responsive) */}
                        <div className="col-12 col-lg-7 h-50 h-lg-100 d-flex bg-white bg-opacity-2 blur-2xl border-top border-lg-0 border-start-lg border-white-5 align-items-center justify-content-center p-4 p-lg-5 overflow-y-auto">
                            <div className="text-center max-w-lg pb-5 pb-lg-0">
                                <Maximize2 size={48} className="text-warning mb-3 opacity-50 shadow-2xl d-none d-lg-inline-block" />
                                <h1 className="display-6 display-lg-4 fw-bold mb-3 mb-lg-4">Direct Link to <span className="text-warning">Provenance.</span></h1>
                                <p className="text-white-50 lead mb-5 opacity-75" style={{ lineHeight: "1.8" }}>
                                    This artisan is currently active in their heritage hub. Every purchase directly impacts their mastery tier and sustainable community fund.
                                </p>
                                <div className="d-grid gap-3">
                                    <Link href="/explore" className="btn btn-warning rounded-pill py-3 py-lg-4 fw-bold fs-5 fs-lg-4 shadow-2xl hover-translate-y d-flex align-items-center justify-content-center gap-3">
                                        Explore This Artisan <ArrowRight size={20} />
                                    </Link>
                                    <button onClick={() => setSelectedFeed(null)} className="btn btn-outline-light border-opacity-20 rounded-pill py-3 px-5 fw-bold hover-bg-white-5 transition-all mt-4">
                                        Continue Exploring Live Feeds
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

import { ArrowRight, Sparkles as SparklesIcon } from "lucide-react"
