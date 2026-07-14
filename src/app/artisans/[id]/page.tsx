"use client"

import React, { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { db } from "@/lib/firebase/config"
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"
import { MapPin, Star, Hammer, Award, Briefcase, ChevronRight } from "lucide-react"
import Link from "next/link"
import { ProductCard } from "@/components/search/ProductCard"

export default function ArtisanProfilePage({ params }: { params: { id: string } }) {
    const [artisan, setArtisan] = useState<any>(null)
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch artisan profile
                const docRef = doc(db, 'profiles', params.id)
                const docSnap = await getDoc(docRef)
                
                if (docSnap.exists()) {
                    setArtisan({ id: docSnap.id, ...docSnap.data() })
                } else {
                    // Fallback to artisans collection if profile doesn't exist
                    const artRef = doc(db, 'artisans', params.id)
                    const artSnap = await getDoc(artRef)
                    if (artSnap.exists()) {
                        setArtisan({ id: artSnap.id, ...artSnap.data() })
                    }
                }

                // Fetch artisan's products
                const q = query(collection(db, 'products'), where('artisan_id', '==', params.id))
                const prodSnap = await getDocs(q)
                const prodData = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }))
                setProducts(prodData)

            } catch (error) {
                console.error("Error fetching artisan:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [params.id])

    if (loading) {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex flex-column">
                <Navbar />
                <main className="container flex-grow-1 pt-5 mt-5 text-center">
                    <div className="spinner-border text-warning" role="status"></div>
                </main>
            </div>
        )
    }

    if (!artisan) {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex flex-column">
                <Navbar />
                <main className="container flex-grow-1 pt-5 mt-5 text-center">
                    <h2 className="display-6">Artisan not found</h2>
                    <Link href="/artisans" className="btn btn-outline-light mt-3">Back to Masters</Link>
                </main>
            </div>
        )
    }

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="container flex-grow-1 pt-5 mt-5 mb-5">
                {/* Hero Section */}
                <div className="row g-5 align-items-center mb-5 border-bottom border-white-10 pb-5">
                    <div className="col-md-4 text-center text-md-start">
                        <div className="rounded-circle overflow-hidden shadow-lg border border-warning border-opacity-25 mx-auto mx-md-0 mb-4" style={{ width: "200px", height: "200px" }}>
                            <img
                                src={artisan.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(artisan.full_name || "")}&background=random&color=fff&size=200`}
                                alt={artisan.full_name}
                                className="w-100 h-100 object-fit-cover"
                            />
                        </div>
                    </div>
                    <div className="col-md-8">
                        <h1 className="display-4 fw-bold mb-2 d-flex align-items-center flex-wrap gap-3">
                            {artisan.full_name}
                            {artisan.mastery_tier && (
                                <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 px-3 py-2 rounded-pill h6 mb-0 d-flex align-items-center gap-1">
                                    <Award size={16} /> {artisan.mastery_tier}
                                </span>
                            )}
                        </h1>
                        <h4 className="text-white-50 mb-4">{artisan.specialty}</h4>
                        
                        <div className="d-flex flex-wrap gap-4 mb-4 text-white-50">
                            <span className="d-flex align-items-center gap-2"><MapPin className="text-warning" size={18} /> {artisan.location || "Pakistan"}</span>
                            {artisan.years_experience && <span className="d-flex align-items-center gap-2"><Star className="text-warning" size={18} /> {artisan.years_experience} Years Exp.</span>}
                            <span className="d-flex align-items-center gap-2"><Hammer className="text-warning" size={18} /> {products.length} Products</span>
                        </div>

                        {artisan.onboarding_evidence?.maker_story && (
                            <div className="p-4 rounded-4 bg-white bg-opacity-5 border border-white-10 mb-4">
                                <p className="fst-italic lh-lg mb-0 text-white-70">"{artisan.onboarding_evidence.maker_story}"</p>
                            </div>
                        )}

                        <p className="lead text-white-70 lh-lg mb-0">
                            {artisan.bio || artisan.onboarding_evidence?.production_philosophy || "Dedicated to preserving heritage crafts."}
                        </p>
                    </div>
                </div>

                {/* Products Grid */}
                <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
                    <Briefcase className="text-warning" size={24} /> 
                    Artisan's Portfolio
                </h2>
                
                {products.length > 0 ? (
                    <div className="row g-4">
                        {products.map(product => (
                            <div key={product.id} className="col-12 col-md-6 col-xl-4">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-5 text-center bg-white bg-opacity-5 rounded-4 border border-white-10">
                        <p className="text-white-50 mb-0">No pieces currently available from this master.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
