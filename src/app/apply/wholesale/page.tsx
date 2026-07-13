"use client"

import React, { useState, useEffect } from "react"
import { auth, db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, addDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Loader, ShieldCheck, CheckCircle } from "lucide-react"

export default function WholesaleApplyPage() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    
    const [step, setStep] = useState(0)
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

    const handleSubmit = async () => {
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

    const nextStep = () => setStep(s => s + 1)
    
    const handleKeyDown = (e: React.KeyboardEvent, onEnter: () => void) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            onEnter()
        }
    }

    if (submitted) {
        return (
            <div className="bg-black text-white min-vh-100 d-flex flex-column align-items-center justify-content-center p-4">
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
                    </div>
                </div>
            </div>
        )
    }

    const steps = [
        // Step 0: Intro
        <div key="step-0" className="d-flex flex-column align-items-start">
            <h1 className="display-3 fw-bold mb-4 text-white">Welcome to<br/><span className="text-warning">The Local Craft.</span></h1>
            <p className="lead text-white-50 mb-5 max-w-md">
                We partner with select distributors and retailers who share our passion for authentic, ethically-sourced heritage crafts. Shall we begin the verification process?
            </p>
            <button onClick={nextStep} className="btn btn-warning rounded-pill px-5 py-3 fw-bold fs-5 shadow-lg d-flex align-items-center gap-2 hover-scale transition-all">
                Begin Interview <ArrowRight size={20} />
            </button>
        </div>,

        // Step 1: Business Name
        <div key="step-1" className="d-flex flex-column align-items-start w-100">
            <p className="text-warning small text-uppercase tracking-wider fw-bold mb-3">01 / 05</p>
            <h2 className="display-5 fw-bold mb-4 text-white">First, what is the name of your retail space or business?</h2>
            <div className="input-group input-group-lg border-bottom border-white-50 pb-2 mb-5">
                <input 
                    autoFocus
                    type="text" 
                    value={formData.business_name} 
                    onChange={e => setFormData({...formData, business_name: e.target.value})} 
                    onKeyDown={e => formData.business_name && handleKeyDown(e, nextStep)}
                    className="form-control bg-transparent border-0 text-white shadow-none fs-2 p-0 placeholder-white-25" 
                    placeholder="e.g. Heritage Arts Ltd." 
                />
            </div>
            <button onClick={nextStep} disabled={!formData.business_name} className="btn btn-light rounded-pill px-5 py-3 fw-bold fs-5 d-flex align-items-center gap-2 transition-all">
                Continue <ArrowRight size={20} />
            </button>
        </div>,

        // Step 2: Business Type
        <div key="step-2" className="d-flex flex-column align-items-start w-100">
            <p className="text-warning small text-uppercase tracking-wider fw-bold mb-3">02 / 05</p>
            <h2 className="display-5 fw-bold mb-4 text-white">What kind of business is {formData.business_name || "it"}?</h2>
            <div className="d-flex flex-wrap gap-3 mb-5">
                {['Retailer', 'Distributor', 'Commission Agent', 'Hospitality / Decor'].map((type) => (
                    <button 
                        key={type}
                        onClick={() => {
                            setFormData({...formData, business_type: type});
                            setTimeout(nextStep, 300); // Auto advance
                        }}
                        className={`btn rounded-pill px-4 py-3 fw-bold fs-5 transition-all ${formData.business_type === type ? 'btn-warning text-dark' : 'btn-outline-light text-white-50 border-white-25'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>,

        // Step 3: Location
        <div key="step-3" className="d-flex flex-column align-items-start w-100">
            <p className="text-warning small text-uppercase tracking-wider fw-bold mb-3">03 / 05</p>
            <h2 className="display-5 fw-bold mb-4 text-white">Where is your primary warehouse or showroom located?</h2>
            <div className="w-100 mb-5">
                <textarea 
                    autoFocus
                    rows={2} 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                    className="form-control bg-transparent border-bottom border-white-50 border-top-0 border-start-0 border-end-0 rounded-0 text-white shadow-none fs-3 p-0 placeholder-white-25" 
                    placeholder="Full Address..."
                ></textarea>
            </div>
            <button onClick={nextStep} disabled={!formData.address} className="btn btn-light rounded-pill px-5 py-3 fw-bold fs-5 d-flex align-items-center gap-2 transition-all">
                Continue <ArrowRight size={20} />
            </button>
        </div>,

        // Step 4: Contact
        <div key="step-4" className="d-flex flex-column align-items-start w-100">
            <p className="text-warning small text-uppercase tracking-wider fw-bold mb-3">04 / 05</p>
            <h2 className="display-5 fw-bold mb-4 text-white">How can our logistics team reach you?</h2>
            <div className="w-100 d-flex flex-column gap-4 mb-5">
                <input 
                    autoFocus
                    type="tel" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className="form-control bg-transparent border-bottom border-white-50 border-top-0 border-start-0 border-end-0 rounded-0 text-white shadow-none fs-3 p-0 placeholder-white-25" 
                    placeholder="Phone Number (+1 ...)"
                />
                <input 
                    type="url" 
                    value={formData.website} 
                    onChange={e => setFormData({...formData, website: e.target.value})} 
                    className="form-control bg-transparent border-bottom border-white-50 border-top-0 border-start-0 border-end-0 rounded-0 text-white shadow-none fs-3 p-0 placeholder-white-25" 
                    placeholder="Website (Optional)"
                />
            </div>
            <button onClick={nextStep} disabled={!formData.phone} className="btn btn-light rounded-pill px-5 py-3 fw-bold fs-5 d-flex align-items-center gap-2 transition-all">
                Continue <ArrowRight size={20} />
            </button>
        </div>,

        // Step 5: License & Submit
        <div key="step-5" className="d-flex flex-column align-items-start w-100">
            <p className="text-warning small text-uppercase tracking-wider fw-bold mb-3">05 / 05</p>
            <h2 className="display-5 fw-bold mb-4 text-white">Finally, please provide your Tax ID or Business License number.</h2>
            <p className="text-white-50 mb-4">This ensures you are eligible for B2B tax exemptions and wholesale volume discounts.</p>
            
            <div className="w-100 mb-5">
                <input 
                    autoFocus
                    type="text" 
                    value={formData.business_license_id} 
                    onChange={e => setFormData({...formData, business_license_id: e.target.value})} 
                    onKeyDown={e => handleKeyDown(e, handleSubmit)}
                    className="form-control bg-transparent border-bottom border-white-50 border-top-0 border-start-0 border-end-0 rounded-0 text-white shadow-none fs-3 p-0 placeholder-white-25" 
                    placeholder="Registration No. (Optional)"
                />
            </div>
            
            <button onClick={handleSubmit} disabled={loading} className="btn btn-warning rounded-pill px-5 py-3 fw-bold fs-5 shadow-lg d-flex align-items-center gap-2 hover-scale transition-all">
                {loading ? <Loader size={24} className="spin" /> : <>Submit Application <CheckCircle size={20} /></>}
            </button>
        </div>
    ]

    return (
        <div className="min-vh-100 position-relative overflow-hidden bg-black d-flex align-items-center">
            {/* Cinematic Background */}
            <div 
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.3) contrast(1.2)',
                    opacity: 0.6
                }}
            ></div>
            
            {/* Overlay Gradient */}
            <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 100%)' }}></div>

            <div className="container position-relative z-1">
                <div className="row">
                    <div className="col-12 col-lg-8 col-xl-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                {steps[step]}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Back button */}
            {step > 0 && (
                <button 
                    onClick={() => setStep(s => s - 1)}
                    className="btn btn-link text-white-50 text-decoration-none position-absolute top-0 start-0 m-4 fw-bold hover-text-white transition-all"
                >
                    &larr; Back
                </button>
            )}
        </div>
    )
}
