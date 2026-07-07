"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { db } from "@/lib/firebase/config"
import { collection, query, orderBy, getDocs } from "firebase/firestore"
import { Landmark, Sparkles, Map, ArrowRight } from "lucide-react"

export default function HeritagePage() {
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchCategories() {
            setLoading(true)
            try {
                const q = query(collection(db, "categories"), orderBy("name"))
                const querySnapshot = await getDocs(q)
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                setCategories(data)
            } catch (error: any) {
                console.error("Error fetching categories", error)
            }
            setLoading(false)
        }
        fetchCategories()
    }, [])

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="container flex-grow-1 pt-5 mt-5">
                <header className="py-5 text-center">
                    <h1 className="display-4 fw-bold mb-3">Living <span className="text-warning">Heritage</span></h1>
                    <p className="text-white-50 mx-auto" style={{ maxWidth: "600px" }}>
                        South Asia's craft traditions are anchored in historic landscapes. Explore the roots of our collection.
                    </p>
                </header>

                <div className="row g-4 mb-5">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="col-md-6 animate-pulse">
                                <div className="rounded-5 bg-white bg-opacity-5" style={{ height: "450px" }} />
                            </div>
                        ))
                    ) : categories.length > 0 ? (
                        categories.map((cat) => (
                            <div key={cat.id} className="col-md-6">
                                <div className="position-relative overflow-hidden rounded-5 border border-white border-opacity-10 transition-all hover-translate-y h-100">
                                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-dark-overlay z-1" />

                                    <img
                                        src={cat.image_url || "/images/hero.png"}
                                        onError={(e) => { e.currentTarget.src = "/images/hero.png" }}
                                        alt={cat.name}
                                        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover opacity-50 z-0"
                                    />

                                    <div className="position-relative z-2 p-5 d-flex flex-column h-100 justify-content-end">
                                        <div className="d-flex align-items-center gap-2 text-warning mb-3">
                                            <Landmark size={20} />
                                            <span className="small text-uppercase fw-bold ls-2">{cat.heritage_site || "Historic Hub"}</span>
                                        </div>

                                        <h2 className="display-5 fw-bold mb-3">{cat.name}</h2>
                                        <p className="text-white-50 mb-4" style={{ maxWidth: "450px" }}>
                                            {cat.description || "Discover the intricate details and historical significance of this heritage craft tradition."}
                                        </p>

                                        <div className="d-flex gap-3">
                                            <Link href={`/categories/${cat.id}`} className="btn btn-warning rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 text-decoration-none">
                                                Explore Craft <ArrowRight size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <Map size={64} className="text-warning opacity-25 mb-4" />
                            <h3>Heritage Index Underway</h3>
                            <p className="text-white-50">We are documenting centuries of craft history. Stay tuned.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
