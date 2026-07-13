"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Flame, Lock, Bell, AlertTriangle } from 'lucide-react'

export function VillageDrops() {
    const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 59 })

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev
                if (seconds > 0) seconds--
                else {
                    seconds = 59
                    if (minutes > 0) minutes--
                    else {
                        minutes = 59
                        if (hours > 0) hours--
                    }
                }
                return { hours, minutes, seconds }
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="animate-fade-in">
            <header className="mb-5 d-flex justify-content-between align-items-end flex-wrap gap-3">
                <div>
                    <h2 className="display-4 fw-bold mb-2">Village <span className="text-warning">Drops.</span></h2>
                    <p className="text-white-50 lead mb-0">Exclusive, highly limited batches from master artisans.</p>
                </div>
                <div className="bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-lg">
                    <Flame size={18} className="animate-pulse" />
                    <span className="fw-bold small">High Demand Expected</span>
                </div>
            </header>
            
            <div className="position-relative rounded-5 overflow-hidden border border-white-10" style={{ minHeight: '600px' }}>
                {/* Background Image with heavy blur */}
                <div 
                    className="position-absolute top-0 start-0 w-100 h-100" 
                    style={{ 
                        backgroundImage: 'url("https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(20px) brightness(0.4)',
                        transform: 'scale(1.1)'
                    }}
                ></div>

                <div className="position-relative z-1 d-flex flex-column align-items-center justify-content-center h-100 p-5 text-center" style={{ minHeight: '600px' }}>
                    <Lock size={48} className="text-white-50 mb-4" />
                    <h3 className="display-5 fw-bold text-white mb-2">The "Atlas" Collection</h3>
                    <p className="text-white-50 lead mb-5 max-w-md mx-auto">
                        A once-in-a-year batch of 50 pure silk rugs woven by the master artisans of the Atlas Mountains. 
                    </p>

                    <div className="d-flex gap-3 mb-5">
                        <div className="bg-black bg-opacity-50 border border-white-10 rounded-4 p-3 min-w-[100px]" style={{ backdropFilter: 'blur(10px)' }}>
                            <div className="display-4 fw-bold text-white mb-1">{String(timeLeft.hours).padStart(2, '0')}</div>
                            <div className="text-white-50 small text-uppercase tracking-wider">Hours</div>
                        </div>
                        <div className="bg-black bg-opacity-50 border border-white-10 rounded-4 p-3 min-w-[100px]" style={{ backdropFilter: 'blur(10px)' }}>
                            <div className="display-4 fw-bold text-white mb-1">{String(timeLeft.minutes).padStart(2, '0')}</div>
                            <div className="text-white-50 small text-uppercase tracking-wider">Mins</div>
                        </div>
                        <div className="bg-black bg-opacity-50 border border-white-10 rounded-4 p-3 min-w-[100px]" style={{ backdropFilter: 'blur(10px)' }}>
                            <div className="display-4 fw-bold text-white mb-1">{String(timeLeft.seconds).padStart(2, '0')}</div>
                            <div className="text-white-50 small text-uppercase tracking-wider">Secs</div>
                        </div>
                    </div>

                    <button className="btn btn-light rounded-pill px-5 py-3 fw-bold fs-5 shadow-lg d-flex align-items-center gap-2 hover-scale transition-all">
                        <Bell size={20} /> Notify Me on Drop
                    </button>
                    
                    <div className="mt-4 text-warning small d-flex align-items-center justify-content-center gap-1">
                        <AlertTriangle size={14} /> Allocation limited to 2 units per distributor.
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
