"use client"

import React, { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { auth, db } from "@/lib/firebase/config"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { Sparkles, ArrowRight, User, Mail, Lock, Briefcase, MapPin, Loader, CheckCircle, Globe, Hammer } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ApplyPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        specialty: "",
        bio: "",
        location: ""
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // 1. Sign up the user
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
            const user = userCredential.user

            if (user) {
                // 2. Set profile instead of RPC
                await setDoc(doc(db, 'profiles', user.uid), {
                    full_name: formData.fullName,
                    specialty: formData.specialty,
                    bio: formData.bio,
                    location: formData.location,
                    role: 'artisan',
                    status: 'pending',
                    created_at: new Date().toISOString()
                })

                setSuccess(true)
                setTimeout(() => {
                    router.push('/dashboard/artisan')
                }, 3000)
            }
        } catch (err: any) {
            console.error("Signup error:", err)
            setError(err.message || "Failed to submit application. Please verify your details.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="bg-dark text-white min-vh-100 d-flex flex-column">
                <Navbar />
                <main className="container flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center">
                    <div className="p-5 rounded-circle bg-success bg-opacity-10 text-success mb-4 animate-fade-in-up">
                        <CheckCircle size={64} />
                    </div>
                    <h1 className="display-4 fw-bold mb-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Welcome to the Guild</h1>
                    <p className="lead text-white-50 mb-5 animate-fade-in-up" style={{ animationDelay: '0.2s', maxWidth: '600px' }}>
                        Your heritage profile has been created. We are redirecting you to your Artisan Studio Dashboard where you can begin cataloging your history.
                    </p>
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column overflow-hidden">
            <Navbar />

            <main className="container-fluid py-5 mt-5 flex-grow-1 position-relative">
                <div className="position-absolute top-0 end-0 w-100 h-100 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(circle at 80% 20%, #ff933f 0%, transparent 40%)",
                        zIndex: 0
                    }}
                />

                <div className="container position-relative z-1">
                    <div className="row g-5 align-items-center mb-5">
                        <div className="col-lg-6 animate-fade-in-up">
                            <div className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-1 rounded-pill bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 small text-uppercase fw-bold ls-2">
                                <Sparkles size={14} /> Join The Local Crafts
                            </div>
                            <h1 className="display-3 fw-bold mb-4">Digitize Your <span className="text-warning">Heritage.</span></h1>
                            <p className="lead text-white-50 mb-5 pe-lg-5" style={{ lineHeight: '1.8' }}>
                                Become a verified Artisan on our platform. Tap into AI-powered tools that authenticate your work, translate your stories magically globally, and securely manage global fulfillment.
                            </p>

                            <div className="d-flex flex-column gap-4">
                                <div className="d-flex align-items-start gap-3">
                                    <div className="p-2 rounded-circle bg-white bg-opacity-5 border border-white-10 text-white-50">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-1">Total Control</h5>
                                        <p className="small text-white-50 mb-0">You own your workshop. Control inventory, prices, and your legacy directly from your phone.</p>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start gap-3">
                                    <div className="p-2 rounded-circle bg-white bg-opacity-5 border border-white-10 text-white-50">
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-1">Global Reach</h5>
                                        <p className="small text-white-50 mb-0">Our AI matches your unique craft with buyers worldwide instantly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="p-4 p-md-5 rounded-5 border border-white-10 bg-white bg-opacity-5 backdrop-blur-xl shadow-lg">
                                <h3 className="fw-bold mb-4">Artisan Application</h3>

                                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <label className="form-label small text-white-50 text-uppercase ls-1">Full Name</label>
                                            <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                <span className="input-group-text bg-transparent border-0 text-white-50"><User size={16} /></span>
                                                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="Master Artisan Name" />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <label className="form-label small text-white-50 text-uppercase ls-1">Master Specialty</label>
                                            <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                                <span className="input-group-text bg-transparent border-0 text-warning"><Hammer size={16} /></span>
                                                <input type="text" name="specialty" required value={formData.specialty} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="e.g. Blue Pottery" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label small text-white-50 text-uppercase ls-1">Email Address</label>
                                        <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                            <span className="input-group-text bg-transparent border-0 text-white-50"><Mail size={16} /></span>
                                            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="Email for secure access" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label small text-white-50 text-uppercase ls-1">Secure Password</label>
                                        <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                            <span className="input-group-text bg-transparent border-0 text-white-50"><Lock size={16} /></span>
                                            <input type="password" name="password" required value={formData.password} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="Create a strong password" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label small text-white-50 text-uppercase ls-1">Operation City / Region</label>
                                        <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white-10">
                                            <span className="input-group-text bg-transparent border-0 text-white-50"><MapPin size={16} /></span>
                                            <input type="text" name="location" required value={formData.location} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="e.g. Multan, Pakistan" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label small text-white-50 text-uppercase ls-1">Short Bio</label>
                                        <textarea name="bio" rows={3} required value={formData.bio} onChange={handleChange} className="form-control bg-dark bg-opacity-50 border border-white-10 text-white rounded-4 p-3 shadow-none" placeholder="Tell us briefly about your heritage and how many generations have practiced this craft..."></textarea>
                                    </div>

                                    {error && <div className="text-danger small p-2 rounded bg-danger bg-opacity-10 border border-danger-10">{error}</div>}

                                    <button type="submit" disabled={loading} className="btn btn-warning rounded-pill py-3 fw-bold mt-2 shadow-lg d-flex align-items-center justify-content-center gap-2 hover-scale transition-transform">
                                        {loading ? <Loader size={20} className="spin" /> : <>Submit Application <ArrowRight size={18} /></>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
