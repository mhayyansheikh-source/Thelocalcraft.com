"use client"

import React, { useEffect, useState } from "react"
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs } from "firebase/firestore"
import { Play, Pause, Volume2, BookOpen, Quote } from "lucide-react"

interface ArtisanStory {
    translated_story: string
    audio_url: string
}

export function ArtisanStoryViewer({ artisanId }: { artisanId: string }) {
    const [story, setStory] = useState<ArtisanStory | null>(null)
    const [loading, setLoading] = useState(true)
    const [isPlaying, setIsPlaying] = useState(false)
    const [audio] = useState<HTMLAudioElement | null>(
        typeof Audio !== "undefined" ? new Audio() : null
    )

    useEffect(() => {
        async function fetchStory() {
            const q = query(collection(db, "artisan_stories"), where("artisan_id", "==", artisanId))
            const snap = await getDocs(q)
            if (!snap.empty) {
                setStory(snap.docs[0].data() as ArtisanStory)
            }
            setLoading(false)
        }

        fetchStory()
    }, [artisanId])

    useEffect(() => {
        if (audio && story?.audio_url) {
            audio.src = story.audio_url
            audio.onended = () => setIsPlaying(false)
        }
    }, [audio, story])

    const togglePlay = () => {
        if (!audio) return
        if (isPlaying) {
            audio.pause()
        } else {
            audio.play()
        }
        setIsPlaying(!isPlaying)
    }

    if (loading) return (
        <div className="p-4 border rounded-4 animate-pulse bg-white-10">
            <div className="h-4 bg-white-20 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-white-20 rounded w-1/2"></div>
        </div>
    )

    if (!story) return null

    return (
        <div className="artisan-story-container p-5 rounded-4 shadow-lg text-start mb-4"
            style={{
                background: "rgba(255, 255, 255, 0.04)",
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                color: "#eee"
            }}>

            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-2 text-warning">
                    <BookOpen size={20} />
                    <span className="text-uppercase fw-bold small" style={{ letterSpacing: "2px" }}>The Artisan's Journey</span>
                </div>

                {story.audio_url && (
                    <button
                        onClick={togglePlay}
                        className="btn btn-warning rounded-circle p-3 d-flex align-items-center justify-content-center shadow"
                        style={{ width: "50px", height: "50px", transition: "transform 0.2s" }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ms-1" fill="currentColor" />}
                    </button>
                )}
            </div>

            <div className="position-relative">
                <Quote className="position-absolute opacity-10" size={80} style={{ top: "-20px", left: "-10px" }} />
                <p className="lead fw-normal mb-0 ps-4 pt-2" style={{ lineHeight: "1.8", fontStyle: "italic", opacity: 0.9 }}>
                    {story.translated_story}
                </p>
            </div>

            <div className="mt-4 pt-3 border-top border-white-10 d-flex align-items-center gap-2 text-white-50 small">
                <Volume2 size={16} />
                <span>AI-Generated Narration by cultural heritage specialist (Llama 3 + Piper)</span>
            </div>
        </div>
    )
}
