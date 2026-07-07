const fs = require('fs');

let content = fs.readFileSync('src/app/products/[id]/page.tsx', 'utf8');

content = content.replace(
  'import { supabase } from "@/lib/supabase/client"',
  `import { db, auth } from "@/lib/firebase/config"\nimport { collection, query, where, getDocs, doc, getDoc, addDoc, orderBy } from "firebase/firestore"\nimport { onAuthStateChanged } from "firebase/auth"`
);

const newLogic = `
    useEffect(() => {
        let unsubscribe;
        async function fetchProduct() {
            setLoading(true)
            
            try {
                // Fetch Product
                const productSnap = await getDoc(doc(db, "products", id))
                if (productSnap.exists()) {
                    const pData = productSnap.data()
                    if (pData.artisan_id) {
                        const artisanSnap = await getDoc(doc(db, "profiles", pData.artisan_id))
                        if (artisanSnap.exists()) pData.artisans = artisanSnap.data()
                    }
                    setProduct({ id: productSnap.id, ...pData })

                    if (pData.audio_story_url) {
                        const aud = new Audio(pData.audio_story_url)
                        aud.onended = () => setIsPlayingAudio(false)
                        setAudioElement(aud)
                    }
                }

                // Fetch Reviews
                const revQ = query(collection(db, "reviews"), where("product_id", "==", id), orderBy("created_at", "desc"))
                const revSnap = await getDocs(revQ)
                setReviews(revSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))

                // Check Auth for Reviews
                unsubscribe = onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        const profSnap = await getDoc(doc(db, "profiles", user.uid))
                        if (profSnap.exists()) {
                            const prof = profSnap.data()
                            if (prof.role === 'customer') {
                                setIsAuthCustomer(true)
                                setCustomerProfile(prof)
                                setShippingDetails(prev => ({
                                    ...prev,
                                    name: prof.full_name || prev.name,
                                    city: prof.location ? prof.location.split(',')[0] : prev.city
                                }))
                            }
                        }
                    }
                })
            } catch (err) {
                console.error("Error fetching product", err)
            }

            setLoading(false)
        }
        if (id) fetchProduct()
        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [id])

    if (loading) return (
`;

// Replace useEffect
content = content.replace(/    useEffect\(\(\) => \{[\s\S]*?    if \(loading\) return \(/, newLogic);

const newCod = `    const confirmCodOrder = async (e: any) => {
        e.preventDefault()
        setIsCheckingOut(true)

        try {
            const user = auth.currentUser

            const orderPayload = {
                customer_id: user?.uid || null,
                customer_name: shippingDetails.name,
                customer_phone: shippingDetails.phone,
                customer_address: \`\${shippingDetails.address}, \${shippingDetails.city}, Pakistan\`,
                total_amount: product.price + impactFundTip,
                impact_fund: impactFundTip,
                status: 'pending',
                created_at: new Date().toISOString()
            }
            const orderRef = await addDoc(collection(db, 'orders'), orderPayload)

            await addDoc(collection(db, 'order_items'), {
                order_id: orderRef.id,
                product_id: product.id,
                artisan_id: product.artisan_id,
                quantity: 1,
                price_at_time: product.price
            })

            // Generate WhatsApp Order Message
            let waMessage = \`✨ *New Heritage Order (One-Click)* ✨\\n\`
            waMessage += \`*Order ID:* \${orderRef.id.split('-')[0]}\\n\\n\`
            waMessage += \`*Customer Details:*\\n\`
            waMessage += \`- Name: \${shippingDetails.name}\\n\`
            waMessage += \`- Phone: \${shippingDetails.phone}\\n\`
            waMessage += \`- Address: \${shippingDetails.address}, \${shippingDetails.city}\\n\\n\`
            waMessage += \`*Order Item:*\\n\`
            waMessage += \`▪ 1x \${product.title} (Rs. \${product.price})\\n\`
            if (impactFundTip > 0) {
                waMessage += \`▪ Direct-to-Artisan Impact Fund: Rs. \${impactFundTip}\\n\`
            }
            waMessage += \`\\n*Total Amount:* Rs. \${(product.price + impactFundTip).toLocaleString()}\\n\`
            waMessage += \`-------------------------\\n\`
            waMessage += \`*Status:* Pending COD Dispatch\`

            const encodedMessage = encodeURIComponent(waMessage)
            const waPhoneNumber = "923001234567" // Application Master Number

            // Open WhatsApp silently in new tab
            window.open(\`https://wa.me/\${waPhoneNumber}?text=\${encodedMessage}\`, '_blank')

            setCheckoutComplete(true)

            setTimeout(() => {
                setShowModal(false)
                setCheckoutComplete(false)
                setShippingDetails({ name: "", phone: "", address: "", city: "Karachi" })
                setImpactFundTip(0)
            }, 3000)

        } catch (error) {
            console.error("Failed to checkout:", error)
            alert("Error confirming your order. Please try again.")
        } finally {
            setIsCheckingOut(false)
        }
    }`;

content = content.replace(/    const confirmCodOrder = async \(e: React.FormEvent\) => \{[\s\S]*?    const toggleAudio/m, newCod + '\n\n    const toggleAudio');

const newReview = `    const handleSubmitReview = async (e: any) => {
        e.preventDefault()
        if (!isAuthCustomer || !customerProfile) return;

        setIsSubmittingReview(true)
        try {
            const user = auth.currentUser
            const payload = {
                product_id: product.id,
                customer_id: user?.uid,
                customer_name: customerProfile.full_name || "Valued Customer",
                rating: reviewForm.rating,
                comment: reviewForm.comment,
                created_at: new Date().toISOString()
            }

            const docRef = await addDoc(collection(db, 'reviews'), payload)
            
            setReviews([{ id: docRef.id, ...payload }, ...reviews])
            setReviewForm({ rating: 5, comment: "" })
            alert("Thank you! Your heritage review has been published.")
        } catch (error) {
            console.error("Failed to submit review:", error)
            alert("Could not post review. Please try again.")
        } finally {
            setIsSubmittingReview(false)
        }
    }`;

content = content.replace(/    const handleSubmitReview = async \(e: React.FormEvent\) => \{[\s\S]*?    if \(!product\) return \(/m, newReview + '\n\n    if (!product) return (');

fs.writeFileSync('src/app/products/[id]/page.tsx', content);
console.log("Product page refactored.");
