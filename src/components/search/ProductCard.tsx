"use client"

import React from "react"
import Link from "next/link"
import { Tag, Sparkles, ShoppingBag, Plus } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useCurrency } from "@/context/CurrencyContext"

interface Product {
    id: string
    title: string
    description?: string
    price?: number
    category?: string
    similarity?: number
    image_url?: string
    wholesale_price?: number
    min_wholesale_qty?: number
}

import { useEffect, useState } from "react"
import { db, auth } from "@/lib/firebase/config"
import { doc, getDoc } from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

export const ProductCard = ({ product }: { product: Product }) => {
    const { addToCart } = useCart()
    const { formatPrice } = useCurrency()
    const [isWholesale, setIsWholesale] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const pSnap = await getDoc(doc(db, "profiles", user.uid))
                if (pSnap.exists()) {
                    const profile = pSnap.data()
                    if (profile?.role === 'wholesale' || profile?.role === 'admin') {
                        setIsWholesale(true)
                    }
                }
            }
        })
        return () => unsubscribe()
    }, [])

    return (
        <div className="product-card h-100 p-3 rounded-4"
            style={{
                background: "rgba(255, 255, 255, 0.03)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "transform 0.3s ease, background 0.3s ease"
            }}>
            <div className="position-relative mb-3 rounded-3 overflow-hidden bg-dark" style={{ aspectRatio: "1/1" }}>
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-100 h-100 object-fit-cover opacity-90 transition-transform hover-scale scale-105"
                    />
                ) : (
                    <div className="h-100 d-flex align-items-center justify-content-center text-white-50 small opacity-25">
                        <ShoppingBag size={48} />
                    </div>
                )}
                {product.similarity && (
                    <div className="position-absolute top-0 end-0 m-2 badge rounded-pill bg-warning text-dark d-flex align-items-center gap-1 shadow-sm">
                        <Sparkles size={10} />
                        {(product.similarity * 100).toFixed(0)}% Match
                    </div>
                )}
                {isWholesale && (
                    <div className="position-absolute top-0 start-0 m-2 badge rounded-pill bg-info text-white d-flex align-items-center gap-1 shadow-sm border border-white border-opacity-20" style={{ backdropFilter: "blur(10px)" }}>
                        <Tag size={10} /> Wholesale Active
                    </div>
                )}
            </div>

            <div className="text-start">
                <div className="d-flex align-items-center gap-1 mb-1 text-info small text-uppercase fw-bold" style={{ letterSpacing: "1px" }}>
                    <Tag size={12} /> {product.category || 'Handicraft'}
                </div>
                <h5 className="text-white mb-2 fs-6 fw-bold">{product.title}</h5>
                <p className="text-white-50 small mb-3 text-truncate-2" style={{ fontSize: "0.85rem", height: "2.5rem", overflow: "hidden" }}>
                    {product.description}
                </p>

                {isWholesale && (
                    <div className="p-2 mb-3 rounded-3 bg-white bg-opacity-5 border border-white border-opacity-10 d-flex justify-content-between align-items-center">
                        <div className="small text-white-50">Est. Commission</div>
                        <div className="small fw-bold text-warning">+{formatPrice(Number(product.price) * 0.1)}</div>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mt-auto">
                    <div>
                    <div>
                        <div className="text-warning fw-bold fs-5 lh-1">{formatPrice(product.price || 0)}</div>
                    </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <Link href={`/products/${product.id}`} className="btn btn-outline-light rounded-pill px-3 d-flex align-items-center justify-content-center text-decoration-none transition-colors hover-bg-light hover-text-dark" style={{ fontSize: "0.8rem", minHeight: "44px", border: "1px solid rgba(255,255,255,0.2)" }}>
                            Details
                        </Link>
                        <button
                            className="btn btn-warning rounded-circle d-flex align-items-center justify-content-center p-0 hover-scale transition-transform border-0 shadow-sm"
                            style={{ width: "44px", height: "44px" }}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                addToCart(product)
                            }}
                            title="Add to Cart"
                        >
                            <Plus size={20} strokeWidth={3} className="text-dark" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
