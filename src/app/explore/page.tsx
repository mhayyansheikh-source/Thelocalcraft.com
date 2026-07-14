"use client"

import React, { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ProductCard } from "@/components/search/ProductCard"
import { db } from "@/lib/firebase/config"
import { collection, query, getDocs } from "firebase/firestore"
import { Search as SearchIcon } from "lucide-react"

export default function ExploreContent() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchInput, setSearchInput] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true)
            const q = collection(db, 'products')
            const snapshot = await getDocs(q)
            if (!snapshot.empty) {
                setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })))
            }
            setLoading(false)
        }
        fetchProducts()
    }, [])

    const availableCategories = Array.from(new Set(products.map((p: any) => p.category).filter(Boolean)))

    const filteredProducts = products.filter((p: any) => {
        const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
        const matchesSearch = p.title?.toLowerCase().includes(searchInput.toLowerCase()) || 
                              p.description?.toLowerCase().includes(searchInput.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="container flex-grow-1 pt-5 mt-5">
                <header className="py-5 text-center">
                    <h1 className="fw-bold mb-3" style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)" }}>Shop <span className="text-warning">Crafts</span></h1>
                    <p className="text-white-50 mx-auto px-3" style={{ maxWidth: "600px", fontSize: "1.1rem" }}>
                        Browse authentic handmade products.
                    </p>
                </header>

                {/* SIMPLE SEARCH */}
                <div className="row mb-4 justify-content-center">
                    <div className="col-lg-6">
                        <div className="input-group p-1 rounded-pill bg-white bg-opacity-5 border border-white border-opacity-10 shadow-lg">
                            <span className="input-group-text bg-transparent border-0 text-white-50 ps-4">
                                <SearchIcon size={20} />
                            </span>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="form-control bg-transparent border-0 text-white py-3 outline-none shadow-none"
                                placeholder="Search products..."
                            />
                        </div>
                    </div>
                </div>

                {/* SIMPLE CATEGORIES */}
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
                    <button 
                        className={`btn rounded-pill px-4 ${selectedCategory === 'all' ? 'btn-warning text-dark fw-bold' : 'btn-outline-light'}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        All
                    </button>
                    {availableCategories.map(cat => (
                        <button 
                            key={cat}
                            className={`btn rounded-pill px-4 ${selectedCategory === cat ? 'btn-warning text-dark fw-bold' : 'btn-outline-light'}`}
                            onClick={() => setSelectedCategory(cat as string)}
                        >
                            {cat as React.ReactNode}
                        </button>
                    ))}
                </div>

                {/* PRODUCT GRID */}
                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-warning" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4 mb-5">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <div key={product.id} className="col-sm-6 col-lg-4 col-xl-3">
                                    <ProductCard product={product} />
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <h4 className="text-white-50">No products found.</h4>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}
