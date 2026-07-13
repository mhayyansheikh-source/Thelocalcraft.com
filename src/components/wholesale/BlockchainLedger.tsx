import React from 'react'
import { motion } from 'framer-motion'
import { Link as LinkIcon, CheckCircle, Share2, FileText, Hexagon } from 'lucide-react'

export function BlockchainLedger() {
    const certificates = [
        { id: 'ORD-8821', item: '50x Brass Tea Sets', artisan: 'Ahmad M.', date: 'Oct 12, 2026', hash: '0x8f3c...9a21', status: 'Verified' },
        { id: 'ORD-8799', item: '20x Kilim Rugs', artisan: 'Fatima Z.', date: 'Sep 28, 2026', hash: '0x1b7e...4c88', status: 'Verified' },
        { id: 'ORD-8650', item: '100x Ceramic Bowls', artisan: 'Youssef B.', date: 'Aug 15, 2026', hash: '0x5d9a...2f11', status: 'Verified' },
    ]

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="animate-fade-in">
            <header className="mb-5 d-flex justify-content-between align-items-end flex-wrap gap-3">
                <div>
                    <h2 className="display-4 fw-bold mb-2">Provenance <span className="text-warning">Ledger.</span></h2>
                    <p className="text-white-50 lead mb-0">Cryptographic certificates of authenticity for all bulk orders.</p>
                </div>
                <div className="bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-4 py-2 d-flex align-items-center gap-2">
                    <Hexagon size={18} />
                    <span className="fw-bold small">Network Synced</span>
                </div>
            </header>
            
            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="p-4 rounded-4 border border-warning bg-warning bg-opacity-10 h-100 position-relative overflow-hidden">
                        <div className="position-absolute" style={{ right: '-20px', top: '-20px', opacity: 0.1 }}>
                            <LinkIcon size={120} className="text-warning" />
                        </div>
                        <h5 className="mb-4 text-warning fw-bold d-flex align-items-center gap-2">
                            <CheckCircle size={20} /> Immutable Truth
                        </h5>
                        <p className="text-white-50 mb-4">
                            Every item you purchase is logged on our private blockchain, ensuring ethical sourcing, fair trade compensation, and true artisan provenance.
                        </p>
                        <button className="btn btn-outline-warning w-100 rounded-pill fw-bold">
                            View Smart Contract
                        </button>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="p-4 rounded-4 border border-white-10 bg-dark h-100">
                        <h4 className="text-white mb-4 fw-bold">Your Digital Certificates</h4>
                        <div className="d-flex flex-column gap-3">
                            {certificates.map((cert, i) => (
                                <div key={i} className="p-3 rounded-3 border border-white-5 bg-black d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 transition-all hover-bg-white-5">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-white bg-opacity-10 p-2 rounded text-white-50">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h6 className="text-white mb-1 fw-bold">{cert.item}</h6>
                                            <div className="d-flex align-items-center gap-2 small text-white-50">
                                                <span>{cert.id}</span>
                                                <span>&bull;</span>
                                                <span>{cert.artisan}</span>
                                                <span>&bull;</span>
                                                <span>{cert.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
                                        <div className="text-md-end">
                                            <div className="text-success small fw-bold d-flex align-items-center justify-content-md-end gap-1 mb-1">
                                                <CheckCircle size={12} /> {cert.status}
                                            </div>
                                            <div className="font-monospace small text-white-50 px-2 py-1 bg-white bg-opacity-10 rounded">
                                                {cert.hash}
                                            </div>
                                        </div>
                                        <button className="btn btn-sm btn-outline-light rounded-pill d-flex align-items-center justify-content-center gap-2">
                                            <Share2 size={14} /> Transfer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
