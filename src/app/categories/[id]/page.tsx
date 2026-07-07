import React from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ProductCard } from "@/components/search/ProductCard"
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, doc, getDoc, orderBy } from "firebase/firestore"
import { Landmark, ArrowLeft, Filter } from "lucide-react"
import Link from "next/link"

export async function generateStaticParams() {
    try {
        const snap = await getDocs(collection(db, "categories"))
        const categories = snap.docs.map(d => ({ id: d.id }))
        return categories.length ? categories : [{ id: 'placeholder' }]
    } catch(e) {
        return [{ id: 'placeholder' }]
    }
}

export default async function CategoryPage({ params }: { params: { id: string } }) {
    const { id } = params

    // Fetch category details
    const cSnap = await getDoc(doc(db, "categories", id))
    const category = cSnap.exists() ? { id: cSnap.id, ...cSnap.data() } as any : null

    let products: any[] = []

    if (category) {
        // Fetch products that match the category name without orderBy to avoid needing a composite index
        const pQ = query(collection(db, "products"), where("category", "==", category.name))
        const pSnap = await getDocs(pQ)
        const prodData = pSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => {
            const dateA = new Date(a.created_at || 0).getTime()
            const dateB = new Date(b.created_at || 0).getTime()
            return dateB - dateA
        })

        if (prodData) {
            products = prodData
        }
    }

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="flex-grow-1">
                {/* HERO SECTION */}
                <section className="position-relative overflow-hidden" style={{ minHeight: "50vh", marginTop: "76px" }}>
                    {category ? (
                        <>
                            <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-dark-overlay z-1" />
                            <img
                                src={category.image_url || "/images/hero.png"}
                                alt={category.name}
                                className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover opacity-50 z-0"
                            />

                            <div className="container position-relative z-2 h-100 d-flex flex-column justify-content-end pb-5" style={{ minHeight: "50vh" }}>
                                <Link href="/heritage" className="text-white-50 text-decoration-none mb-4 d-inline-flex align-items-center gap-2 hover-white transition-all">
                                    <ArrowLeft size={16} /> Back to Heritage Index
                                </Link>

                                <div className="d-flex align-items-center gap-2 text-warning mb-3">
                                    <Landmark size={24} />
                                    <span className="text-uppercase fw-bold ls-2">{category.heritage_site || "Historic Hub"}</span>
                                </div>
                                <h1 className="display-3 fw-bold mb-4">{category.name}</h1>
                                <p className="lead text-white-50" style={{ maxWidth: "700px" }}>
                                    {category.description || "Explore this ancient craft tradition preserved meticulously by our masters."}
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="container position-relative z-2 h-100 d-flex flex-column justify-content-center align-items-center py-5">
                            <h2>Category not found</h2>
                            <Link href="/heritage" className="btn btn-outline-warning mt-3 rounded-pill px-4">
                                Back to Heritage
                            </Link>
                        </div>
                    )}
                </section>

                {/* PRODUCT GRID */}
                <section className="container py-5">
                    <div className="d-flex justify-content-between align-items-end mb-5">
                        <h3 className="fw-bold mb-0">Crafted Pieces</h3>
                        <div className="text-white-50 small d-none d-md-block">Showing {products.length} authenticated items</div>
                    </div>

                    <div className="row g-4 mb-5">
                        {products.length > 0 ? (
                            products.map((p) => (
                                <div key={p.id} className="col-md-6 col-lg-3">
                                    <ProductCard
                                        product={{
                                            ...p,
                                            similarity: 1.0
                                        }}
                                    />
                                </div>
                            ))
                        ) : category ? (
                            <div className="col-12 text-center py-5">
                                <div className="mb-4 text-warning opacity-25">
                                    <Filter size={64} />
                                </div>
                                <h3>No verified pieces available</h3>
                                <p className="text-white-50">Our artisans are currently crafting more masterpieces for this collection.</p>
                            </div>
                        ) : null}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
