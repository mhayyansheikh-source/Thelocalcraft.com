"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Script from 'next/script'
import { ScanFace, Info, Move } from 'lucide-react'

const ModelViewer = 'model-viewer' as any;

export function VirtualShowroom() {
    const [activeModel, setActiveModel] = useState({
        name: 'Handcrafted Teakwood Chair',
        artisan: 'Mustafa S.',
        src: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
        poster: 'https://modelviewer.dev/shared-assets/models/Chair.webp'
    })

    const models = [
        {
            name: 'Handcrafted Teakwood Chair',
            artisan: 'Mustafa S.',
            src: 'https://modelviewer.dev/shared-assets/models/Chair.glb',
            poster: 'https://modelviewer.dev/shared-assets/models/Chair.webp'
        },
        {
            name: 'Vintage Leather Shoe',
            artisan: 'Amir K.',
            src: 'https://modelviewer.dev/shared-assets/models/Shoe.glb',
            poster: 'https://modelviewer.dev/shared-assets/models/Shoe.webp'
        },
        {
            name: 'Astronaut Collectible',
            artisan: 'The Local Craft Spec',
            src: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
            poster: 'https://modelviewer.dev/shared-assets/models/Astronaut.webp'
        }
    ]

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="animate-fade-in">
            <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js" />
            
            <header className="mb-5 d-flex justify-content-between align-items-end flex-wrap gap-3">
                <div>
                    <h2 className="display-4 fw-bold mb-2">AR <span className="text-warning">Showroom.</span></h2>
                    <p className="text-white-50 lead mb-0">Project heritage crafts into your retail space before buying.</p>
                </div>
                <div className="bg-dark border border-white-10 rounded-pill px-4 py-2 d-flex gap-3 overflow-x-auto text-nowrap custom-scrollbar">
                    {models.map((m, i) => (
                        <button 
                            key={i} 
                            onClick={() => setActiveModel(m)}
                            className={`btn btn-sm rounded-pill px-3 ${activeModel.name === m.name ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-white-50 border-0'}`}
                        >
                            {m.name}
                        </button>
                    ))}
                </div>
            </header>

            <div className="row g-4">
                <div className="col-12 col-xl-8">
                    <div className="p-0 rounded-5 border border-white-10 bg-dark position-relative overflow-hidden shadow-2xl" style={{ height: "600px", background: 'radial-gradient(circle at center, #2a2a2a 0%, #000 100%)' }}>
                        <ModelViewer
                            src={activeModel.src}
                            poster={activeModel.poster}
                            alt="A 3D model of a heritage craft"
                            shadow-intensity="1"
                            camera-controls
                            auto-rotate
                            ar
                            ar-modes="webxr scene-viewer quick-look"
                            environment-image="neutral"
                            style={{ width: '100%', height: '100%' }}
                        >
                            <div slot="poster" className="w-100 h-100 d-flex align-items-center justify-content-center bg-dark">
                                <div className="spinner-border text-warning" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                            <button slot="ar-button" className="btn btn-warning rounded-pill position-absolute bottom-0 end-0 m-4 fw-bold shadow-lg d-flex align-items-center gap-2 z-3">
                                <ScanFace size={20} /> View in AR
                            </button>
                        </ModelViewer>
                        
                        <div className="position-absolute top-0 start-0 m-4 d-flex align-items-center gap-2 text-white-50 bg-black bg-opacity-50 px-3 py-2 rounded-pill" style={{ backdropFilter: 'blur(4px)', zIndex: 2 }}>
                            <Move size={16} /> Drag to rotate, scroll to zoom
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-4">
                    <div className="p-4 rounded-4 border border-white-10 bg-dark h-100 d-flex flex-column">
                        <div className="d-flex align-items-center gap-2 mb-4">
                            <Info className="text-warning" size={24} />
                            <h4 className="text-white fw-bold mb-0">Specs & Origin</h4>
                        </div>
                        
                        <h3 className="text-white fw-bold mb-1">{activeModel.name}</h3>
                        <p className="text-warning mb-4">Artisan: {activeModel.artisan}</p>

                        <div className="d-flex flex-column gap-3 mb-auto">
                            <div className="bg-black bg-opacity-25 p-3 rounded border border-white-5">
                                <span className="text-white-50 small d-block mb-1">Materials</span>
                                <span className="text-white">Ethically sourced, raw natural elements.</span>
                            </div>
                            <div className="bg-black bg-opacity-25 p-3 rounded border border-white-5">
                                <span className="text-white-50 small d-block mb-1">Dimensions</span>
                                <span className="text-white">Variable (View in AR for true 1:1 scale)</span>
                            </div>
                            <div className="bg-black bg-opacity-25 p-3 rounded border border-white-5">
                                <span className="text-white-50 small d-block mb-1">Lead Time</span>
                                <span className="text-white">4-6 weeks (Handcrafted to order)</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-top border-white-10">
                            <button className="btn btn-warning w-100 py-3 rounded-pill fw-bold fs-5 shadow-lg">
                                Request Bulk Quote
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
