"use client"

import React, { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { auth, db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, addDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { 
    Briefcase, 
    CheckCircle, 
    Globe, 
    ShieldCheck, 
    ArrowRight, 
    Loader, 
    MessageSquare,
    Store,
    Users,
    TrendingUp
} from "lucide-react"

export default function WholesaleApplyPage() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()

    const [formData, setFormData] = useState({
        business_name: "",
        business_type: "Retailer",
        website: "",
        phone: "",
        address: "",
        business_license_id: "",
        notes: ""
    })

    useEffect(() => {
        const checkUser = async () => {
            const user = auth.currentUser
            if (!user) {
                router.push("/login?redirect=/apply/wholesale")
                return
            }
            setUser(user)
            
            // Check if already applied
            const q = query(collection(db, 'wholesale_applications'), where('user_id', '==', user.uid))
            const querySnapshot = await getDocs(q)
            
            if (!querySnapshot.empty) {
                const existing = querySnapshot.docs[0].data()
                if (existing.status === 'approved') {
                    router.push("/dashboard/wholesale")
                } else {
                    setSubmitted(true)
                }
            }
        }
        checkUser()
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await addDoc(collection(db, 'wholesale_applications'), {
                user_id: user.uid,
                ...formData,
                status: 'pending',
                created_at: new Date().toISOString()
            })

            setSubmitted(true)
        } catch (error: any) {
            alert(error.message || "Failed to submit application.")
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex flex-column">
                <Navbar />
                <main className="container flex-grow-1 d-flex align-items-center justify-content-center py-5 mt-5">
                    <div className="text-center p-5 rounded-5 border border-warning border-opacity-25 bg-white bg-opacity-5 shadow-2xl max-w-lg w-100 animate-fade-in" style={{ backdropFilter: "blur(20px)" }}>
                        <div className="mb-4 d-inline-block rounded-circle p-4 bg-warning bg-opacity-10 text-warning shadow-lg">
                            <ShieldCheck size={64} />
                        </div>
                        <h1 className="display-5 fw-bold mb-3">Application Received</h1>
                        <p className="text-white-50 lead mb-5">
                            Our heritage verification team is reviewing your business credentials. We'll notify you via email once your wholesale access is active.
                        </p>
                        <div className="d-grid gap-3">
                            <button onClick={() => router.push("/")} className="btn btn-warning rounded-pill py-3 fw-bold shadow-lg hover-scale transition-all">
                                Return to Gallery
                            </button>
                            <button onClick={() => router.push("/explore")} className="btn btn-outline-light border-opacity-20 rounded-pill py-3 fw-bold">
                                Browse Collections
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <Navbar />
            
            <main className="flex-grow-1 pt-5 mt-5">
                {/* Hero Section */}
                <section className="py-5 position-relative overflow-hidden">
                    <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10 blur-3xl" style={{ background: "radial-gradient(circle at 50% 50%, #ffc107, transparent)" }}></div>
                    <div className="container position-relative z-1 text-center animate-fade-in">
                        <span className="badge bg-warning text-dark rounded-pill px-3 py-2 mb-3 fw-bold ls-1 text-uppercase">B2B Partnership</span>
                        <h1 className="display-3 fw-bold mb-3">Wholesale <span className="text-warning">Heritage.</span></h1>
                        <p className="text-white-50 lead mx-auto mb-5" style={{ maxWidth: "700px" }}>
                            Join our global network of retailers and agents. Access exclusive pricing, bulk orders, and commission-based growth opportunities.
                        </p>
                    </div>
                </section>

                <section className="pb-5">
                    <div className="container">
                        <div className="row g-5">
                            {/* Features */}
                            <div className="col-lg-5 animate-fade-in-left">
                                <div className="sticky-top" style={{ top: "120px" }}>
                                    <div className="d-flex flex-column gap-4">
                                        <div className="p-4 rounded-4 bg-white bg-opacity-5 border border-white-10 hover-translate-y transition-all">
                                            <div className="d-flex align-items-center gap-3 mb-3">
                                                <div className="p-2 bg-warning bg-opacity-10 text-warning rounded-circle">
                                                    <TrendingUp size={24} />
                                                </div>
                                                <h4 className="fw-bold m-0">Wholesale Pricing</h4>
                                            </div>
                                            <p className="text-white-50 m-0">Unlock exclusive tiered pricing for bulk purchases direct from master artisans.</p>
                                        </div>

                                        <div className="p-4 rounded-4 bg-white bg-opacity-5 border border-white-10 hover-translate-y transition-all">
                                            <div className="d-flex align-items-center gap-3 mb-3">
                                                <div className="p-2 bg-info bg-opacity-10 text-info rounded-circle">
                                                    <Globe size={24} />
                                                </div>
                                                <h4 className="fw-bold m-0">Global Logistics</h4>
                                            </div>
                                            <p className="text-white-50 m-0">Seamless export Grade packaging and tracked shipping to any destination globally.</p>
                                        </div>

                                        <div className="p-4 rounded-4 bg-white bg-opacity-5 border border-white-10 hover-translate-y transition-all">
                                            <div className="d-flex align-items-center gap-3 mb-3">
                                                <div className="p-2 bg-success bg-opacity-10 text-success rounded-circle">
                                                    <Users size={24} />
                                                </div>
                                                <h4 className="fw-bold m-0">Commission Growth</h4>
                                            </div>
                                            <p className="text-white-50 m-0">Earn performance-based commissions as a verified heritage agent or distributor.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="col-lg-7 animate-fade-in-right">
                                <div className="p-5 rounded-5 border border-white-10 bg-white bg-opacity-5 shadow-2xl" style={{ backdropFilter: "blur(20px)" }}>
                                    <h3 className="fw-bold mb-4">Business Credentials</h3>
                                    <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                                        <div className="row g-4">
                                            <div className="col-md-6">
                                                <label className="form-label small text-white-50 text-uppercase ls-1 fw-bold">Business Name</label>
                                                <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10 focus-within-warning transition-all">
                                                    <span className="input-group-text bg-transparent border-0 text-white-50"><Store size={18} /></span>
                                                    <input type="text" required value={formData.business_name} onChange={e => setFormData({...formData, business_name: e.target.value})} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="e.g. Heritage Crafts Ltd" />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small text-white-50 text-uppercase ls-1 fw-bold">Business Type</label>
                                                <select className="form-select p-3 bg-dark bg-opacity-50 border border-white-10 text-white rounded-4 shadow-none cursor-pointer" value={formData.business_type} onChange={e => setFormData({...formData, business_type: e.target.value})}>
                                                    <option value="Retailer">Retailer</option>
                                                    <option value="Distributor">Distributor</option>
                                                    <option value="Agent">Commission Agent</option>
                                                    <option value="Hospitality">Hospitality / Decor</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="row g-4">
                                            <div className="col-md-6">
                                                <label className="form-label small text-white-50 text-uppercase ls-1 fw-bold">Official Website</label>
                                                <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                    <span className="input-group-text bg-transparent border-0 text-white-50"><Globe size={18} /></span>
                                                    <input type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="https://..." />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small text-white-50 text-uppercase ls-1 fw-bold">Business Phone</label>
                                                <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                    <span className="input-group-text bg-transparent border-0 text-white-50"><MessageSquare size={18} /></span>
                                                    <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="+92 ..." />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="form-label small text-white-50 text-uppercase ls-1 fw-bold">Business Address</label>
                                            <textarea rows={3} required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="form-control bg-dark bg-opacity-50 border border-white-10 text-white rounded-4 p-3 shadow-none" placeholder="Primary warehouse or showroom address..."></textarea>
                                        </div>

                                        <div>
                                            <label className="form-label small text-white-50 text-uppercase ls-1 fw-bold">Tax ID / License (Optional)</label>
                                            <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                <span className="input-group-text bg-transparent border-0 text-white-50"><Briefcase size={18} /></span>
                                                <input type="text" value={formData.business_license_id} onChange={e => setFormData({...formData, business_license_id: e.target.value})} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="Company registration number" />
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-top border-white-10">
                                            <button type="submit" disabled={loading} className="btn btn-warning w-100 rounded-pill py-3 fw-bold fs-5 shadow-lg d-flex align-items-center justify-content-center gap-3 hover-scale transition-all">
                                                {loading ? <Loader size={24} className="spin" /> : <>Identify as Heritage Partner <ArrowRight size={20} /></>}
                                            </button>
                                            <p className="text-center text-white-50 small mt-4 m-0 px-4">
                                                By submitting, you agree to our heritage sourcing ethics and B2B terms of service. Account verification usually takes 2-3 business days.
                                            </p>
                                        </div>
                                    </form>
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
