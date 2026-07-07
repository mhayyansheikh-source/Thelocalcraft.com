"use client"
import React, { useEffect, useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore"
import { 
    BookOpen, 
    Share2, 
    Printer, 
    ChevronLeft, 
    MapPin, 
    Clock, 
    User,
    PenTool,
    Globe,
    ExternalLink,
    Quote,
    Tag,
    History,
    Sparkles
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

export default function CraftpediaArticle() {
    const { slug } = useParams()
    const [article, setArticle] = useState<any>(null)
    const [related, setRelated] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function fetchArticle() {
            setLoading(true)
            const q = query(collection(db, 'craftpedia_articles'), where('slug', '==', slug), limit(1))
            const snapshot = await getDocs(q)
            
            if (snapshot.empty) {
                console.error("Article not found")
                router.push("/craftpedia")
                return
            }

            const articleData = snapshot.docs[0].data() as any
            if (articleData.author_id) {
                const authorDoc = await getDoc(doc(db, 'profiles', articleData.author_id))
                if (authorDoc.exists()) {
                    articleData.author = authorDoc.data()
                }
            }

            setArticle({ id: snapshot.docs[0].id, ...articleData })

            // Fetch related articles in same category
            const relatedQ = query(collection(db, 'craftpedia_articles'), where('category', '==', articleData.category), limit(4))
            const relatedSnapshot = await getDocs(relatedQ)
            
            if (!relatedSnapshot.empty) {
                const relatedData = relatedSnapshot.docs
                    .map(d => ({ id: d.id, ...d.data() }))
                    .filter((d: any) => d.slug !== slug)
                    .slice(0, 3)
                setRelated(relatedData)
            }
            setLoading(false)
        }
        fetchArticle()
    }, [slug, router])

    if (loading) return (
        <div className="bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
            <div className="spinner-grow text-warning" role="status">
                <span className="visually-hidden">Restoring Manuscript...</span>
            </div>
        </div>
    )

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />

            <main className="flex-grow-1 pt-5 mt-5">
                {/* ARTICLE HEADER / HERO */}
                <section className="py-5 bg-black bg-opacity-30 border-bottom border-white border-opacity-5">
                    <div className="container">
                        <Link href="/craftpedia" className="text-white-50 text-decoration-none d-inline-flex align-items-center gap-2 mb-4 hover-text-warning transition-colors small fw-bold text-uppercase ls-1">
                            <ChevronLeft size={16} /> Heritage Archives
                        </Link>
                        
                        <div className="row g-5 align-items-center">
                            <div className="col-lg-7 animate-fade-in-left">
                                <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-2 mb-3 fw-bold ls-1 text-uppercase border border-warning border-opacity-25 shadow-sm">
                                    <Tag size={12} className="me-2" /> {article.category}
                                </span>
                                <h1 className="display-2 fw-bold mb-4 ls-tight">{article.title}</h1>
                                
                                <div className="d-flex flex-wrap align-items-center gap-4 text-white-50 small mb-2 p-3 rounded-4 bg-white bg-opacity-5 border border-white-5">
                                    <div className="d-flex align-items-center gap-2"><Clock size={16} /> Archive Node: {new Date(article.created_at).toLocaleDateString()}</div>
                                    <div className="d-flex align-items-center gap-2"><MapPin size={16} /> {article.heritage_site}</div>
                                    <div className="d-flex align-items-center gap-2"><User size={16} /> Scribed by: {article.author?.full_name || "Academy of Artisans"}</div>
                                </div>
                            </div>
                            <div className="col-lg-5 animate-fade-in-right">
                                <div className="rounded-5 overflow-hidden shadow-2xl border border-white border-opacity-10" style={{ boxShadow: "0 50px 100px -20px rgba(0,0,0,0.5)" }}>
                                    <img src={article.image_url || "/images/hero.png"} alt={article.title} className="w-100 h-100 object-fit-cover opacity-90 transition-transform scale-105" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-5 position-relative">
                    <div className="container overflow-visible">
                        <div className="row g-5">
                            {/* SOCIAL STICKER SIDEBAR */}
                            <aside className="col-lg-1 d-none d-lg-block">
                                <div className="sticky-top pt-5 d-flex flex-column gap-3 align-items-center" style={{ top: "120px" }}>
                                    <button className="btn btn-outline-light border-opacity-10 rounded-circle p-3 hover-bg-warning hover-text-dark transition-all" title="Share Manuscript"><Share2 size={24} /></button>
                                    <button className="btn btn-outline-light border-opacity-10 rounded-circle p-3 hover-bg-warning hover-text-dark transition-all" title="Print Archive"><Printer size={24} /></button>
                                    <button className="btn btn-outline-light border-opacity-10 rounded-circle p-3 hover-bg-warning hover-text-dark transition-all" title="View History"><History size={24} /></button>
                                </div>
                            </aside>

                            {/* MAIN CONTENT AREA */}
                            <article className="col-lg-7 animate-fade-in-up">
                                <div className="p-4 p-md-5 rounded-5 border border-white border-opacity-5 shadow-2xl bg-white bg-opacity-2 pb-5" style={{ minHeight: "600px" }}>
                                    {/* Manuscript Paper Texture (Visual Simulation) */}
                                    <div className="position-absolute w-100 h-100 top-0 start-0 opacity-2 pointer-events-none" style={{ backgroundImage: "url('/images/sepia-texture.png')", backgroundBlendMode: "overlay" }}></div>

                                    <div className="position-relative z-1 manuscript-content text-white-50 lead fs-5" style={{ lineHeight: "1.8", letterSpacing: "0.2px" }}>
                                        {/* Mock Markdown Rendering (In production we'd use react-markdown) */}
                                        <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n\n/g, '<br/><br/>').replace(/### (.*)/g, '<h3 class="text-white fw-bold my-4">$1</h3>').replace(/# (.*)/g, '<h1 class="text-white fw-bold mb-4">$1</h1>') }} />
                                        
                                        <div className="mt-5 pt-5 border-top border-white border-opacity-10 opacity-75">
                                            <Quote size={40} className="text-warning mb-4 opacity-50" />
                                            <p className="fst-italic fs-4 text-white">
                                                This article is a part of the Craftpedia Open Repository, co-authored by master artisans from across Pakistan to ensure historical accuracy and technical integrity.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            {/* RELATED / SIDEBAR AREA */}
                            <aside className="col-lg-4 animate-fade-in-right">
                                <div className="sticky-top pt-4" style={{ top: "120px" }}>
                                    {/* Author Profile Card */}
                                    <div className="p-4 rounded-5 border border-white border-opacity-10 bg-white bg-opacity-5 mb-5 shadow-xl">
                                        <div className="d-flex align-items-center gap-3 mb-4">
                                            <div className="rounded-circle border border-warning border-opacity-50 p-1 bg-warning bg-opacity-10">
                                                <div className="rounded-circle bg-warning text-dark fw-bold d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                                                    {article.author?.full_name?.charAt(0) || "A"}
                                                </div>
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-0 text-white truncate-1">{article.author?.full_name || "Verified Academy Member"}</h6>
                                                <div className="small text-warning d-flex align-items-center gap-1 opacity-75">
                                                    <Sparkles size={12} /> Master Heritage Scribe
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-white-50 small mb-4 opacity-75">
                                            An expert in {article.category} documenting traditional techniques and historical socio-economic impacts of the craft.
                                        </p>
                                        <div className="d-grid">
                                            <button className="btn btn-outline-warning btn-sm rounded-pill fw-bold">View Contributor Profile</button>
                                        </div>
                                    </div>

                                    {/* Related Knowledge Section */}
                                    <div className="mb-5">
                                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2"><Globe size={18} className="text-warning" /> Parallel Archives</h5>
                                        <div className="d-flex flex-column gap-3">
                                            {related.map(r => (
                                                <Link key={r.id} href={`/craftpedia/${r.slug}`} className="text-decoration-none group">
                                                    <div className="p-3 rounded-4 border border-white border-opacity-5 bg-white bg-opacity-2 hover-bg-white-5 transition-all d-flex gap-3 align-items-center">
                                                        <div className="flex-shrink-0 rounded-3 overflow-hidden" style={{ width: "60px", height: "60px" }}>
                                                            <img src={r.image_url || "/images/hero.png"} alt={r.title} className="w-100 h-100 object-fit-cover opacity-50 grayscale group-hover-grayscale-0 transition-grayscale" />
                                                        </div>
                                                        <div className="flex-grow-1 overflow-hidden">
                                                            <h6 className="fw-bold mb-1 text-white truncate-1 group-hover-text-warning">{r.title}</h6>
                                                            <div className="small text-white-50 opacity-75 ls-1 text-uppercase fw-bold" style={{ fontSize: "0.65rem" }}>{r.category}</div>
                                                        </div>
                                                        <ExternalLink size={16} className="text-white-50 flex-shrink-0 opacity-25 group-hover-opacity-100 transition-opacity" />
                                                    </div>
                                                </Link>
                                            ))}
                                            {related.length === 0 && (
                                                <p className="text-white-50 small opacity-50 fst-italic">No parallel records found in the current index.</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Verification Badge */}
                                    <div className="p-4 rounded-5 border border-success border-opacity-25 bg-success bg-opacity-5 text-center shadow-2xl">
                                        <div className="rounded-circle bg-success bg-opacity-10 text-success d-inline-flex p-3 mb-3 shadow-sm border border-success border-opacity-25">
                                            <PenTool size={24} />
                                        </div>
                                        <h6 className="fw-bold mb-2">Authenticated Source</h6>
                                        <p className="text-white-50 small opacity-75 mb-0">This documentation has been verified by the Heritage Council for accuracy and historical integrity.</p>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
