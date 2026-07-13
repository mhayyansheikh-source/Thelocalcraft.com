"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { collection, query, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { motion, AnimatePresence } from 'framer-motion'
import { Command } from 'cmdk'
import { Search, Filter, CheckCircle, XCircle, PauseCircle, Trash2, User, MapPin, Briefcase, ChevronRight, ChevronLeft, Check, X } from 'lucide-react'
import Link from 'next/link'

// Define the Artisan type based on the new schema
type ArtisanProfile = {
    id: string
    full_name: string
    specialty: string
    location: string
    status: 'pending' | 'active' | 'frozen' | 'rejected'
    portfolio_url?: string
    created_at: string
    onboarding_evidence?: {
        maker_story: string
        production_philosophy: string
        workspace_images: string[]
    }
    covenant_signature?: {
        capacity: string
        fair_trade_pledge: boolean
        signature_name: string
        signed_at: string
    }
}

export default function AdminArtisanMissionControl() {
    const [artisans, setArtisans] = useState<ArtisanProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [cmdOpen, setCmdOpen] = useState(false)

    // Listen to artisans collection
    useEffect(() => {
        const q = query(collection(db, 'artisans'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: ArtisanProfile[] = []
            snapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as ArtisanProfile)
            })
            setArtisans(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
            setLoading(false)
        }, (error) => {
            console.error("Error fetching artisans:", error)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    // Cmd+K listener
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setCmdOpen((open) => !open)
            }
        }
        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    const selectedArtisan = artisans.find(a => a.id === selectedId)

    const filteredArtisans = useMemo(() => {
        return artisans.filter(a => {
            const matchesSearch = a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  a.specialty.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === 'all' || a.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [artisans, searchQuery, statusFilter])

    const updateStatus = async (id: string, newStatus: ArtisanProfile['status']) => {
        try {
            await updateDoc(doc(db, 'artisans', id), { status: newStatus })
            // Note: Also update 'profiles' collection for consistency in a real app
            await updateDoc(doc(db, 'profiles', id), { status: newStatus })
            setCmdOpen(false)
        } catch (error) {
            console.error("Error updating status:", error)
        }
    }

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'pending': return <span className="badge bg-warning text-dark px-2 py-1 rounded-pill small">Pending Review</span>
            case 'active': return <span className="badge bg-success px-2 py-1 rounded-pill small">Active</span>
            case 'frozen': return <span className="badge bg-secondary px-2 py-1 rounded-pill small">Frozen</span>
            case 'rejected': return <span className="badge bg-danger px-2 py-1 rounded-pill small">Rejected</span>
            default: return null
        }
    }

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column" style={{ maxHeight: '100vh' }}>
            
            {/* Header */}
            <header className="p-4 border-bottom border-white-10 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                    <Link href="/dashboard/admin" className="btn btn-dark rounded-circle p-2 d-flex align-items-center justify-content-center text-white-50 hover-text-white transition-all border border-white-10 hover-bg-white-10">
                        <X size={20} />
                    </Link>
                    <div>
                        <h1 className="h4 fw-bold mb-1 text-uppercase text-white ls-1" style={{ letterSpacing: "1px" }}>Curation Mission Control</h1>
                        <p className="text-white-50 small mb-0">Review and manage The Local Craft artisan collective.</p>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <div className="d-none d-md-flex bg-white bg-opacity-5 border border-white-10 rounded-pill px-3 py-1 align-items-center gap-2 small text-white-50">
                        Press <kbd className="bg-white bg-opacity-10 rounded px-1 text-white border-0">⌘</kbd> <kbd className="bg-white bg-opacity-10 rounded px-1 text-white border-0">K</kbd> for command palette
                    </div>
                </div>
            </header>

            <div className="d-flex flex-grow-1 overflow-hidden position-relative">
                {/* Sidebar List */}
                <div className={`col-12 col-lg-4 border-end border-white-10 d-flex flex-column h-100 bg-black bg-opacity-25 ${selectedId ? 'd-none d-lg-flex' : 'd-flex'}`}>
                    <div className="p-3 border-bottom border-white-10">
                        <div className="input-group p-1 rounded-3 bg-white bg-opacity-5 border border-white-10 mb-2">
                            <span className="input-group-text bg-transparent border-0 text-white-50"><Search size={16} /></span>
                            <input 
                                type="text" 
                                className="form-control bg-transparent border-0 text-white shadow-none small" 
                                placeholder="Search artisans..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="d-flex gap-2 overflow-x-auto text-nowrap pb-2 custom-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                            {['all', 'pending', 'active', 'frozen'].map(f => (
                                <button 
                                    key={f} 
                                    onClick={() => setStatusFilter(f)}
                                    className={`btn btn-sm rounded-pill px-3 py-1 text-capitalize flex-shrink-0 ${statusFilter === f ? 'btn-warning text-dark fw-bold' : 'btn-outline-light border-opacity-10 text-white-50'}`}
                                    style={{ fontSize: '11px' }}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex-grow-1 overflow-auto">
                        {loading ? (
                            <div className="p-5 text-center text-white-50 small">Loading collective...</div>
                        ) : filteredArtisans.length === 0 ? (
                            <div className="p-5 text-center text-white-50 small">No artisans found.</div>
                        ) : (
                            <div className="list-group list-group-flush">
                                {filteredArtisans.map((artisan) => (
                                    <button 
                                        key={artisan.id}
                                        onClick={() => setSelectedId(artisan.id)}
                                        className={`list-group-item list-group-item-action bg-transparent border-bottom border-white-10 p-3 transition-all ${selectedId === artisan.id ? 'bg-white bg-opacity-5' : 'hover-bg-white-5'}`}
                                    >
                                        <div className="d-flex justify-content-between align-items-start mb-1">
                                            <h6 className="fw-bold text-white mb-0">{artisan.full_name}</h6>
                                            {getStatusBadge(artisan.status)}
                                        </div>
                                        <div className="text-white-50 small d-flex align-items-center gap-2 mb-1">
                                            <Briefcase size={12} /> {artisan.specialty}
                                        </div>
                                        <div className="text-white-50 small d-flex align-items-center gap-2">
                                            <MapPin size={12} /> {artisan.location}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Review Theater (Main Detail View) */}
                <div className={`col-12 col-lg-8 h-100 overflow-auto bg-dark ${!selectedId ? 'd-none d-lg-block' : 'd-block'}`}>
                    <AnimatePresence mode="wait">
                        {selectedArtisan ? (
                            <motion.div 
                                key={selectedArtisan.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-4 p-lg-5"
                            >
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4 pb-4 border-bottom border-white-10 gap-3">
                                    <div>
                                        <button className="btn btn-link text-white-50 p-0 mb-3 d-lg-none d-flex align-items-center gap-1 text-decoration-none" onClick={() => setSelectedId(null)}>
                                            <ChevronLeft size={16} /> Back to List
                                        </button>
                                        <div className="d-flex align-items-center gap-3 mb-2">
                                            <h2 className="display-6 fw-bold text-white mb-0">{selectedArtisan.full_name}</h2>
                                            {getStatusBadge(selectedArtisan.status)}
                                        </div>
                                        <div className="d-flex align-items-center gap-4 text-white-50">
                                            <span className="d-flex align-items-center gap-1"><Briefcase size={16} /> {selectedArtisan.specialty}</span>
                                            <span className="d-flex align-items-center gap-1"><MapPin size={16} /> {selectedArtisan.location}</span>
                                            {selectedArtisan.portfolio_url && (
                                                <a href={selectedArtisan.portfolio_url} target="_blank" rel="noreferrer" className="text-warning text-decoration-none">View Portfolio</a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button onClick={() => updateStatus(selectedArtisan.id, 'active')} className="btn btn-sm btn-success rounded px-3 fw-bold shadow-sm d-flex align-items-center gap-2">
                                            <CheckCircle size={16} /> Approve
                                        </button>
                                        <button onClick={() => updateStatus(selectedArtisan.id, 'rejected')} className="btn btn-sm btn-outline-danger border-opacity-50 rounded px-3 d-flex align-items-center gap-2">
                                            <XCircle size={16} /> Reject
                                        </button>
                                        <button onClick={() => updateStatus(selectedArtisan.id, 'frozen')} className="btn btn-sm btn-outline-secondary rounded px-3 d-flex align-items-center gap-2">
                                            <PauseCircle size={16} /> Freeze
                                        </button>
                                    </div>
                                </div>

                                {selectedArtisan.onboarding_evidence ? (
                                    <div className="row g-5">
                                        <div className="col-12 col-xl-7">
                                            <h5 className="fw-bold text-warning mb-3">Maker Story</h5>
                                            <div className="p-4 rounded-4 bg-white bg-opacity-5 border border-white-10 mb-4">
                                                <p className="text-white-70 lh-lg fst-italic mb-0">"{selectedArtisan.onboarding_evidence.maker_story}"</p>
                                            </div>

                                            <h5 className="fw-bold text-warning mb-3">Production Philosophy</h5>
                                            <div className="p-4 rounded-4 bg-white bg-opacity-5 border border-white-10 mb-4">
                                                <p className="text-white-70 lh-lg mb-0">{selectedArtisan.onboarding_evidence.production_philosophy}</p>
                                            </div>
                                            
                                            {selectedArtisan.covenant_signature && (
                                                <>
                                                    <h5 className="fw-bold text-warning mb-3">The Covenant</h5>
                                                    <div className="p-4 rounded-4 border border-warning border-opacity-25 bg-warning bg-opacity-10 position-relative overflow-hidden">
                                                        <div className="d-flex align-items-start gap-3 mb-3">
                                                            <CheckCircle className="text-warning mt-1" size={20} />
                                                            <div>
                                                                <span className="fw-bold d-block">Fair Trade Pledge Verified</span>
                                                                <span className="small text-white-50">Capacity: {selectedArtisan.covenant_signature.capacity}</span>
                                                            </div>
                                                        </div>
                                                        <div className="border-top border-warning border-opacity-25 pt-3">
                                                            <span className="small text-white-50 text-uppercase ls-1">Digital Signature</span>
                                                            <div className="fs-3 text-warning mt-1" style={{ fontFamily: "'Brush Script MT', cursive, serif" }}>
                                                                {selectedArtisan.covenant_signature.signature_name}
                                                            </div>
                                                            <div className="small text-white-50 mt-1">Signed: {new Date(selectedArtisan.covenant_signature.signed_at).toLocaleString()}</div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="col-12 col-xl-5">
                                            <h5 className="fw-bold text-warning mb-3">Workspace Evidence</h5>
                                            <div className="d-flex flex-column gap-3">
                                                {selectedArtisan.onboarding_evidence.workspace_images?.map((url, i) => (
                                                    <div key={i} className="position-relative rounded-4 overflow-hidden border border-white-10 group" style={{ aspectRatio: '16/9' }}>
                                                        <img src={url} alt={`Evidence ${i+1}`} className="w-100 h-100 object-fit-cover transition-transform duration-500 hover-scale-105" />
                                                    </div>
                                                ))}
                                                {(!selectedArtisan.onboarding_evidence.workspace_images || selectedArtisan.onboarding_evidence.workspace_images.length === 0) && (
                                                    <div className="p-5 text-center bg-white bg-opacity-5 rounded-4 border border-white-10 text-white-50">
                                                        No images provided.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-5 text-center text-white-50">
                                        Legacy profile. Detailed evidence not available.
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="h-100 d-flex flex-column justify-content-center align-items-center text-white-50">
                                <Search size={48} className="mb-3 opacity-25" />
                                <h4 className="fw-bold mb-1">Review Theater</h4>
                                <p className="small">Select an artisan from the list to view their full application.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* CMDK Command Palette */}
            <Command.Dialog 
                open={cmdOpen} 
                onOpenChange={setCmdOpen}
                label="National Command Menu"
                className="position-fixed top-50 start-50 translate-middle w-100 bg-dark rounded-4 shadow-lg border border-white-20 overflow-hidden z-3"
                style={{ maxWidth: '600px', transform: 'translate(-50%, -50%)' }}
            >
                <div className="d-flex align-items-center p-3 border-bottom border-white-10">
                    <Search className="text-white-50 me-3" size={20} />
                    <Command.Input 
                        placeholder="Search artisans or actions..." 
                        className="bg-transparent border-0 text-white flex-grow-1 shadow-none fs-5 outline-none"
                        style={{ outline: 'none' }}
                    />
                </div>
                <Command.List className="p-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <Command.Empty className="p-4 text-center text-white-50 small">No results found.</Command.Empty>
                    
                    {selectedArtisan && (
                        <Command.Group heading={`Actions for ${selectedArtisan.full_name}`} className="text-white-50 small fw-bold px-2 py-2 text-uppercase ls-1">
                            <Command.Item onSelect={() => updateStatus(selectedArtisan.id, 'active')} className="p-2 rounded text-white d-flex align-items-center gap-2 cursor-pointer hover-bg-white-10">
                                <CheckCircle size={16} className="text-success" /> Approve Application
                            </Command.Item>
                            <Command.Item onSelect={() => updateStatus(selectedArtisan.id, 'frozen')} className="p-2 rounded text-white d-flex align-items-center gap-2 cursor-pointer hover-bg-white-10">
                                <PauseCircle size={16} className="text-warning" /> Freeze Account
                            </Command.Item>
                            <Command.Item onSelect={() => updateStatus(selectedArtisan.id, 'rejected')} className="p-2 rounded text-white d-flex align-items-center gap-2 cursor-pointer hover-bg-white-10">
                                <XCircle size={16} className="text-danger" /> Reject Application
                            </Command.Item>
                        </Command.Group>
                    )}

                    <Command.Group heading="Jump To Artisan" className="text-white-50 small fw-bold px-2 py-2 text-uppercase ls-1 mt-2">
                        {artisans.map(a => (
                            <Command.Item 
                                key={a.id} 
                                onSelect={() => { setSelectedId(a.id); setCmdOpen(false) }}
                                className="p-2 rounded text-white d-flex justify-content-between align-items-center cursor-pointer hover-bg-white-10"
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <User size={16} className="text-white-50" /> {a.full_name}
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <span className="small text-white-50">{a.specialty}</span>
                                    {a.status === 'pending' && <span className="badge bg-warning text-dark px-1 py-0 rounded">Pending</span>}
                                </div>
                            </Command.Item>
                        ))}
                    </Command.Group>
                </Command.List>
            </Command.Dialog>
            
            {/* CMDK Dialog Overlay (requires global styles to dim background, handled locally via fixed positioned div if needed) */}
            {cmdOpen && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-75 z-2" 
                    onClick={() => setCmdOpen(false)}
                />
            )}
            
        </div>
    )
}
