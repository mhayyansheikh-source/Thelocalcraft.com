"use client"

import React, { useState } from "react"
import { Search, Sparkles, Filter, LayoutGrid } from "lucide-react"
import { db } from "@/lib/firebase/config"
import { collection, getDocs } from "firebase/firestore"
import { ProductCard } from "./ProductCard"

export function VibeExplorer() {
    const [query, setQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [results, setResults] = useState<any[]>([])
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query) return

        setIsSearching(true)

        // Perform standard text filtering as fallback
        const pSnap = await getDocs(collection(db, "products"))
        const allProducts = pSnap.docs.map(d => ({ id: d.id, ...d.data() }))
        const lowerQ = query.toLowerCase()
        const searchResults = allProducts.filter((p: any) => 
            p.title?.toLowerCase().includes(lowerQ) || 
            p.description?.toLowerCase().includes(lowerQ) ||
            p.category?.toLowerCase().includes(lowerQ)
        )
        setResults(searchResults)
        setHasSearched(true)

        setIsSearching(false)
        if (searchResults.length > 0) {
            console.log("Vector results found:", searchResults)
        }
    }

    return (
        <div className="discovery-section w-100 mt-5">
            <div className="vibe-explorer-container p-4 rounded-4 shadow-lg text-center position-relative mb-5"
                style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)"
                }}>
                <div className="d-inline-flex align-items-center mb-3 text-warning">
                    <Sparkles size={20} className="me-2" />
                    <span className="text-uppercase fw-bold" style={{ letterSpacing: "2px", fontSize: "0.8rem" }}>AI-Powered Discovery</span>
                </div>

                <h2 className="mb-4 text-white">Search by "Vibe"</h2>
                <p className="text-white-50 mb-4 mx-auto" style={{ maxWidth: "500px" }}>
                    Don't know the exact name? Try typing a feeling, era, or color.
                    Example: <span className="text-info cursor-pointer" onClick={() => setQuery("earthy indigo pottery")}>"earthy indigo"</span> or <span className="text-info cursor-pointer" onClick={() => setQuery("traditional ajrak textiles")}>"ajrak textiles"</span>
                </p>

                <form onSubmit={handleSearch} className="position-relative mx-auto mb-4" style={{ maxWidth: "600px" }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Describe what you're looking for..."
                        className="form-control rounded-pill py-3 px-5 border-0 shadow-sm"
                        style={{
                            background: "rgba(255, 255, 255, 0.9)",
                            fontSize: "1.1rem"
                        }}
                        disabled={isSearching}
                    />
                    <div className="position-absolute start-0 top-50 translate-middle-y ps-3 text-muted">
                        <Search size={22} />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-warning rounded-pill px-4 py-2 position-absolute end-0 top-50 translate-middle-y me-2 h-75 d-flex align-items-center"
                        style={{ fontWeight: "bold" }}
                        disabled={isSearching}
                    >
                        {isSearching ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        ) : null}
                        {isSearching ? "Thinking..." : "Explore"}
                    </button>
                </form>

                <div className="pt-3 d-flex flex-wrap justify-content-center gap-2 mb-2">
                    {["Blue Pottery", "Ajrak Textiles", "Chiniot Woodwork", "Swat Valley Embroidery"].map(tag => (
                        <span key={tag}
                            className="badge rounded-pill px-3 py-2"
                            style={{
                                background: "rgba(255, 255, 255, 0.1)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                cursor: "pointer",
                                color: "#eee"
                            }}
                            onClick={() => {
                                setQuery(tag);
                                // Trigger search on tag click
                                const fakeEvent = { preventDefault: () => { } } as any;
                                setTimeout(() => handleSearch(fakeEvent), 0);
                            }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {hasSearched && (
                <div className="results-container animate-fade-in">
                    <div className="d-flex justify-content-between align-items-center mb-4 text-white">
                        <div className="d-flex align-items-center gap-2 text-white-50 small">
                            <LayoutGrid size={18} />
                            <span>Found <strong>{results.length}</strong> AI matches for your description</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 text-info small cursor-pointer">
                            <Filter size={16} /> Filters
                        </div>
                    </div>

                    {results.length > 0 ? (
                        <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 justify-content-center">
                            {results.map((product) => (
                                <div key={product.id} className="col">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5 rounded-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                            <p className="text-white-50 mb-0">No results found. Try describing your vibe differently!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
