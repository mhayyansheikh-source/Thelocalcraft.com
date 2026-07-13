"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessagesSquare, Handshake, ShieldCheck, DollarSign, ChevronLeft } from 'lucide-react'

import { useCurrency } from '@/context/CurrencyContext'

export function B2BNegotiationRoom() {
    const { formatPrice } = useCurrency()
    const [activeDeal, setActiveDeal] = useState<any>(null)

    const mockupDeals = [
        { id: 1, buyer: 'Khaadi Home', volume: 500, price: 12000, status: 'negotiating', lastMessage: "Can we adjust the price per unit to Rs 11,000?" },
        { id: 2, buyer: 'Habitt', volume: 2000, price: 8500, status: 'approved', lastMessage: "Deal signed. Awaiting dispatch." },
    ]

    return (
        <div className="w-100 pb-5">
            <header className="mb-5 d-flex flex-wrap align-items-end justify-content-between gap-4 animate-fade-in">
                <div>
                    <span className="badge bg-primary text-white mb-2 rounded-pill px-3 py-2 fw-bold letter-spacing-1 shadow-sm">B2B NEGOTIATION ROOM</span>
                    <h2 className="fw-bolder display-6 mb-1 text-white text-shadow">National Wholesale</h2>
                    <p className="text-white-50 mb-0 fs-5">Manage bulk orders, negotiate prices, and secure enterprise contracts.</p>
                </div>
            </header>

            <div className="row g-4 h-100 position-relative">
                <div className={`col-12 col-lg-4 ${activeDeal ? 'd-none d-lg-block' : 'd-block'}`}>
                    <div className="card bg-dark bg-opacity-50 border-white-10 rounded-4 backdrop-blur-md h-100">
                        <div className="card-header border-bottom border-white-10 bg-transparent p-4">
                            <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2">
                                <Handshake size={20} className="text-primary" /> Active Negotiations
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            {mockupDeals.map(deal => (
                                <div 
                                    key={deal.id} 
                                    className={`p-4 border-bottom border-white-10 cursor-pointer transition-all ${activeDeal?.id === deal.id ? 'bg-primary bg-opacity-10' : 'hover-bg-white-5'}`}
                                    onClick={() => setActiveDeal(deal)}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="fw-bold text-white mb-0">{deal.buyer}</h6>
                                        <span className={`badge ${deal.status === 'negotiating' ? 'bg-warning text-dark' : 'bg-success text-white'}`}>
                                            {deal.status}
                                        </span>
                                    </div>
                                    <p className="text-white-50 small mb-0 truncate-1">{deal.lastMessage}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className={`col-12 col-lg-8 ${!activeDeal ? 'd-none d-lg-block' : 'd-block'}`}>
                    {activeDeal ? (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="card bg-dark bg-opacity-50 border-white-10 rounded-4 backdrop-blur-md h-100"
                        >
                            <div className="card-header border-bottom border-white-10 bg-transparent p-4">
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                    <div>
                                        <button className="btn btn-link text-white-50 p-0 mb-2 d-lg-none d-flex align-items-center gap-1 text-decoration-none" onClick={() => setActiveDeal(null)}>
                                            <ChevronLeft size={16} /> Back to Deals
                                        </button>
                                        <h5 className="fw-bold text-white mb-1">{activeDeal.buyer}</h5>
                                        <p className="text-white-50 small mb-0">Volume: {activeDeal.volume} units | Target Price: {formatPrice(activeDeal.price)}/unit</p>
                                    </div>
                                    <button className="btn btn-success rounded-pill fw-bold px-4 shadow-lg d-flex align-items-center gap-2">
                                        <ShieldCheck size={18} /> Sign Covenant
                                    </button>
                                </div>
                            </div>
                            <div className="card-body p-4 d-flex flex-column h-100" style={{ minHeight: '400px' }}>
                                <div className="flex-grow-1 bg-black bg-opacity-25 rounded-3 p-4 mb-4 border border-white-5">
                                    <div className="text-center text-white-50 small mb-4">Chat encryption secured via TLS</div>
                                    <div className="d-flex flex-column gap-3">
                                        <div className="align-self-start bg-secondary bg-opacity-25 p-3 rounded-4 rounded-top-0 mw-75">
                                            <p className="text-white mb-0 text-sm">{activeDeal.lastMessage}</p>
                                        </div>
                                        {activeDeal.status === 'negotiating' && (
                                            <div className="align-self-end bg-primary bg-opacity-25 p-3 rounded-4 rounded-bottom-0 mw-75 border border-primary border-opacity-25">
                                                <p className="text-white mb-0 text-sm">I can do Rs 11,500 to maintain the quality of the raw materials.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="d-flex gap-3 mt-auto">
                                    <input type="text" className="form-control bg-black border-white-10 text-white rounded-pill px-4" placeholder="Negotiate terms..." />
                                    <button className="btn btn-primary rounded-circle p-3 d-flex align-items-center justify-content-center flex-shrink-0">
                                        <MessagesSquare size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="card bg-dark bg-opacity-25 border-white-10 rounded-4 border-dashed h-100 d-flex flex-column align-items-center justify-content-center p-5 text-center" style={{ minHeight: '400px' }}>
                            <Handshake size={64} className="text-white-25 mb-4" />
                            <h4 className="text-white-50 fw-bold">Select a Negotiation</h4>
                            <p className="text-white-25">Open a channel from the sidebar to review wholesale terms and communicate with enterprise buyers.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
