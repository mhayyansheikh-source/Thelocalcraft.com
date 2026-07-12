import React from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Globe, Heart, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
    return (
        <footer className="footer-section mt-5 py-5 text-white"
            style={{
                background: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(10px)",
                borderTop: "1px solid rgba(255, 255, 255, 0.05)"
            }}>
            <div className="container pt-5">
                <div className="row g-5">
                    {/* Brand Section */}
                    <div className="col-lg-4">
                        <div className="brand-footer mb-4">
                            <h3 className="fw-bold mb-2 text-uppercase">The Local <span className="text-warning">Crafts</span></h3>
                            <div className="d-flex align-items-center gap-2 text-white-50 small text-uppercase" style={{ letterSpacing: "3.5px", fontSize: "0.6rem" }}>
                                <Heart size={10} className="text-warning" fill="currentColor" />
                                Handcrafted with Love
                                <Heart size={10} className="text-warning" fill="currentColor" />
                            </div>
                        </div>
                        <p className="text-white-50 mb-4" style={{ maxWidth: "300px", fontSize: "0.9rem", lineHeight: "1.7" }}>
                            A portal to Pakistan's soul. We use AI to preserve heritage and bring authentic artisan crafts directly to your door.
                        </p>
                        <div className="d-flex gap-3 mt-2">
                            {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                                <Link key={idx} href="#" className="btn btn-outline-light border-opacity-25 opacity-75 hover-opacity-100 transition-all d-flex align-items-center justify-content-center p-0" style={{ width: "44px", height: "44px", borderRadius: "50%" }}>
                                    <Icon size={20} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 offset-lg-1">
                        <h6 className="text-uppercase fw-bold mb-4" style={{ letterSpacing: "2px", fontSize: "0.85rem" }}>Explore</h6>
                        <ul className="list-unstyled d-flex flex-column gap-3 text-white-50" style={{ fontSize: "0.9rem" }}>
                            {["All Products", "New Arrivals", "Best Sellers", "Artisan Stories"].map((link) => (
                                <li key={link}><Link href="#" className="text-decoration-none text-reset hover-white transition-colors">{link}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="col-lg-2">
                        <h6 className="text-uppercase fw-bold mb-4" style={{ letterSpacing: "2px", fontSize: "0.85rem" }}>Handicrafts</h6>
                        <ul className="list-unstyled d-flex flex-column gap-3 text-white-50" style={{ fontSize: "0.9rem" }}>
                            {["Blue Pottery", "Sindhi Ajrak", "Woodwork", "Embroidery", "Footwear"].map((link) => (
                                <li key={link}><Link href="#" className="text-decoration-none text-reset hover-white transition-colors">{link}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-lg-3">
                        <h6 className="text-uppercase fw-bold mb-4" style={{ letterSpacing: "2px", fontSize: "0.85rem" }}>Connect</h6>
                        <div className="d-flex flex-column gap-3 text-white-50 small" style={{ fontSize: "0.85rem" }}>
                            <div className="d-flex align-items-center gap-3">
                                <Mail size={16} /> hello@thelocalcrafts.com
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <Phone size={16} /> +92 (300) 123-4567
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <MapPin size={16} /> Multi-region Pakistan (Admin: Lahore)
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-5 pt-5 pb-3 border-top border-white-5 border-opacity-5 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 text-white-50 small">
                    <p className="mb-0">© 2025 The Local Crafts. All Rights Reserved.</p>
                    <div className="d-flex gap-4">
                        <Link href="#" className="text-decoration-none text-reset hover-white">Privacy Policy</Link>
                        <Link href="#" className="text-decoration-none text-reset hover-white">Terms of Service</Link>
                        <div className="d-flex align-items-center gap-2">
                            <Globe size={14} /> English (US)
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
