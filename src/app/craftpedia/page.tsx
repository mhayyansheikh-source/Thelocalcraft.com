"use client"

import React, { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs } from "firebase/firestore"
import { 
    Book, 
    Search, 
    ArrowRight, 
    Sparkles, 
    Layers, 
    MapPin, 
    History,
    Edit3,
    Clock,
    User,
    ChevronRight,
    PenTool
} from "lucide-react"
import Link from "next/link"

export default function CraftpediaIndex() {
    const [articles, setArticles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [categories, setCategories] = useState<string[]>(["All"])

    useEffect(() => {
        async function fetchArticles() {
            setLoading(true)
            const q = query(collection(db, 'craftpedia_articles'), where('status', '==', 'published'))
            const snapshot = await getDocs(q)
            
            if (!snapshot.empty) {
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]
                // manual sorting to avoid composite index requirement
                data.sort((a, b) => {
                    if (b.is_featured && !a.is_featured) return 1
                    if (a.is_featured && !b.is_featured) return -1
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                })

                setArticles(data)
                // Extract unique categories
                const cats = Array.from(new Set(data.map((a: any) => a.category)))
                setCategories(["All", ...cats])
            }
            setLoading(false)
        }
        fetchArticles()
    }, [])

    const filteredArticles = articles.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             a.category.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "All" || a.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const featuredArticle = articles.find(a => a.is_featured) || articles[0]

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="flex-grow-1 pt-5 mt-5">
                {/* Hero / Featured Manuscript Section */}
                <section className="py-5 position-relative overflow-hidden mb-5">
                    <div className="position-absolute top-0 start-0 w-100 h-100 opacity-5 blur-3xl" style={{ background: "radial-gradient(circle at top right, #ffc107, transparent)" }}></div>
                    <div className="container position-relative z-1 text-center animate-fade-in">
                        <span className="badge bg-warning text-dark rounded-pill px-3 py-2 mb-3 fw-bold ls-1 text-uppercase">The Repository</span>
                        <h1 className="display-2 fw-bold mb-3 ls-tight">The <span className="text-warning">Craftpedia.</span></h1>
                        <p className="text-white-50 lead mx-auto mb-5" style={{ maxWidth: "700px" }}>
                            A collaborative living manuscript documenting five thousand years of heritage, materials, techniques, and the master artisans who preserve them.
                        </p>

                        {/* Search Input */}
                        <div className="d-flex justify-content-center">
                            <div className="input-group p-2 rounded-pill bg-white bg-opacity-5 border border-white border-opacity-10 shadow-2xl max-w-lg w-100 mb-4" style={{ backdropFilter: "blur(20px)" }}>
                                <span className="input-group-text bg-transparent border-0 text-white-50 ps-4 pe-2">
                                    <Search size={24} />
                                </span>
                                <input 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="form-control bg-transparent border-0 text-white py-3 fs-5 shadow-none" 
                                    placeholder="Search for a craft, material, or heritage site..." 
                                />
                                <button className="btn btn-warning rounded-pill px-5 fw-bold shadow-lg">Verify Archive</button>
                            </div>
                        </div>

                        {/* Category Tags */}
                        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
                            {categories.map(cat => (
                                <button 
                                    key={cat} 
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`btn btn-sm rounded-pill px-4 py-2 fw-bold transition-all ${selectedCategory === cat ? 'btn-warning text-dark' : 'btn-outline-light border-opacity-10 text-white-50 hover-bg-white-5'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="container pb-5">
                    <div className="row g-5">
                        {/* FEATURED MANUSCRIPT CARD */}
                        {featuredArticle && !searchTerm && selectedCategory === "All" && (
                            <div className="col-12 animate-fade-in-up">
                                <Link href={`/craftpedia/${featuredArticle.slug}`} className="text-decoration-none group">
                                    <div className="p-5 rounded-5 border border-warning border-opacity-20 d-flex flex-column flex-lg-row align-items-center gap-5 position-relative overflow-hidden bg-white bg-opacity-5 hover-border-opacity-100 transition-all shadow-2xl">
                                        <div className="position-absolute h-100 w-100 top-0 start-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('/images/sepia-texture.png')", backgroundBlendMode: "overlay" }}></div>
                                        
                                        <div className="col-lg-5">
                                            <div className="rounded-4 overflow-hidden shadow-2xl position-relative group-hover-scale-105 transition-all" style={{ aspectRatio: "16/9" }}>
                                                <img 
                                                    src={featuredArticle.image_url || "/images/hero.png"} 
                                                    className="w-100 h-100 object-fit-cover opacity-75 grayscale group-hover-grayscale-0 transition-all" 
                                                    alt={featuredArticle.title} 
                                                />
                                                <div className="position-absolute top-0 start-0 m-3 badge bg-warning text-dark rounded-pill shadow-lg"><Sparkles size={12} className="me-1" /> Featured Entry</div>
                                            </div>
                                        </div>

                                        <div className="col-lg-7 text-start">
                                            <div className="d-flex align-items-center gap-2 text-warning mb-3 small fw-bold text-uppercase ls-1">
                                                <Layers size={14} /> {featuredArticle.category} — <MapPin size={14} /> {featuredArticle.heritage_site}
                                            </div>
                                            <h2 className="display-4 fw-bold text-white mb-3 group-hover-text-warning transition-colors">{featuredArticle.title}</h2>
                                            <div className="text-white-50 lead mb-4 truncate-3 opacity-75">
                                                {featuredArticle.content.substring(0, 300)}...
                                            </div>
                                            <div className="d-flex align-items-center gap-4 text-white-50 small mb-5">
                                                <span className="d-flex align-items-center gap-2"><Clock size={14} /> Documentation: {new Date(featuredArticle.created_at).toLocaleDateString()}</span>
                                                <span className="d-flex align-items-center gap-2"><PenTool size={14} /> {featuredArticle.author_name || "Verified Heritage Scribe"}</span>
                                            </div>
                                            <div className="btn btn-warning rounded-pill px-5 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow-lg group-hover-translate-x transition-all">
                                                Read Full Manuscript <ArrowRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* Article Grid */}
                        <div className="col-12 mt-5">
                            <h4 className="fw-bold mb-5 d-flex align-items-center gap-3">
                                <Book className="text-warning" /> Archive Collections
                                <div className="flex-grow-1 border-bottom border-white border-opacity-10 opacity-25"></div>
                            </h4>
                            
                            <div className="row g-4">
                                {loading ? (
                                    [...Array(6)].map((_, i) => (
                                        <div key={i} className="col-md-4 col-lg-4 animate-pulse">
                                            <div className="rounded-5 bg-white bg-opacity-5 border border-white border-opacity-10" style={{ height: "400px" }} />
                                        </div>
                                    ))
                                ) : filteredArticles.length > 0 ? (
                                    filteredArticles.map((a, i) => (
                                        <div key={a.id} className="col-md-4 col-lg-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                            <Link href={`/craftpedia/${a.slug}`} className="text-decoration-none group h-100 d-block">
                                                <div className="p-4 rounded-5 border border-white border-opacity-10 bg-white bg-opacity-2 hover-bg-white-5 h-100 transition-all shadow-xl d-flex flex-column">
                                                    <div className="rounded-4 overflow-hidden mb-4 position-relative" style={{ height: "220px" }}>
                                                        <img src={a.image_url || "/images/hero.png"} alt={a.title} className="w-100 h-100 object-fit-cover opacity-50 grayscale group-hover-grayscale-0 group-hover-scale-105 transition-all" />
                                                        <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-to-t from-dark to-transparent">
                                                            <div className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-25 rounded-pill px-3 py-2 small">{a.category}</div>
                                                        </div>
                                                    </div>
                                                    <h3 className="h4 fw-bold text-white mb-2 group-hover-text-warning transition-colors">{a.title}</h3>
                                                    <p className="text-white-50 small mb-4 flex-grow-1 opacity-75 truncate-3">{a.content.substring(0, 150)}...</p>
                                                    <div className="mt-auto d-flex justify-content-between align-items-center pt-4 border-top border-white border-opacity-5">
                                                        <div className="small text-white-50 d-flex align-items-center gap-2"><MapPin size={14} /> {a.heritage_site}</div>
                                                        <div className="text-warning group-hover-translate-x transition-all"><ChevronRight /></div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 text-center py-5">
                                        <div className="opacity-25 mb-4"><History size={64} /></div>
                                        <h3 className="fw-bold">No Records Found</h3>
                                        <p className="text-white-50 lead">The library of tradition is vast. Refine your search query.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Collaborative Call to Action */}
                <section className="py-5 mt-5">
                    <div className="container">
                        <div className="p-5 rounded-5 bg-warning text-dark overflow-hidden position-relative shadow-2xl">
                            <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10 blur-3xl" style={{ background: "radial-gradient(circle at top right, #fff, transparent)" }}></div>
                            <div className="row g-5 align-items-center position-relative z-1">
                                <div className="col-lg-8">
                                    <h2 className="display-5 fw-bold mb-3 ls-tight">Are you a keeper of <span className="text-decoration-underline">this legacy?</span></h2>
                                    <p className="lead fw-bold opacity-75 mb-0">Verified Master Artisans and Heritage Experts can contribute directly to this collaborative manuscript.</p>
                                </div>
                                <div className="col-lg-4 text-lg-end">
                                    <Link href="/dashboard/artisan" className="btn btn-dark rounded-pill px-5 py-3 fw-bold fs-5 shadow-lg d-inline-flex align-items-center gap-3 hover-scale transition-all">
                                        Contribute Knowledge <Edit3 size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
