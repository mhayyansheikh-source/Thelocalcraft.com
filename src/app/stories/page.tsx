"use client"

import React, { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

import { db } from "@/lib/firebase/config"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import { PlayCircle, Film, BookOpen, Quote } from "lucide-react"

export default function StoriesPage() {
    const [stories, setStories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeArtisanId, setActiveArtisanId] = useState<string | null>(null)

    useEffect(() => {
        async function fetchStories() {
            setLoading(true)
            try {
                const storiesSnap = await getDocs(collection(db, "artisan_stories"))
                const data: any[] = []
                for (const docSnap of storiesSnap.docs) {
                    const sData = docSnap.data()
                    if (sData.artisan_id) {
                        const profSnap = await getDoc(doc(db, "profiles", sData.artisan_id))
                        if (profSnap.exists()) {
                            sData.artisans = profSnap.data()
                        }
                    }
                    data.push({ id: docSnap.id, ...sData })
                }
                setStories(data)
                if (data.length > 0) setActiveArtisanId(data[0].artisan_id)

            } catch (err: any) {
                console.error("Failed to load stories", err)
            }
            setLoading(false)
        }
        fetchStories()
    }, [])

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="container flex-grow-1 pt-5 mt-5">
                <header className="py-5 text-center">
                    <h1 className="display-4 fw-bold mb-3">Documentary <span className="text-warning">Library</span></h1>
                    <p className="text-white-50 mx-auto" style={{ maxWidth: "600px" }}>
                        Hear the voice of heritage. Our AI-powered storytellers translate the raw emotions of the artisan into national narratives.
                    </p>
                </header>

                <div className="row g-5 mb-5 mt-2">
                    {/* LEFT: LIST OF STORIES */}
                    <div className="col-lg-4">
                        <div className="d-flex flex-column gap-3">
                            <h5 className="text-uppercase fw-bold text-white-50 small mb-3 letter-spacing-1">Recent Journeys</h5>
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <div key={i} className="rounded-4 bg-white bg-opacity-5 animate-pulse" style={{ height: "100px" }} />
                                ))
                            ) : stories.length > 0 ? (
                                stories.map((s) => (
                                    <button
                                        key={s.artisan_id}
                                        onClick={() => setActiveArtisanId(s.artisan_id)}
                                        className={`text-start p-3 rounded-4 border transition-all ${activeArtisanId === s.artisan_id
                                            ? "bg-warning bg-opacity-10 border-warning"
                                            : "bg-white bg-opacity-5 border-white border-opacity-10 hover-bg-white-10"
                                            }`}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="rounded-3 overflow-hidden bg-dark" style={{ width: "60px", height: "60px" }}>
                                                <img
                                                    src={s.cover_image || "https://images.unsplash.com/photo-1541533848490-bc8115cd6522?auto=format&fit=crop&q=80"}
                                                    className="w-100 h-100 object-fit-cover opacity-75"
                                                    alt="Cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="fw-bold mb-0 text-white">{s.artisans?.full_name || "Artisan Master"}</div>
                                                <div className="small text-white-50">{s.artisans?.specialty || "Heritage Craft"}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <p className="text-white-50">No stories available yet.</p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: STORY VIEWER */}
                    <div className="col-lg-8">
                        {activeArtisanId ? (
                            <div className="position-relative">
                                {/* Decorative elements */}
                                <div className="position-absolute -top-10 -right-10 opacity-10">
                                    <Quote size={120} />
                                </div>
                                <div className="text-white-50 text-center py-5">
                                    <p>Story viewer is currently under construction.</p>
                                    <p>Artisan ID: {activeArtisanId}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-100 d-flex flex-column align-items-center justify-content-center p-5 rounded-5 border border-white border-opacity-10 bg-white bg-opacity-5 text-center">
                                <Film size={48} className="text-warning opacity-25 mb-4" />
                                <h3>Select a Story</h3>
                                <p className="text-white-50">Pick a craft journey from the sidebar to begin.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
