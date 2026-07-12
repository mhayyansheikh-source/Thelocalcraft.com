"use client"

import React, { useState, useEffect } from "react"
import { X, Loader, CheckCircle, Truck } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useCurrency } from "@/context/CurrencyContext"
import { auth, db } from "@/lib/firebase/config"
import { collection, doc, getDocs, addDoc, setDoc } from "firebase/firestore"

export function CheckoutModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { items, clearCart, cartTotal } = useCart()
    const { formatPrice, rate } = useCurrency()

    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [checkoutComplete, setCheckoutComplete] = useState(false)
    const [shippingDetails, setShippingDetails] = useState({ name: "", phone: "", address: "", city: "", province: "Punjab" })
    const [logistics, setLogistics] = useState<any[]>([])
    const [currentShippingFee, setCurrentShippingFee] = useState(0)
    const [deliveryEstimate, setDeliveryEstimate] = useState("")
    const [impactFundTip, setImpactFundTip] = useState<number>(0)

    useEffect(() => {
        if (!isOpen) return;
        async function fetchLogistics() {
            const querySnapshot = await getDocs(collection(db, 'logistics_config'))
            const data = querySnapshot.docs.map(d => d.data())
            if (data.length > 0) setLogistics(data)
        }
        fetchLogistics()
    }, [isOpen])

    useEffect(() => {
        const provinceLogistics = logistics.find(l => l.region_name === shippingDetails.province)
        if (provinceLogistics) {
            const isFree = cartTotal >= (provinceLogistics.free_shipping_threshold / rate)
            if (isFree) {
                setCurrentShippingFee(0)
            } else {
                setCurrentShippingFee(provinceLogistics.standard_rate / rate)
            }
            setDeliveryEstimate(`${provinceLogistics.estimated_days_min}-${provinceLogistics.estimated_days_max} days`)
        }
    }, [shippingDetails.province, cartTotal, logistics, rate])

    const handleCheckoutSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCheckingOut(true)

        try {
            const user = auth.currentUser
            const referralId = localStorage.getItem('heritage_referral')

            const orderRef = doc(collection(db, 'orders'))
            await setDoc(orderRef, {
                customer_id: user?.uid || null,
                partner_id: referralId || null,
                customer_name: shippingDetails.name,
                customer_phone: shippingDetails.phone,
                customer_address: `${shippingDetails.address}, ${shippingDetails.city}, Pakistan`,
                total_amount: cartTotal + impactFundTip + currentShippingFee,
                impact_fund: impactFundTip,
                shipping_fee: currentShippingFee,
                status: 'pending'
            })

            const orderId = orderRef.id

            if (items.length > 0) {
                for (const item of items) {
                    await addDoc(collection(db, 'order_items'), {
                        order_id: orderId,
                        product_id: item.product.id,
                        artisan_id: item.product.artisan_id,
                        quantity: item.quantity,
                        price_at_time: item.product.price
                    })
                }

                if (referralId) {
                    const commissionAmount = cartTotal * 0.1 
                    await addDoc(collection(db, 'commissions'), {
                        partner_id: referralId,
                        order_id: orderId,
                        amount: commissionAmount,
                        status: 'pending'
                    })
                    localStorage.removeItem('heritage_referral')
                }
            }

            let waMessage = `✨ *New Heritage Order* ✨\n`
            waMessage += `*Order ID:* ${orderId?.split('-')[0]}\n\n`
            waMessage += `*Customer Details:*\n`
            waMessage += `- Name: ${shippingDetails.name}\n`
            waMessage += `- Phone: ${shippingDetails.phone}\n`
            waMessage += `- Address: ${shippingDetails.address}, ${shippingDetails.city}\n\n`
            waMessage += `*Order Items:*\n`
            items.forEach(item => {
                waMessage += `▪ ${item.quantity}x ${item.product.title} (Rs. ${item.product.price})\n`
            })
            if (impactFundTip > 0) {
                waMessage += `▪ Impact Fund: ${formatPrice(impactFundTip)}\n`
            }
            waMessage += `▪ Shipping: ${currentShippingFee > 0 ? formatPrice(currentShippingFee) : 'FREE'}\n`
            waMessage += `\n*Total Order Amount:* ${formatPrice(cartTotal + impactFundTip + currentShippingFee)}\n`
            waMessage += `-------------------------\n`
            waMessage += `*Status:* Pending Dispatch`

            const encodedMessage = encodeURIComponent(waMessage)
            const waPhoneNumber = "923001234567" 

            window.open(`https://wa.me/${waPhoneNumber}?text=${encodedMessage}`, '_blank')

            setCheckoutComplete(true)

            setTimeout(() => {
                onClose()
                setCheckoutComplete(false)
                setShippingDetails({ name: "", phone: "", address: "", city: "Karachi", province: "Punjab" })
                setImpactFundTip(0)
                clearCart() 
            }, 3000)

        } catch (error: any) {
            console.error("Failed to checkout:", error)
            alert("Error confirming your order. Please try again.")
        } finally {
            setIsCheckingOut(false)
        }
    }

    if (!isOpen) return null;

    return (
        <div className="position-fixed top-0 start-0 w-100 vh-100 d-flex align-items-center justify-content-center animate-fade-in" style={{ zIndex: 1100, background: "rgba(0,0,0,0.8)" }}>
            <div className="p-5 border position-relative w-100 mx-3" style={{ maxWidth: "500px", background: "var(--surface-color)", borderColor: "var(--border-color)" }}>
                <button
                    className="btn btn-link text-white position-absolute top-0 end-0 m-3 p-2 opacity-50 hover-opacity-100"
                    onClick={onClose}
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-4">
                    <h3 className="fw-bold text-white mb-1">Confirm Order</h3>
                    <div className="text-white-50 small mb-0 d-flex flex-column align-items-center gap-1">
                        <div className="d-flex justify-content-between w-100 px-4">
                            <span>Subtotal:</span>
                            <span>{formatPrice(cartTotal)}</span>
                        </div>
                        <div className="d-flex justify-content-between w-100 px-4">
                            <span>Shipping ({shippingDetails.province}):</span>
                            <span className={currentShippingFee === 0 ? "text-success fw-bold" : ""}>{currentShippingFee === 0 ? "FREE" : formatPrice(currentShippingFee)}</span>
                        </div>
                        {impactFundTip > 0 && (
                            <div className="d-flex justify-content-between w-100 px-4">
                                <span>Impact Fund:</span>
                                <span>{formatPrice(impactFundTip)}</span>
                            </div>
                        )}
                        <div className="d-flex justify-content-between w-100 px-4 mt-2 pt-2 border-top border-white-10 text-white fw-bold fs-5">
                            <span>Total:</span>
                            <span className="text-warning">{formatPrice(cartTotal + impactFundTip + currentShippingFee)}</span>
                        </div>
                        <div className="mt-2 text-warning fw-bold d-flex align-items-center gap-1" style={{ fontSize: "0.7rem" }}>
                            <Truck size={12} /> Est. Arrival: {deliveryEstimate}
                        </div>
                    </div>
                </div>

                {checkoutComplete ? (
                    <div className="text-center py-4 animate-fade-in">
                        <CheckCircle size={64} className="text-success mb-3 mx-auto" />
                        <h4 className="fw-bold text-white mb-2">Order Captured!</h4>
                        <p className="text-white-50">Your heritage pieces are reserved. Please have cash ready upon delivery.</p>
                    </div>
                ) : (
                    <form onSubmit={handleCheckoutSubmit} className="d-flex flex-column gap-3">
                        <div>
                            <label className="form-label small text-uppercase text-white-50">Full Name</label>
                            <input
                                type="text"
                                required
                                className="form-control text-white py-2 shadow-none rounded-0"
                                style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)" }}
                                placeholder="Enter your name"
                                value={shippingDetails.name}
                                onChange={(e) => setShippingDetails(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="form-label small text-uppercase text-white-50">Phone Number</label>
                            <input
                                type="tel"
                                required
                                className="form-control text-white py-2 shadow-none rounded-0"
                                style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)" }}
                                placeholder="+92 300 1234567"
                                value={shippingDetails.phone}
                                onChange={(e) => setShippingDetails(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="form-label small text-uppercase text-white-50">Province / Region</label>
                            <select
                                required
                                className="form-select text-white py-2 shadow-none rounded-0"
                                value={shippingDetails.province}
                                onChange={(e) => setShippingDetails(prev => ({ ...prev, province: e.target.value }))}
                                style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)" }}
                            >
                                {logistics.map(l => (
                                    <option key={l.region_name} value={l.region_name}>{l.region_name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="form-label small text-uppercase text-white-50">Delivery City</label>
                            <input 
                                type="text"
                                required
                                className="form-control text-white py-2 shadow-none rounded-0"
                                style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)" }}
                                placeholder="e.g. Lahore, Karachi"
                                value={shippingDetails.city}
                                onChange={(e) => setShippingDetails(prev => ({ ...prev, city: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="form-label small text-uppercase text-white-50">Delivery Address</label>
                            <textarea
                                required
                                rows={2}
                                className="form-control text-white py-2 shadow-none rounded-0"
                                style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)" }}
                                placeholder="Complete local shipping address"
                                value={shippingDetails.address}
                                onChange={(e) => setShippingDetails(prev => ({ ...prev, address: e.target.value }))}
                            />
                        </div>

                        <div className="mt-3 p-3 rounded-0" style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)" }}>
                            <label className="form-label small fw-bold text-warning d-flex align-items-center gap-2 mb-2">
                                ✨ Direct-to-Artisan Impact Fund
                            </label>
                            <p className="small text-white-50 mb-3" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>
                                100% of this contribution is routed directly to the master artisans.
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                                {[0, 2, 5, 10, 20].map((tip) => (
                                    <button
                                        key={tip}
                                        type="button"
                                        className={`btn btn-sm rounded-0 fw-bold ${impactFundTip === tip ? "btn-accent text-dark" : "btn-ghost text-white"} flex-grow-1 transition-all`}
                                        onClick={() => setImpactFundTip(tip)}
                                    >
                                        {tip === 0 ? "No Tip" : `+$${tip}`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isCheckingOut}
                            className="btn btn-accent w-100 rounded-0 py-3 fw-bold d-flex justify-content-center align-items-center gap-2 mt-3"
                        >
                            {isCheckingOut ? (
                                <><Loader size={20} className="spin" /> Processing...</>
                            ) : (
                                <>Confirm Cash on Delivery</>
                            )}
                        </button>
                        <div className="text-center text-white-50 small mt-2">
                            <span className="opacity-75">Pay securely when the items arrive.</span>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
