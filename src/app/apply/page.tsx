"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { upload } from "@vercel/blob/client"
import { auth, db } from "@/lib/firebase/config"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { ArrowRight, User, Mail, Lock, Briefcase, MapPin, Loader, CheckCircle, UploadCloud, X, ChevronRight, Image as ImageIcon, Link as LinkIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const fadeIn = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
}

export default function ApplyPage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const [formData, setFormData] = useState({
        // Step 1
        fullName: "",
        email: "",
        password: "",
        specialty: "",
        location: "",
        portfolioUrl: "",
        // Step 2
        makerStory: "",
        productionPhilosophy: "",
        workspaceImages: [] as string[],
        // Step 3
        capacity: "Solo Maker",
        fairTradePledge: false,
        signature: ""
    })

    const [uploadingImages, setUploadingImages] = useState(false)
    const [showTerms, setShowTerms] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value })
    }

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setUploadingImages(true)
        setError(null)
        try {
            const newImageUrls = [...formData.workspaceImages]
            for (const file of acceptedFiles) {
                // Upload to Vercel Blob
                const newBlob = await upload(file.name, file, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                })
                newImageUrls.push(newBlob.url)
            }
            setFormData(prev => ({ ...prev, workspaceImages: newImageUrls }))
        } catch (err: any) {
            console.error("Upload error:", err)
            setError("Failed to upload image. Please try again.")
        } finally {
            setUploadingImages(false)
        }
    }, [formData.workspaceImages])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 3
    })

    const removeImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            workspaceImages: prev.workspaceImages.filter((_, idx) => idx !== indexToRemove)
        }))
    }

    const nextStep = () => {
        setError(null)
        if (step === 1) {
            if (!formData.fullName || !formData.email || !formData.password || !formData.specialty || !formData.location) {
                setError("Please fill out all required identity fields.")
                return
            }
        }
        if (step === 2) {
            if (formData.makerStory.length < 50) {
                setError("Please share a bit more about your story (minimum 50 characters).")
                return
            }
            if (formData.workspaceImages.length === 0) {
                setError("Please upload at least one image of your workspace or tools.")
                return
            }
        }
        setStep(prev => prev + 1)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (step !== 3) return
        
        if (!formData.fairTradePledge || !formData.signature) {
            setError("You must pledge to fair trade practices and sign the covenant.")
            return
        }

        setLoading(true)
        setError(null)

        try {
            // 1. Sign up the user
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
            const user = userCredential.user

            if (user) {
                // 2. Set rich profile in Firestore
                const richData = {
                    full_name: formData.fullName,
                    specialty: formData.specialty,
                    location: formData.location,
                    role: 'artisan',
                    status: 'pending', // Requires admin approval
                    portfolio_url: formData.portfolioUrl,
                    created_at: new Date().toISOString(),
                    onboarding_evidence: {
                        maker_story: formData.makerStory,
                        production_philosophy: formData.productionPhilosophy,
                        workspace_images: formData.workspaceImages,
                    },
                    covenant_signature: {
                        capacity: formData.capacity,
                        fair_trade_pledge: formData.fairTradePledge,
                        signature_name: formData.signature,
                        signed_at: new Date().toISOString()
                    }
                }

                await setDoc(doc(db, 'profiles', user.uid), richData)
                // Write to artisans collection immediately so it's ready upon approval
                await setDoc(doc(db, 'artisans', user.uid), richData)

                setStep(4) // Proceed to Epilogue
            }
        } catch (err: any) {
            console.error("Signup error:", err)
            setError(err.message || "Failed to submit application.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-dark text-white min-vh-100 d-flex overflow-hidden">
            
            {/* Cinematic Left Pane (Visible on lg screens) */}
            <div className="d-none d-lg-block col-lg-5 position-relative overflow-hidden border-end border-white-10">
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="position-absolute w-100 h-100 object-fit-cover"
                    style={{ opacity: 0.6, filter: 'grayscale(50%) contrast(1.2)' }}
                >
                    {/* Placeholder royalty-free artisan video from Pexels */}
                    <source src="https://videos.pexels.com/video-files/5005828/5005828-hd_1080_1920_30fps.mp4" type="video/mp4" />
                </video>
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark" style={{ opacity: 0.4 }}></div>
                
                <div className="position-absolute bottom-0 start-0 p-5 w-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                    <Link href="/" className="text-decoration-none mb-4 d-inline-block">
                        <h2 className="fw-bold text-white ls-2">THE LOCAL CRAFT</h2>
                    </Link>
                    <h1 className="display-4 fw-bold text-white mb-3">Digitize Your Heritage.</h1>
                    <p className="lead text-white-50 mb-0">Join an exclusive collective of master artisans reaching a global audience.</p>
                </div>
            </div>

            {/* Right Pane: The Form Application */}
            <div className="col-12 col-lg-7 d-flex flex-column position-relative bg-dark">
                
                {/* Header & Progress Orbs */}
                {step < 4 && (
                    <div className="p-4 p-lg-5 d-flex justify-content-between align-items-center border-bottom border-white-10">
                        <Link href="/" className="d-lg-none text-white text-decoration-none fw-bold ls-2">THE LOCAL CRAFT</Link>
                        <div className="d-flex align-items-center gap-3 ms-auto">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="d-flex align-items-center">
                                    <div 
                                        className={`rounded-circle transition-all duration-500 shadow ${s === step ? 'bg-warning scale-110' : s < step ? 'bg-success' : 'bg-white bg-opacity-10'}`}
                                        style={{ width: s === step ? '12px' : '8px', height: s === step ? '12px' : '8px' }}
                                    />
                                    {s < 3 && <div className={`mx-2 rounded transition-all duration-500 ${s < step ? 'bg-success' : 'bg-white bg-opacity-10'}`} style={{ height: '2px', width: '24px' }} />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Form Content Area */}
                <div className="flex-grow-1 overflow-auto p-4 p-lg-5 d-flex align-items-center justify-content-center">
                    <div className="w-100" style={{ maxWidth: '600px' }}>
                        <AnimatePresence mode="wait">
                            
                            {/* STEP 1: IDENTITY */}
                            {step === 1 && (
                                <motion.div key="step1" variants={fadeIn} initial="initial" animate="animate" exit="exit" className="d-flex flex-column gap-4">
                                    <div className="mb-2">
                                        <div className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-1 rounded-pill bg-white bg-opacity-5 border border-white-10 small text-uppercase fw-bold ls-2 text-white-50">
                                            Step 1 of 3
                                        </div>
                                        <h2 className="display-6 fw-bold mb-2">The Artisan's Identity</h2>
                                        <p className="text-white-50">Let's start with the basics. Who are you, and what is your craft?</p>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small text-white-50 text-uppercase ls-1">Full Name *</label>
                                            <div className="input-group p-1 rounded-4 bg-white bg-opacity-5 border border-white-10 focus-ring-warning transition-all">
                                                <span className="input-group-text bg-transparent border-0 text-white-50"><User size={18} /></span>
                                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="e.g. Ali Ahmed" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-white-50 text-uppercase ls-1">Craft Category *</label>
                                            <div className="input-group p-1 rounded-4 bg-white bg-opacity-5 border border-white-10 focus-ring-warning transition-all">
                                                <span className="input-group-text bg-transparent border-0 text-warning"><Briefcase size={18} /></span>
                                                <select name="specialty" value={formData.specialty} onChange={handleChange} className="form-select bg-transparent border-0 text-white shadow-none">
                                                    <option value="" className="text-dark">Select Craft...</option>
                                                    <option value="Pottery & Ceramics" className="text-dark">Pottery & Ceramics</option>
                                                    <option value="Textiles & Weaving" className="text-dark">Textiles & Weaving</option>
                                                    <option value="Woodwork" className="text-dark">Woodwork</option>
                                                    <option value="Metalwork" className="text-dark">Metalwork</option>
                                                    <option value="Leatherwork" className="text-dark">Leatherwork</option>
                                                    <option value="Embroidery" className="text-dark">Embroidery</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label small text-white-50 text-uppercase ls-1">City & Province *</label>
                                        <div className="input-group p-1 rounded-4 bg-white bg-opacity-5 border border-white-10 focus-ring-warning transition-all">
                                            <span className="input-group-text bg-transparent border-0 text-white-50"><MapPin size={18} /></span>
                                            <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="e.g. Multan, Punjab" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label small text-white-50 text-uppercase ls-1">Social Media / Portfolio Link</label>
                                        <div className="input-group p-1 rounded-4 bg-white bg-opacity-5 border border-white-10 focus-ring-warning transition-all">
                                            <span className="input-group-text bg-transparent border-0 text-white-50"><LinkIcon size={18} /></span>
                                            <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="instagram.com/yourbrand" />
                                        </div>
                                    </div>

                                    <hr className="border-white-10 my-2" />

                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label small text-white-50 text-uppercase ls-1">Account Email *</label>
                                            <div className="input-group p-1 rounded-4 bg-white bg-opacity-5 border border-white-10 focus-ring-warning transition-all">
                                                <span className="input-group-text bg-transparent border-0 text-white-50"><Mail size={18} /></span>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="Email Address" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label small text-white-50 text-uppercase ls-1">Secure Password *</label>
                                            <div className="input-group p-1 rounded-4 bg-white bg-opacity-5 border border-white-10 focus-ring-warning transition-all">
                                                <span className="input-group-text bg-transparent border-0 text-white-50"><Lock size={18} /></span>
                                                <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control bg-transparent border-0 text-white shadow-none" placeholder="Create Password" />
                                            </div>
                                        </div>
                                    </div>

                                    {error && <div className="text-danger small p-3 rounded-4 bg-danger bg-opacity-10 border border-danger border-opacity-25">{error}</div>}

                                    <button type="button" onClick={nextStep} className="btn btn-warning rounded-pill py-3 px-5 fw-bold mt-4 shadow-lg d-flex align-items-center justify-content-center gap-2 hover-scale transition-transform ms-auto">
                                        Next: The Craft <ArrowRight size={18} />
                                    </button>
                                </motion.div>
                            )}

                            {/* STEP 2: HANDMADE EVIDENCE */}
                            {step === 2 && (
                                <motion.div key="step2" variants={fadeIn} initial="initial" animate="animate" exit="exit" className="d-flex flex-column gap-4">
                                    <div className="mb-2">
                                        <div className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-1 rounded-pill bg-white bg-opacity-5 border border-white-10 small text-uppercase fw-bold ls-2 text-white-50">
                                            Step 2 of 3
                                        </div>
                                        <h2 className="display-6 fw-bold mb-2">The "Handmade" Evidence</h2>
                                        <p className="text-white-50">We strictly vet against mass-produced goods. Show us your world.</p>
                                    </div>

                                    <div>
                                        <div className="d-flex justify-content-between align-items-end mb-2">
                                            <label className="form-label small text-white-50 text-uppercase ls-1 mb-0">Maker Story *</label>
                                            <span className={`small ${formData.makerStory.length > 50 ? 'text-warning' : 'text-white-50'}`}>{formData.makerStory.length}/500</span>
                                        </div>
                                        <textarea 
                                            name="makerStory" 
                                            rows={4} 
                                            maxLength={500}
                                            value={formData.makerStory} 
                                            onChange={handleChange} 
                                            className="form-control bg-white bg-opacity-5 border border-white-10 text-white rounded-4 p-4 shadow-none focus-ring-warning transition-all" 
                                            placeholder="E.g., It started in my grandfather's workshop in Jaipur, watching him shape brass by hand... What inspired you to master this craft?"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="form-label small text-white-50 text-uppercase ls-1">Production Philosophy</label>
                                        <textarea 
                                            name="productionPhilosophy" 
                                            rows={2} 
                                            value={formData.productionPhilosophy} 
                                            onChange={handleChange} 
                                            className="form-control bg-white bg-opacity-5 border border-white-10 text-white rounded-4 p-4 shadow-none focus-ring-warning transition-all" 
                                            placeholder="In 2-3 sentences, describe how your product is created and where materials are sourced."
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="form-label small text-white-50 text-uppercase ls-1 mb-2 d-block">Workspace Evidence *</label>
                                        <p className="text-white-50 small mb-3">Upload up to 3 images: One of your primary tools, your workspace, and a product "in progress."</p>
                                        
                                        <div 
                                            {...getRootProps()} 
                                            className={`p-5 rounded-4 border-2 border-dashed text-center transition-all cursor-pointer
                                                ${isDragActive ? 'border-warning bg-warning bg-opacity-10 text-warning' : 'border-white-10 bg-white bg-opacity-5 text-white-50 hover-bg-white-10'}`}
                                        >
                                            <input {...getInputProps()} />
                                            {uploadingImages ? (
                                                <div className="d-flex flex-column align-items-center gap-2">
                                                    <Loader className="spin text-warning" size={32} />
                                                    <span className="fw-bold text-white">Uploading to secure blob...</span>
                                                </div>
                                            ) : (
                                                <div className="d-flex flex-column align-items-center gap-2">
                                                    <UploadCloud size={32} className="mb-2 opacity-75" />
                                                    <span className="fw-bold text-white">Drag & Drop images here</span>
                                                    <span className="small">or click to browse (Max 3 files)</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Image Previews */}
                                        {formData.workspaceImages.length > 0 && (
                                            <div className="d-flex flex-wrap gap-3 mt-4">
                                                {formData.workspaceImages.map((url, idx) => (
                                                    <div key={idx} className="position-relative rounded-4 overflow-hidden border border-white-10 shadow-sm" style={{ width: '80px', height: '80px' }}>
                                                        <img src={url} alt="Workspace Preview" className="w-100 h-100 object-fit-cover" />
                                                        <button 
                                                            onClick={() => removeImage(idx)}
                                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 p-1 rounded-circle d-flex align-items-center justify-content-center shadow"
                                                            style={{ width: '20px', height: '20px' }}
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {/* Checkmarks */}
                                                <div className="d-flex flex-column justify-content-center ms-auto text-end small text-white-50">
                                                    <div className={`d-flex align-items-center justify-content-end gap-2 ${formData.workspaceImages.length > 0 ? 'text-success fw-bold' : ''}`}><CheckCircle size={14}/> Workspace</div>
                                                    <div className={`d-flex align-items-center justify-content-end gap-2 ${formData.workspaceImages.length > 1 ? 'text-success fw-bold' : ''}`}><CheckCircle size={14}/> Tools</div>
                                                    <div className={`d-flex align-items-center justify-content-end gap-2 ${formData.workspaceImages.length > 2 ? 'text-success fw-bold' : ''}`}><CheckCircle size={14}/> In-Progress</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {error && <div className="text-danger small p-3 rounded-4 bg-danger bg-opacity-10 border border-danger border-opacity-25">{error}</div>}

                                    <div className="d-flex gap-3 mt-4">
                                        <button type="button" onClick={() => setStep(1)} className="btn btn-outline-light border-opacity-20 rounded-pill py-3 px-4 fw-bold hover-bg-white-10 transition-all">
                                            Back
                                        </button>
                                        <button type="button" onClick={nextStep} className="btn btn-warning rounded-pill py-3 px-5 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2 hover-scale transition-transform ms-auto">
                                            Next: The Covenant <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: THE COVENANT */}
                            {step === 3 && (
                                <motion.div key="step3" variants={fadeIn} initial="initial" animate="animate" exit="exit" className="d-flex flex-column gap-4">
                                    <div className="mb-2">
                                        <div className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-1 rounded-pill bg-white bg-opacity-5 border border-white-10 small text-uppercase fw-bold ls-2 text-white-50">
                                            Step 3 of 3
                                        </div>
                                        <h2 className="display-6 fw-bold mb-2">The Collective Covenant</h2>
                                        <p className="text-white-50">Commit to the ethos of The Local Craft.</p>
                                    </div>

                                    <div className="p-4 rounded-4 bg-white bg-opacity-5 border border-white-10">
                                        <label className="form-label fw-bold mb-3 d-block">Production Capacity</label>
                                        <div className="d-flex flex-column gap-2">
                                            {['Solo Maker', 'Small Team (2-5)', 'Workshop (5+)'].map((cap) => (
                                                <label key={cap} className={`d-flex align-items-center gap-3 p-3 rounded-3 cursor-pointer transition-all border ${formData.capacity === cap ? 'border-warning bg-warning bg-opacity-10 text-warning' : 'border-white-10 hover-bg-white-5 text-white'}`}>
                                                    <input type="radio" name="capacity" value={cap} checked={formData.capacity === cap} onChange={handleChange} className="form-check-input mt-0 bg-transparent border-white-50" />
                                                    <span className="fw-bold">{cap}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-4 bg-white bg-opacity-5 border border-warning border-opacity-25 position-relative overflow-hidden">
                                        <div className="position-absolute top-0 end-0 p-4 opacity-10"><CheckCircle size={100} /></div>
                                        <label className="d-flex align-items-start gap-3 cursor-pointer position-relative z-1">
                                            <input type="checkbox" name="fairTradePledge" checked={formData.fairTradePledge} onChange={handleChange} className="form-check-input mt-1 shadow-none rounded bg-transparent border-white-50 p-2" style={{ width: '24px', height: '24px' }} />
                                            <div>
                                                <h5 className="fw-bold text-white mb-1">The Fair Trade Pledge</h5>
                                                <p className="small text-white-50 mb-0">I vow to uphold ethical labor practices, ensuring fair wages and safe working conditions for anyone involved in my production. I swear that my work is entirely handmade and not mass-produced.</p>
                                                <button type="button" onClick={() => setShowTerms(!showTerms)} className="btn btn-link text-warning p-0 text-decoration-none small mt-2 fw-bold">Read Full Covenant Details</button>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Digital Signature */}
                                    <div>
                                        <label className="form-label small text-white-50 text-uppercase ls-1">Digital Signature *</label>
                                        <p className="text-white-50 small mb-2">Type your full name to formally sign the covenant.</p>
                                        <input 
                                            type="text" 
                                            name="signature" 
                                            value={formData.signature} 
                                            onChange={handleChange} 
                                            className="form-control bg-transparent border-0 border-bottom border-white-50 text-warning shadow-none px-0 py-3 fs-3" 
                                            style={{ fontFamily: "'Brush Script MT', cursive, serif" }}
                                            placeholder="Sign here..." 
                                        />
                                    </div>

                                    {error && <div className="text-danger small p-3 rounded-4 bg-danger bg-opacity-10 border border-danger border-opacity-25">{error}</div>}

                                    <div className="d-flex gap-3 mt-4 pt-4 border-top border-white-10">
                                        <button type="button" onClick={() => setStep(2)} className="btn btn-outline-light border-opacity-20 rounded-pill py-3 px-4 fw-bold hover-bg-white-10 transition-all">
                                            Back
                                        </button>
                                        <button type="button" onClick={handleSubmit} disabled={loading} className="btn btn-warning rounded-pill py-3 px-5 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2 hover-scale transition-transform ms-auto">
                                            {loading ? <Loader size={20} className="spin" /> : <>Join The Collective <CheckCircle size={18} /></>}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: EPILOGUE (SUCCESS) */}
                            {step === 4 && (
                                <motion.div key="step4" variants={fadeIn} initial="initial" animate="animate" exit="exit" className="d-flex flex-column justify-content-center align-items-center text-center py-5 h-100">
                                    <div className="position-relative mb-5">
                                        <div className="position-absolute w-100 h-100 bg-warning rounded-circle blur-xl opacity-25 pulse-animation"></div>
                                        <div className="p-4 rounded-circle border border-warning border-opacity-50 bg-warning bg-opacity-10 text-warning position-relative z-1 shadow-lg backdrop-blur-md">
                                            <CheckCircle size={64} />
                                        </div>
                                    </div>
                                    <h1 className="display-4 fw-bold mb-3">Application Received.</h1>
                                    <p className="lead text-white-50 mb-5" style={{ maxWidth: '500px' }}>
                                        Thank you for sharing your story, <span className="text-white fw-bold">{formData.fullName}</span>. Our curation team reviews every application to ensure alignment with our quality and fair-trade standards.
                                    </p>
                                    
                                    <div className="w-100 text-start p-4 rounded-4 bg-white bg-opacity-5 border border-white-10 mb-5 shadow-lg backdrop-blur-md" style={{ maxWidth: '400px' }}>
                                        <h6 className="fw-bold text-white-50 text-uppercase ls-1 mb-4 text-center">Next Steps Timeline</h6>
                                        
                                        <div className="d-flex align-items-start gap-3 mb-4">
                                            <div className="mt-1 text-warning"><CheckCircle size={20} /></div>
                                            <div>
                                                <h6 className="fw-bold mb-1">Application Submitted</h6>
                                                <p className="small text-white-50 mb-0">Your profile and evidence have been securely transmitted.</p>
                                            </div>
                                        </div>
                                        
                                        <div className="d-flex align-items-start gap-3 mb-4">
                                            <div className="mt-1 text-white-50"><Loader size={20} className="spin" /></div>
                                            <div>
                                                <h6 className="fw-bold mb-1">Curation Review</h6>
                                                <p className="small text-warning mb-0">Expected in 3-5 business days</p>
                                            </div>
                                        </div>
                                        
                                        <div className="d-flex align-items-start gap-3 opacity-50">
                                            <div className="mt-1 text-white-50"><CheckCircle size={20} /></div>
                                            <div>
                                                <h6 className="fw-bold mb-1">Welcome to The Local Craft</h6>
                                                <p className="small text-white-50 mb-0">Global storefront activated.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={() => router.push('/dashboard/artisan')} className="btn btn-outline-warning rounded-pill py-3 px-5 fw-bold shadow-lg hover-bg-warning transition-all">
                                        Enter Your Studio (Pending View)
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Terms Modal / Drawer Overlay */}
                <AnimatePresence>
                    {showTerms && (
                        <motion.div 
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="position-absolute bottom-0 start-0 w-100 bg-dark border-top border-white-10 shadow-lg p-5 z-3 overflow-auto"
                            style={{ height: "80%" }}
                        >
                            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-white-10">
                                <h3 className="fw-bold text-warning mb-0">The Covenant</h3>
                                <button onClick={() => setShowTerms(false)} className="btn btn-link text-white-50 p-0 hover-text-white"><X size={24} /></button>
                            </div>
                            <div className="text-white-70" style={{ lineHeight: '1.8' }}>
                                <h5 className="fw-bold text-white mt-4">1. The "Handmade" Guarantee & Absolute Authenticity</h5>
                                <p>You represent and warrant that every piece listed is crafted by hand, utilizing traditional techniques by you or your direct studio. Mass-produced, factory-made, or drop-shipped goods are a severe violation of our core ethos.</p>
                                
                                <h5 className="fw-bold text-white mt-4">2. Fair Trade & Ethical Labor</h5>
                                <p>You pledge to adhere to the highest ethical labor practices. If you employ a team, you commit to paying fair, livable wages and ensuring safe working conditions. The use of child or forced labor anywhere in your supply chain is grounds for immediate termination.</p>
                                
                                <h5 className="fw-bold text-white mt-4">3. Content, Imagery, and Intellectual Property</h5>
                                <p>By uploading your portfolio and story, you grant The Local Craft a worldwide license to display and distribute this content to elevate your brand across our marketing channels. You retain full ownership of your physical designs.</p>
                                
                                <button onClick={() => { setShowTerms(false); setFormData(p => ({ ...p, fairTradePledge: true })) }} className="btn btn-warning rounded-pill py-3 px-5 fw-bold mt-5 w-100 shadow-lg">
                                    I Agree to the Covenant
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}
