import React from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ProductCard } from "@/components/search/ProductCard"
import { MapPin, Sparkles, Map, ArrowRight } from "lucide-react"
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"

export async function generateStaticParams() {
    const regions = [
        "Punjab", "Sindh", "KPK", "Balochistan", "Gilgit-Baltistan", "AJK"
    ];
    return regions.map((region) => ({
        region: region.toLowerCase(),
    }));
}

export async function generateMetadata({ params }: { params: { region: string } }) {
    const rawRegion = decodeURIComponent(params.region)
    const displayRegionMap: Record<string, string> = {
        'punjab': 'Punjab',
        'sindh': 'Sindh',
        'kpk': 'Khyber Pakhtunkhwa',
        'balochistan': 'Balochistan',
        'gilgit-baltistan': 'Gilgit-Baltistan',
        'ajk': 'Azad Kashmir'
    };
    const displayRegion = displayRegionMap[rawRegion.toLowerCase()] || rawRegion.charAt(0).toUpperCase() + rawRegion.slice(1);

    return {
        title: `Authentic Crafts of ${displayRegion} | The Local Crafts`,
        description: `Explore centuries-old traditions and artisan handicrafts exclusively from ${displayRegion}. Authenticated by AI and direct from the master artisans.`,
        alternates: {
            canonical: `https://thelocalcrafts.com/region/${rawRegion.toLowerCase()}`
        }
    }
}

export default async function RegionalSiloPage({ params }: { params: { region: string } }) {
    const rawRegion = decodeURIComponent(params.region)
    // Make sure we correctly capitalize known regions
    const displayRegionMap: Record<string, string> = {
        'punjab': 'Punjab',
        'sindh': 'Sindh',
        'kpk': 'Khyber Pakhtunkhwa (KPK)',
        'balochistan': 'Balochistan',
        'gilgit-baltistan': 'Gilgit-Baltistan',
        'ajk': 'Azad Kashmir'
    };

    const displayRegion = displayRegionMap[rawRegion.toLowerCase()] || rawRegion.charAt(0).toUpperCase() + rawRegion.slice(1);

    // Create actual DB search parameter mapping if needed
    const dbSearchRegion = displayRegionMap[rawRegion.toLowerCase()] ? displayRegionMap[rawRegion.toLowerCase()] : displayRegion;
    // Actually the dropdown uses exact match: "Punjab", "Sindh", "KPK", "Balochistan", "Gilgit-Baltistan", "AJK"
    const exactDbMatch: Record<string, string> = {
        'punjab': 'Punjab',
        'sindh': 'Sindh',
        'kpk': 'KPK',
        'balochistan': 'Balochistan',
        'gilgit-baltistan': 'Gilgit-Baltistan',
        'ajk': 'AJK'
    };

    const searchKey = exactDbMatch[rawRegion.toLowerCase()] || rawRegion;

    // Fetch premium products specifically siloed in this region
    const pQ = query(collection(db, "products"), orderBy("created_at", "desc"))
    const pSnap = await getDocs(pQ)
    let products: any[] = pSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter((p: any) => p.region === searchKey)

    // Fallback logic for demonstration if empty
    if (!products || products.length === 0) {
        // Fallback or empty state
        products = [];
    }

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="flex-grow-1">
                {/* HERO SECTION */}
                <div className="position-relative py-5" style={{ minHeight: "50vh", background: "url('https://images.unsplash.com/photo-1589416554807-73d8abaf1296?auto=format&fit=crop&q=80') center/cover no-repeat" }}>
                    <div className="position-absolute w-100 h-100 top-0 start-0 bg-dark bg-opacity-75"></div>
                    <div className="container position-relative z-1 d-flex flex-column justify-content-center h-100 mt-5 pt-5 text-center">
                        <div className="d-inline-flex align-items-center justify-content-center gap-2 mb-4 mx-auto px-4 py-2 rounded-pill bg-danger bg-opacity-25 border border-danger border-opacity-50 text-white fw-bold text-uppercase ls-1 backdrop-blur">
                            <Map size={18} className="text-danger" /> Heritage Silo: {displayRegion}
                        </div>
                        <h1 className="display-3 fw-bold mb-4 text-shadow-lg">
                            Authentic Crafts of <span className="text-danger">{displayRegion}</span>
                        </h1>
                        <p className="lead text-white-50 mx-auto mb-5 text-shadow" style={{ maxWidth: "800px" }}>
                            Explore centuries-old traditions preserved tightly within the borders of {displayRegion}. Every single piece curated here holds the geographical and historical DNA of the region.
                        </p>
                    </div>
                </div>

                <div className="container py-5 mt-4 mb-5">
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold mb-3 d-flex align-items-center justify-content-center gap-3">
                            <MapPin className="text-danger" /> Regional Treasury
                        </h2>
                        <p className="text-white-50">Handcrafted masterpieces sourced exclusively from {displayRegion}.</p>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-5 border border-white-10 rounded-5 bg-white bg-opacity-5">
                            <Sparkles size={48} className="text-white-50 mb-4 opacity-50" />
                            <h3 className="fw-bold mb-2">Silo Expansion in Progress</h3>
                            <p className="text-white-50">Our master artisans from {displayRegion} are currently preparing new heritage pieces for the national network. Check back shortly.</p>
                            <Link href="/explore" className="btn btn-warning rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center gap-2 hover-scale">
                                Explore National Catalog <ArrowRight size={16} />                          </Link>
                        </div>
                    ) : (
                        <div className="row g-4 animate-fade-in-up">
                            {products.map((product) => (
                                <div key={product.id} className="col-md-6 col-lg-4">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
