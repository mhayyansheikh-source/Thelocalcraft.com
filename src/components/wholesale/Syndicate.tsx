import React from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingDown, Clock, ShieldCheck } from 'lucide-react'

export function Syndicate() {
    const pools = [
        { item: 'Hand-knotted Kilim Rug', currentOrder: 120, targetOrder: 200, endsIn: '12 hours', discount: '40%', participants: 8 },
        { item: 'Brass Tea Sets (Artisan Batch)', currentOrder: 45, targetOrder: 50, endsIn: '2 hours', discount: '25%', participants: 3 },
        { item: 'Carved Walnut Cabinets', currentOrder: 10, targetOrder: 20, endsIn: '3 days', discount: '15%', participants: 2 },
    ]

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="animate-fade-in">
            <header className="mb-5 d-flex justify-content-between align-items-end">
                <div>
                    <h2 className="display-4 fw-bold mb-2">Distributor <span className="text-warning">Syndicate.</span></h2>
                    <p className="text-white-50 lead mb-0">Join buying pools with other verified distributors to unlock massive volume discounts.</p>
                </div>
                <div className="d-flex align-items-center gap-2 px-3 py-2 bg-dark rounded-pill border border-white-10">
                    <ShieldCheck className="text-success" size={18} />
                    <span className="text-white small fw-bold">Syndicate Member</span>
                </div>
            </header>
            
            <div className="row g-4">
                {pools.map((pool, i) => {
                    const progress = (pool.currentOrder / pool.targetOrder) * 100;
                    return (
                        <div key={i} className="col-12 col-xl-6">
                            <div className="p-4 rounded-4 border border-white-10 bg-dark h-100 position-relative overflow-hidden">
                                {progress >= 90 && (
                                    <div className="position-absolute top-0 end-0 bg-danger text-white px-3 py-1 fw-bold small" style={{ borderBottomLeftRadius: '1rem' }}>
                                        Closing Soon!
                                    </div>
                                )}
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h4 className="text-white fw-bold mb-1">{pool.item}</h4>
                                        <p className="text-white-50 small mb-0 d-flex align-items-center gap-2">
                                            <Users size={14} /> {pool.participants} distributors in pool
                                        </p>
                                    </div>
                                    <div className="bg-success bg-opacity-10 text-success px-3 py-2 rounded-3 text-center border border-success border-opacity-25">
                                        <div className="fw-bold fs-4 lh-1 mb-1">{pool.discount}</div>
                                        <div className="small" style={{ fontSize: '10px' }}>OFF RETAIL</div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between text-white-50 small mb-2">
                                        <span>{pool.currentOrder} units committed</span>
                                        <span>Target: {pool.targetOrder} units</span>
                                    </div>
                                    <div className="progress bg-black border border-white-10" style={{ height: '12px' }}>
                                        <div 
                                            className={`progress-bar progress-bar-striped progress-bar-animated ${progress >= 90 ? 'bg-danger' : 'bg-warning'}`} 
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center pt-3 border-top border-white-10">
                                    <div className="text-white-50 small d-flex align-items-center gap-1">
                                        <Clock size={14} /> Ends in {pool.endsIn}
                                    </div>
                                    <button className="btn btn-outline-warning rounded-pill px-4 fw-bold">
                                        Commit to Pool
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </motion.div>
    )
}
