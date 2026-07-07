import React from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ProductCard } from "@/components/search/ProductCard"
import { Truck, MapPin, Sparkles, ShieldCheck, Clock, Package } from "lucide-react"
import { db } from "@/lib/firebase/config"
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore"

export async function generateStaticParams() {
    const cities = [
        "Karachi", "Lahore", "Islamabad", "multan", "peshawar", "quetta", "faisalabad", "sialkot", "hyderabad", "rawalpindi"
    ];
    return cities.map((city) => ({
        city: city.toLowerCase(),
    }));
}

export async function generateMetadata({ params }: { params: { city: string } }) {
    const rawCity = decodeURIComponent(params.city)
    const displayCity = rawCity.toLowerCase() === 'pakistan'
        ? 'All Over Pakistan'
        : rawCity.charAt(0).toUpperCase() + rawCity.slice(1)

    return {
        title: `Premium Handcraft Delivery to ${displayCity} | The Local Crafts`,
        description: `Experience authentic heritage. We deliver premium Pakistani handicrafts verified by AI directly to your doorstep in ${displayCity} with free nationwide priority dispatch.`,
        alternates: {
            canonical: `https://thelocalcrafts.com/delivery/${params.city.toLowerCase()}`
        }
    }
}

export default async function CityDeliveryPage({ params }: { params: { city: string } }) {
    const rawCity = decodeURIComponent(params.city)
    const displayCity = rawCity.toLowerCase() === 'pakistan'
        ? 'All Over Pakistan'
        : rawCity.charAt(0).toUpperCase() + rawCity.slice(1)

    // Fetch premium top products for the landing page
    const pQ = query(collection(db, "products"), orderBy("price", "desc"), limit(6))
    const pSnap = await getDocs(pQ)
    const products = pSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as any[]

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="flex-grow-1">
                {/* HERO SECTION */}
                <div className="position-relative py-5" style={{ minHeight: "60vh", background: "linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(30,30,30,1) 100%)" }}>
                    <div className="container position-relative z-1 d-flex flex-column justify-content-center h-100 mt-5 pt-5 text-center">
                        <div className="d-inline-flex align-items-center justify-content-center gap-2 mb-4 mx-auto px-4 py-2 rounded-pill bg-warning bg-opacity-10 border border-warning border-opacity-25 text-warning fw-bold text-uppercase ls-1">
                            <Truck size={18} /> Official Delivery Network
                        </div>
                        <h1 className="display-3 fw-bold mb-4">
                            Premium Handcrafts Delivered Free to <span className="text-warning">{displayCity}</span>
                        </h1>
                        <p className="lead text-white-50 mx-auto mb-5" style={{ maxWidth: "800px" }}>
                            The Local Crafts brings authentic, verified heritage directly to your doorstep in {displayCity}. Experience centuries of tradition with zero shipping fees across our entire network.
                        </p>

                        <div className="d-flex flex-wrap justify-content-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <Link href="/explore" className="btn btn-warning rounded-pill px-5 py-3 fs-5 fw-bold shadow-lg hover-scale">
                                Explore Heritage Library
                            </Link>
                        </div>
                    </div>
                </div>

                {/* TRUST BADGES */}
                <div className="container py-5 border-top border-bottom border-white-10 text-center">
                    <div className="row g-4 justify-content-center">
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 bg-white bg-opacity-5 h-100">
                                <Truck size={32} className="text-warning mb-3 mx-auto" />
                                <h5 className="fw-bold">Free Nationwide Shipping</h5>
                                <p className="text-white-50 small mb-0">From Multan to {displayCity}, our logistics network covers all 50+ major cities completely free of charge.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 bg-white bg-opacity-5 h-100">
                                <ShieldCheck size={32} className="text-success mb-3 mx-auto" />
                                <h5 className="fw-bold">Secure Cash on Delivery</h5>
                                <p className="text-white-50 small mb-0">Pay only when your heritage piece safely arrives at your doorstep in {displayCity}. 100% risk-free.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 bg-white bg-opacity-5 h-100">
                                <Clock size={32} className="text-info mb-3 mx-auto" />
                                <h5 className="fw-bold">Prioritized Dispatch</h5>
                                <p className="text-white-50 small mb-0">Our artisans prepare your order immediately, safely packing it for domestic transit.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PRODUCTS TO BUY NOW */}
                <div className="container py-5 mt-4 mb-5">
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold mb-3 d-flex align-items-center justify-content-center gap-3">
                            <Sparkles className="text-warning" /> Trending in {displayCity}
                        </h2>
                        <p className="text-white-50">Discover authentic crafts ready to be shipped today.</p>
                    </div>

                    <div className="row g-4">
                        {products?.map((product) => (
                            <div key={product.id} className="col-md-6 col-lg-4">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* CITY FOOTER SEO BLOCK */}
                <div className="bg-dark border-top border-white-10 py-5">
                    <div className="container text-center">
                        <p className="text-white-50 small mx-auto" style={{ maxWidth: "700px", lineHeight: "1.8" }}>
                            <MapPin size={16} className="text-warning me-2 d-inline" />
                            The Local Crafts is Pakistan's premier platform for authentic artisan heritage.
                            Our verified logistics network guarantees secure, complimentary shipping of Blue Pottery, Ajrak Textiles, Chinioti Woodwork, and Swat Embroidery to <strong>{displayCity}</strong> and across every province in Pakistan. Every piece is an investment in cultural legacy.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
