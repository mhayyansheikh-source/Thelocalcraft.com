"use client"

import React, { useEffect, useState, Suspense } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ProductCard } from "@/components/search/ProductCard"
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs } from "firebase/firestore"
import { Filter, Search as SearchIcon, SlidersHorizontal } from "lucide-react"
import { useSearchParams } from "next/navigation"

function ExploreContent() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showFilters, setShowFilters] = useState(false)
    const [sortBy, setSortBy] = useState("newest")
    const [priceLimit, setPriceLimit] = useState<number>(1000)
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    const searchParams = useSearchParams()
    const artisanFilter = searchParams.get('artisan')

    // Separate local input state from the actual semantic execution query
    const [searchInput, setSearchInput] = useState(searchParams.get("q") || "")
    const [semanticQuery, setSemanticQuery] = useState(searchParams.get("q") || "")
    const [isSearchingSemantic, setIsSearchingSemantic] = useState(false)

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true)
            setIsSearchingSemantic(!!semanticQuery)

            let dataToSet: any[] = []

            if (semanticQuery) {
                // Downgrade semantic search to client-side text filtering
                let q: any = collection(db, 'products')
                const snapshot = await getDocs(q)
                if (!snapshot.empty) {
                    let data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })) as any[]
                    if (artisanFilter) {
                        data = data.filter((d: any) => d.artisan_id === artisanFilter)
                    }
                    dataToSet = data.filter((d: any) => 
                        (d.title && d.title.toLowerCase().includes(semanticQuery.toLowerCase())) || 
                        (d.description && d.description.toLowerCase().includes(semanticQuery.toLowerCase())) ||
                        (d.category && d.category.toLowerCase().includes(semanticQuery.toLowerCase()))
                    )
                }
            } else {
                // Standard Fetch
                let q: any = collection(db, 'products')
                if (artisanFilter) {
                    q = query(q, where('artisan_id', '==', artisanFilter))
                }

                const snapshot = await getDocs(q)
                if (!snapshot.empty) {
                    dataToSet = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }))
                }
            }

            setProducts(dataToSet)
            setLoading(false)
            setIsSearchingSemantic(false)
        }
        fetchProducts()
    }, [semanticQuery, artisanFilter])

    // Sync state with URL parameter if it changes globally
    useEffect(() => {
        const query = searchParams.get('q')
        if (query !== null) {
            setSearchInput(query)
            setSemanticQuery(query)
        }
    }, [searchParams])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSemanticQuery(searchInput.trim())
    }

    const availableCategories = Array.from(new Set(products.map((p: any) => p.category).filter(Boolean)))

    let filteredProducts = products.filter((p: any) => {
        const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
        const matchesPrice = p.price <= priceLimit
        return matchesCategory && matchesPrice
    })

    if (sortBy === "price_asc") {
        filteredProducts.sort((a: any, b: any) => a.price - b.price)
    } else if (sortBy === "price_desc") {
        filteredProducts.sort((a: any, b: any) => b.price - a.price)
    } else if (!semanticQuery) {
        // Only sort by newest if we aren't doing a semantic search. 
        // Semantic search pre-sorts by geometric relevance.
        filteredProducts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="container flex-grow-1 pt-5 mt-5">
                <header className="py-5 text-center">
                    <h1 className="fw-bold mb-3" style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)" }}>Explore <span className="text-warning">Collection</span></h1>
                    <p className="text-white-50 mx-auto px-3" style={{ maxWidth: "600px", fontSize: "clamp(1rem, 3vw, 1.1rem)" }}>
                        Every piece is a handcrafted testament to centuries of tradition. Use the AI signature to verify authenticity.
                    </p>
                </header>

                {/* SEARCH & FILTER BAR */}
                <div className="row mb-5 g-3 justify-content-center">
                    <div className="col-lg-6">
                        <form onSubmit={handleSearchSubmit}>
                            <div className="input-group p-1 rounded-pill bg-white bg-opacity-5 border border-white border-opacity-10 shadow-lg position-relative">
                                <span className="input-group-text bg-transparent border-0 text-white-50 ps-4">
                                    <SearchIcon size={20} />
                                </span>
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="form-control bg-transparent border-0 text-white py-3 outline-none shadow-none pe-5"
                                    placeholder="Semantic Search (e.g. 'Blue pottery with floral motifs')"
                                    style={{ paddingRight: "60px" }}
                                />
                                <button type="submit" disabled={isSearchingSemantic} className="btn position-absolute end-0 top-50 translate-middle-y me-2 rounded-circle btn-warning p-0 d-flex align-items-center justify-content-center" style={{ width: "44px", height: "44px", zIndex: 10 }}>
                                    <SearchIcon size={20} />
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="col-lg-auto">
                        <button
                            className={`btn rounded-pill px-4 py-3 d-flex align-items-center gap-2 ${showFilters ? 'btn-warning text-dark' : 'btn-outline-warning'}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <SlidersHorizontal size={18} /> Filters
                        </button>
                    </div>
                </div>

                {/* FILTERS PANEL */}
                {showFilters && (
                    <div className="row justify-content-center mb-5 animate-fade-in-up">
                        <div className="col-lg-10">
                            <div className="p-4 rounded-5 border border-white border-opacity-10 shadow-lg" style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(10px)" }}>
                                <div className="row g-4">
                                    <div className="col-md-4">
                                        <label className="form-label text-white-50 small text-uppercase ls-1">Sort By</label>
                                        <select
                                            className="form-select bg-transparent text-white border-white border-opacity-25 rounded-3"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option value="newest" className="text-dark">Newest Arrivals</option>
                                            <option value="price_asc" className="text-dark">Price: Low to High</option>
                                            <option value="price_desc" className="text-dark">Price: High to Low</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label text-white-50 small text-uppercase ls-1">Category</label>
                                        <select
                                            className="form-select bg-transparent text-white border-white border-opacity-25 rounded-3"
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                        >
                                            <option value="all" className="text-dark">All Heritage Crafts</option>
                                            {availableCategories.map(cat => (
                                                <option key={cat} value={cat} className="text-dark">{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label text-white-50 small text-uppercase ls-1 d-flex justify-content-between">
                                            <span>Max Price</span>
                                            <span className="text-warning fw-bold">${priceLimit}</span>
                                        </label>
                                        <input
                                            type="range"
                                            className="form-range"
                                            min="0"
                                            max="1000"
                                            step="10"
                                            value={priceLimit}
                                            onChange={(e) => setPriceLimit(Number(e.target.value))}
                                        />
                                        <div className="d-flex justify-content-between text-white-50" style={{ fontSize: "0.7rem" }}>
                                            <span>$0</span>
                                            <span>$1000+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PRODUCT GRID */}
                <div className="row g-4 mb-5">
                    {loading ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} className="col-md-6 col-lg-3 animate-pulse">
                                <div className="rounded-4 bg-white bg-opacity-5" style={{ height: "400px" }} />
                            </div>
                        ))
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map((p) => (
                            <div key={p.id} className="col-md-6 col-lg-3">
                                <ProductCard
                                    product={{
                                        ...p,
                                        similarity: 1.0
                                    }}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <div className="mb-4 text-warning opacity-25">
                                <Filter size={64} />
                            </div>
                            <h3>No products found</h3>
                            <p className="text-white-50">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default function ExplorePage() {
    return (
        <Suspense fallback={
            <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        }>
            <ExploreContent />
        </Suspense>
    )
}
