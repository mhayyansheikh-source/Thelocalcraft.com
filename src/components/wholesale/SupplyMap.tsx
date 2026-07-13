import React from 'react'
import { motion } from 'framer-motion'

export function SupplyMap() {
    const nodes = [
        { id: 'lahore', x: '70%', y: '40%', name: 'Lahore, PK', status: 'Active Hub' },
        { id: 'multan', x: '50%', y: '60%', name: 'Multan, PK', status: 'Active Hub' },
        { id: 'karachi', x: '30%', y: '85%', name: 'Karachi, PK', status: 'Receiving' },
        { id: 'islamabad', x: '60%', y: '25%', name: 'Islamabad, PK', status: 'Receiving' },
    ]

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="animate-fade-in">
            <header className="mb-5 d-flex justify-content-between align-items-end">
                <div>
                    <h2 className="display-4 fw-bold mb-2">National <span className="text-warning">Supply Routes.</span></h2>
                    <p className="text-white-50 lead mb-0">Live visualization of active heritage trade routes.</p>
                </div>
                <div className="d-flex gap-3">
                    <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle bg-warning" style={{ width: 8, height: 8 }}></div>
                        <span className="text-white-50 small">Active Shipment</span>
                    </div>
                </div>
            </header>
            
            <div className="p-0 rounded-5 border border-white-10 bg-dark position-relative overflow-hidden shadow-2xl" style={{ minHeight: "600px", background: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)' }}>
                {/* Background Grid */}
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ 
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}></div>

                {/* SVG Connections */}
                <svg className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 1 }}>
                    <defs>
                        <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255, 193, 7, 0.1)" />
                            <stop offset="50%" stopColor="rgba(255, 193, 7, 0.5)" />
                            <stop offset="100%" stopColor="rgba(255, 193, 7, 0.1)" />
                        </linearGradient>
                    </defs>
                    <path d="M 70% 40% Q 50% 60% 30% 85%" fill="none" stroke="url(#route-gradient)" strokeWidth="2" strokeDasharray="5,5" className="opacity-50" />
                    <path d="M 50% 60% Q 55% 40% 60% 25%" fill="none" stroke="url(#route-gradient)" strokeWidth="2" strokeDasharray="5,5" className="opacity-50" />
                    <path d="M 70% 40% Q 65% 30% 60% 25%" fill="none" stroke="url(#route-gradient)" strokeWidth="2" strokeDasharray="5,5" className="opacity-50" />

                    {/* Animated Packets */}
                    <motion.circle r="4" fill="#ffc107" filter="blur(1px)"
                        initial={{ cx: "70%", cy: "40%" }}
                        animate={{ cx: ["70%", "30%"], cy: ["40%", "85%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.circle r="4" fill="#ffc107" filter="blur(1px)"
                        initial={{ cx: "50%", cy: "60%" }}
                        animate={{ cx: ["50%", "60%"], cy: ["60%", "25%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 1 }}
                    />
                    <motion.circle r="4" fill="#ffc107" filter="blur(1px)"
                        initial={{ cx: "70%", cy: "40%" }}
                        animate={{ cx: ["70%", "60%"], cy: ["40%", "25%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 0.5 }}
                    />
                </svg>

                {/* Nodes */}
                {nodes.map(node => (
                    <div key={node.id} className="position-absolute d-flex flex-column align-items-center" style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)', zIndex: 2 }}>
                        <div className="position-relative">
                            <motion.div 
                                className="rounded-circle bg-warning position-absolute" 
                                style={{ width: 12, height: 12, top: 0, left: 0, opacity: 0.5 }}
                                animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <div className="rounded-circle bg-warning position-relative" style={{ width: 12, height: 12 }}></div>
                        </div>
                        <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded mt-2 border border-white-10 text-center" style={{ backdropFilter: 'blur(4px)' }}>
                            <div className="small fw-bold">{node.name}</div>
                            <div className="text-warning" style={{ fontSize: '10px' }}>{node.status}</div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
