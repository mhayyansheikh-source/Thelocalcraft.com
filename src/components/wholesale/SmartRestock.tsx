import React from 'react'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, AlertTriangle, PackagePlus, ArrowRight } from 'lucide-react'

export function SmartRestock() {
    const predictions = [
        { item: 'Moroccan Ceramic Bowls', stock: 12, predictedOutage: '7 days', restockQty: 50, discount: '15%' },
        { item: 'Handwoven Persian Rug (2x3)', stock: 3, predictedOutage: '14 days', restockQty: 10, discount: '5%' },
        { item: 'Teakwood Accent Chair', stock: 1, predictedOutage: '3 days', restockQty: 5, discount: '10%' },
    ]

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="animate-fade-in">
            <header className="mb-5">
                <h2 className="display-4 fw-bold mb-2">Predictive <span className="text-warning">Restocking.</span></h2>
                <p className="text-white-50 lead">AI-driven purchase orders based on your sales velocity and global trends.</p>
            </header>
            
            <div className="row g-4 mb-4">
                <div className="col-lg-4">
                    <div className="p-4 rounded-4 border border-warning bg-warning bg-opacity-10 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="mb-0 text-warning fw-bold">Action Required</h5>
                            <AlertTriangle className="text-warning" size={24} />
                        </div>
                        <h2 className="display-5 text-white fw-bold mb-1">3 Items</h2>
                        <p className="text-white-50">Projected to stock out within 14 days based on current Q4 velocity.</p>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div className="p-4 rounded-4 border border-white-10 bg-dark h-100 d-flex flex-column justify-content-center">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="p-2 bg-success bg-opacity-10 text-success rounded-circle">
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <h5 className="mb-0 text-white">Holiday Surge Detected</h5>
                                <p className="text-white-50 small mb-0">+45% demand for Ceramics in your region</p>
                            </div>
                        </div>
                        <div className="progress mt-2" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                            <div className="progress-bar bg-success" style={{ width: '85%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-4 border border-white-10 bg-dark">
                <h4 className="text-white mb-4 fw-bold d-flex align-items-center gap-2">
                    <Zap className="text-warning" size={20} /> AI Recommended Restock
                </h4>
                
                <div className="d-none d-md-block">
                    <div className="table-responsive">
                        <table className="table table-dark table-borderless align-middle">
                            <thead>
                                <tr className="border-bottom border-white-10">
                                    <th className="text-white-50 pb-3 font-monospace small text-uppercase">Item</th>
                                    <th className="text-white-50 pb-3 font-monospace small text-uppercase">Current Stock</th>
                                    <th className="text-white-50 pb-3 font-monospace small text-uppercase">Est. Outage</th>
                                    <th className="text-white-50 pb-3 font-monospace small text-uppercase">Rec. Qty</th>
                                    <th className="text-white-50 pb-3 font-monospace small text-uppercase text-end">Volume Discount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {predictions.map((p, i) => (
                                    <tr key={i} className="border-bottom border-white-5">
                                        <td className="py-3 text-white fw-medium">{p.item}</td>
                                        <td className="py-3">
                                            <span className={`badge ${p.stock <= 3 ? 'bg-danger bg-opacity-25 text-danger border border-danger' : 'bg-warning bg-opacity-25 text-warning border border-warning'}`}>
                                                {p.stock} units
                                            </span>
                                        </td>
                                        <td className="py-3 text-white-50">{p.predictedOutage}</td>
                                        <td className="py-3">
                                            <div className="d-inline-flex align-items-center gap-2 border border-white-10 rounded px-2 py-1">
                                                <span className="text-white">{p.restockQty}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-end text-success fw-bold">{p.discount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="d-flex flex-column gap-3 d-md-none mt-3">
                    {predictions.map((p, i) => (
                        <div key={i} className="p-3 rounded-4 border border-white-10 bg-black bg-opacity-50 d-flex flex-column gap-2">
                            <div className="d-flex justify-content-between align-items-start">
                                <span className="text-white fw-medium">{p.item}</span>
                                <span className="text-success fw-bold">{p.discount}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center small mt-2">
                                <span className="text-white-50">Stock:</span>
                                <span className={`badge ${p.stock <= 3 ? 'bg-danger bg-opacity-25 text-danger border border-danger' : 'bg-warning bg-opacity-25 text-warning border border-warning'}`}>
                                    {p.stock} units
                                </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center small">
                                <span className="text-white-50">Est. Outage:</span>
                                <span className="text-white">{p.predictedOutage}</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center small border-top border-white-10 pt-2 mt-1">
                                <span className="text-white-50 text-warning">AI Rec. Qty:</span>
                                <div className="d-inline-flex align-items-center gap-2 border border-white-10 rounded px-2 py-1">
                                    <span className="text-white fw-bold">{p.restockQty}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-3 border-top border-white-10 d-flex justify-content-between align-items-center">
                    <div>
                        <p className="text-white-50 mb-0 small">Total Estimated Cost: <span className="text-white fw-bold fs-5">$4,250.00</span></p>
                    </div>
                    <button className="btn btn-warning rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2">
                        <PackagePlus size={18} /> 1-Click Smart Restock
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
