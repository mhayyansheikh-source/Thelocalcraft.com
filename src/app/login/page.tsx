"use client"

import React, { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { auth, db } from "@/lib/firebase/config"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import {
    User,
    Lock,
    Sparkles,
    ArrowRight,
    Hammer,
    ChevronRight,
    LogIn,
    Shield
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [role, setRole] = useState<"customer" | "artisan" | "admin">("customer")
    const [isRegistering, setIsRegistering] = useState(false)
    const router = useRouter()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isRegistering && role === "customer") {
                // Customer Sign Up
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                const user = userCredential.user

                // Create profile manually for Firebase
                await setDoc(doc(db, "profiles", user.uid), {
                    id: user.uid,
                    role: "customer",
                    email: user.email,
                    created_at: new Date().toISOString(),
                    status: 'active'
                })

                // Triggers automatically assign 'customer' role
                router.push("/") // Redirect to home on success
                return
            }

            // Standard Sign In
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // Fetch the user's role from the profiles table
            if (user) {
                const profileDoc = await getDoc(doc(db, "profiles", user.uid))

                if (!profileDoc.exists() && user.email === 'muhammadnumanlatif@gmail.com') {
                    // Auto-bootstrap the admin account
                    await setDoc(doc(db, "profiles", user.uid), {
                        id: user.uid,
                        role: "admin",
                        status: "approved",
                        email: user.email,
                        full_name: "Super Admin",
                        created_at: new Date().toISOString()
                    });
                    router.push("/dashboard/admin");
                    return;
                }

                if (profileDoc.exists()) {
                    const profile = profileDoc.data()
                    const actualRole = profile.role

                    if (role === 'admin' && actualRole !== 'admin') {
                        // User tried to login as Admin but isn't one
                        await signOut(auth)
                        throw new Error("Unauthorized: You do not have administrator privileges.")
                    }

                    if (role === 'artisan' && actualRole !== 'artisan' && actualRole !== 'admin') {
                        // Ensure they are at least an artisan
                        await signOut(auth)
                        throw new Error("Unauthorized: You are not registered as an Artisan.")
                    }

                    // On success, redirect to appropriate dashboard based on actual role
                    if (actualRole === 'admin') router.push("/dashboard/admin")
                    else if (actualRole === 'artisan') router.push("/dashboard/artisan")
                    else router.push("/") // Customer goes home

                    return
                }
            }

            // Fallback
            router.push("/")

        } catch (err: any) {
            setError(err.message || "Authentication failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column overflow-hidden">
            <Navbar />

            <main className="container flex-grow-1 d-flex flex-column align-items-center justify-content-center py-5 mt-5 pt-5">
                <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(circle at 10% 10%, rgba(255,193,7,0.15) 0%, transparent 40%)",
                        zIndex: 0
                    }}
                />

                <div className="row w-100 justify-content-center position-relative z-1">
                    <div className="col-lg-5 col-md-8">
                        {/* Decorative elements */}
                        <div className="text-center mb-5 animate-fade-in">
                            <div className="d-inline-flex align-items-center gap-2 mb-3 px-3 py-1 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-10 small text-uppercase fw-bold ls-2 text-warning">
                                {role === 'admin' ? <Shield size={14} /> : <Sparkles size={14} />} {role === 'admin' ? 'System Administrator' : role === 'artisan' ? 'Artisan Hub' : 'Customer Hub'}
                            </div>
                            <h1 className="display-4 fw-bold mb-2">Heritage Portal</h1>
                            <p className="text-white-50">
                                {role === 'admin' ? 'Manage national marketplace operations.' : role === 'artisan' ? 'Manage your craft, stories, and national presence.' : 'Access your heritage orders and saved items.'}
                            </p>
                        </div>

                        {/* Login Glassmorphic Card */}
                        <div className="p-5 rounded-5 border border-white border-opacity-10 bg-white bg-opacity-5 backdrop-blur-xl shadow-2xl animate-fade-in-up">
                            {/* Role Toggle Selector */}
                            <div className="d-flex p-1 bg-dark bg-opacity-50 rounded-pill mb-4 border border-white border-opacity-10 shadow-inner">
                                <button
                                    className={`btn flex-grow-1 rounded-pill fw-bold transition-all ${role === 'customer' ? 'btn-warning text-dark shadow-sm' : 'btn-link text-white-50 text-decoration-none'}`}
                                    onClick={() => { setRole("customer"); setIsRegistering(false) }}
                                >
                                    Customer
                                </button>
                                <button
                                    className={`btn flex-grow-1 rounded-pill fw-bold transition-all ${role === 'artisan' ? 'btn-warning text-dark shadow-sm' : 'btn-link text-white-50 text-decoration-none'}`}
                                    onClick={() => { setRole("artisan"); setIsRegistering(false) }}
                                >
                                    Artisan
                                </button>
                                <button
                                    className={`btn flex-grow-1 rounded-pill fw-bold transition-all ${role === 'admin' ? 'btn-warning text-dark shadow-sm' : 'btn-link text-white-50 text-decoration-none'}`}
                                    onClick={() => { setRole("admin"); setIsRegistering(false) }}
                                >
                                    Administrator
                                </button>
                            </div>

                            <form onSubmit={handleAuth} className="d-flex flex-column gap-4">
                                <div>
                                    <label className="form-label small text-uppercase text-white-50 ls-1 mb-2 fw-bold">
                                        {role === 'admin' ? 'Admin Identity (Email)' : role === 'artisan' ? 'Artisan Identity (Email)' : 'Email Address'}
                                    </label>
                                    <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white border-opacity-10 shadow-inner group-focus-within:border-warning group-focus-within:border-opacity-50 transition-all">
                                        <span className="input-group-text bg-transparent border-0 text-white-50 ps-3">
                                            <User size={18} />
                                        </span>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="form-control bg-transparent border-0 text-white py-3 outline-none shadow-none"
                                            placeholder={role === 'admin' ? 'admin@thelocalcrafts.com' : role === 'artisan' ? 'master@thelocalcrafts.com' : 'you@example.com'}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="d-flex justify-content-between">
                                        <label className="form-label small text-uppercase text-white-50 ls-1 mb-2 fw-bold">
                                            {role === 'admin' ? 'Admin Key (Password)' : role === 'artisan' ? 'Heritage Key (Password)' : 'Secure Password'}
                                        </label>
                                        <Link href="/forgot" className="small text-warning text-decoration-none hover-underline">Forgotten?</Link>
                                    </div>
                                    <div className="input-group p-1 rounded-4 bg-dark bg-opacity-50 border border-white border-opacity-10 shadow-inner group-focus-within:border-warning group-focus-within:border-opacity-50 transition-all">
                                        <span className="input-group-text bg-transparent border-0 text-white-50 ps-3">
                                            <Lock size={18} />
                                        </span>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="form-control bg-transparent border-0 text-white py-3 outline-none shadow-none"
                                            placeholder={role === 'admin' ? 'Your admin access key' : role === 'artisan' ? 'Your secure heritage key' : 'Create or enter password'}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-4 bg-danger bg-opacity-10 border border-danger border-opacity-20 text-danger small d-flex align-items-center gap-2">
                                        <Shield size={16} /> {error}
                                    </div>
                                )}

                                <button
                                    className="btn btn-warning rounded-pill py-3 fw-bold fs-5 shadow-lg d-flex align-items-center justify-content-center gap-2 mt-2 hover-scale transition-transform"
                                    disabled={loading}
                                    type="submit"
                                >
                                    {loading ? (
                                        <div className="spinner-border spinner-border-sm text-dark" role="status" />
                                    ) : (
                                        <>{isRegistering ? "Create Account" : "Enter Portal"} <LogIn size={20} /></>
                                    )}
                                </button>
                            </form>

                            {/* Options to Sign Up if Customer, or to Apply if Artisan */}
                            {role === 'customer' && (
                                <div className="mt-4 text-center">
                                    <p className="text-white-50 small mb-0">
                                        {isRegistering ? "Already have an account?" : "New to the platform?"}
                                        <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="btn btn-link text-warning p-0 ms-2 fw-bold text-decoration-none hover-underline">
                                            {isRegistering ? "Sign in instead" : "Create an account"}
                                        </button>
                                    </p>
                                </div>
                            )}

                            {role === 'artisan' && (
                                <div className="mt-5 pt-4 border-top border-white border-opacity-10 text-center">
                                    <p className="text-white-50 small mb-4">Want to become a master on our platform?</p>
                                    <Link href="/apply" className="btn btn-outline-light rounded-pill px-4 py-2 border-opacity-20 d-inline-flex align-items-center gap-2 hover-bg-white hover-text-dark transition-all text-decoration-none">
                                        Become an Artisan <ArrowRight size={16} />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Security Disclaimer */}
                        <div className="mt-5 text-center text-white-50 small opacity-50 px-4">
                            Protected by heritage and technology. Our AI signature platform ensures and protects the value of your craftsmanship.
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
