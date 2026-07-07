const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/admin/page.tsx', 'utf8');

content = content.replace(
  'import { supabase } from "@/lib/supabase/client"',
  `import { db, auth } from "@/lib/firebase/config"\nimport { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc, addDoc, orderBy, getCountFromServer } from "firebase/firestore"\nimport { onAuthStateChanged, signOut } from "firebase/auth"`
);

const newLogic = `
    useEffect(() => {
        let unsubscribe;
        const checkUser = async () => {
            setLoading(true)
            
            unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    router.push("/login")
                    return
                }

                setUser(user)

                // Verify admin role
                const profileRef = doc(db, "profiles", user.uid)
                const profileSnap = await getDoc(profileRef)

                if (!profileSnap.exists() || profileSnap.data().role !== "admin") {
                    await signOut(auth)
                    router.push("/login")
                    return
                }

                const profileData = profileSnap.data()
                setProfile(profileData)

                // Fetch high-level platform stats
                try {
                    const artisansQ = query(collection(db, 'profiles'), where('role', '==', 'artisan'))
                    const artisansSnap = await getCountFromServer(artisansQ)
                    const artisansCount = artisansSnap.data().count

                    const ordersQ = query(collection(db, 'orders'), orderBy('created_at', 'desc'))
                    const ordersSnap = await getDocs(ordersQ)
                    const globalOrders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, 10)
                    
                    const totalRevenue = globalOrders.reduce((acc, order) => acc + (order.total_amount || 0), 0)

                    setStats({
                        artisans: artisansCount || 0,
                        orders: globalOrders.length || 0,
                        revenue: totalRevenue
                    })

                    setRecentOrders(globalOrders)

                    const catQ = query(collection(db, 'categories'), orderBy('created_at', 'desc'))
                    const catSnap = await getDocs(catQ)
                    setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })))

                    const pendingQ = query(collection(db, 'profiles'), where('status', '==', 'pending'))
                    const pendingSnap = await getDocs(pendingQ)
                    setPendingUsers(pendingSnap.docs.map(d => ({ id: d.id, ...d.data() })))

                    const wsQ = query(collection(db, 'wholesale_applications'), orderBy('created_at', 'desc'))
                    const wsSnap = await getDocs(wsQ)
                    const wsData = []
                    for (const w of wsSnap.docs) {
                        const wD = w.data()
                        let pData = null
                        if (wD.user_id) {
                            const pSnap = await getDoc(doc(db, "profiles", wD.user_id))
                            if (pSnap.exists()) pData = pSnap.data()
                        }
                        wsData.push({ id: w.id, ...wD, profiles: pData })
                    }
                    setWholesaleApps(wsData)

                    const commQ = query(collection(db, 'commissions'), orderBy('created_at', 'desc'))
                    const commSnap = await getDocs(commQ)
                    const commData = []
                    for (const c of commSnap.docs) {
                        const cD = c.data()
                        let oData = null
                        let pData = null
                        if (cD.order_id) {
                            const oSnap = await getDoc(doc(db, 'orders', cD.order_id))
                            if (oSnap.exists()) oData = oSnap.data()
                        }
                        if (cD.partner_id) {
                            const pSnap = await getDoc(doc(db, 'profiles', cD.partner_id))
                            if (pSnap.exists()) pData = pSnap.data()
                        }
                        commData.push({ id: c.id, ...cD, orders: oData, profiles: pData })
                    }
                    setAllCommissions(commData)
                } catch (err) {
                    console.error("Dashboard error", err)
                }

                setLoading(false)
            })
        }
        checkUser()
        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [router])

    const handleLogout = async () => {
        await signOut(auth)
        router.push("/")
    }

    const handleOrderStatusChange = async (orderId, newStatus) => {
        try {
            await updateDoc(doc(db, 'orders', orderId), { status: newStatus })
            setRecentOrders(recentOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        } catch (error) {
            console.error("Status Update Failed", error)
            alert("Could not update order status.")
        }
    }

    const handleSaveCategory = async (e) => {
        e.preventDefault()
        setIsSavingCat(true)
        try {
            if (editingCatId) {
                await updateDoc(doc(db, 'categories', editingCatId), catForm)
                setCategories(categories.map(c => c.id === editingCatId ? { ...c, ...catForm } : c))
            } else {
                const docRef = await addDoc(collection(db, 'categories'), { ...catForm, created_at: new Date().toISOString() })
                setCategories([{ id: docRef.id, ...catForm }, ...categories])
            }
            setShowCatForm(false)
            setEditingCatId(null)
            setCatForm({ name: "", description: "", image_url: "", heritage_site: "" })
        } catch (error) {
            console.error("Save failed", error)
            alert(error.message || "Failed to save category.")
        } finally {
            setIsSavingCat(false)
        }
    }

    const editCategory = (cat) => {
        setEditingCatId(cat.id)
        setCatForm({
            name: cat.name || "",
            description: cat.description || "",
            image_url: cat.image_url || "",
            heritage_site: cat.heritage_site || ""
        })
        setShowCatForm(true)
    }

    const handleDeleteCategory = async (id) => {
        if (!confirm("Permanently delete this master category and unbind all products?")) return
        try {
            await deleteDoc(doc(db, 'categories', id))
            setCategories(categories.filter(c => c.id !== id))
        } catch (error) {
            console.error(error)
            alert("Delete failed.")
        }
    }

    const handleUserStatusUpdate = async (id, newStatus) => {
        try {
            await updateDoc(doc(db, 'profiles', id), { status: newStatus })
            setPendingUsers(pendingUsers.filter(u => u.id !== id))
        } catch (error) {
            console.error(error)
            alert("Failed to update user status")
        }
    }

    const handleWholesaleAction = async (id, userId, newStatus) => {
        try {
            await updateDoc(doc(db, 'wholesale_applications', id), { status: newStatus })
            if (newStatus === 'approved') {
                await updateDoc(doc(db, 'profiles', userId), { role: 'wholesale', status: 'approved' })
            }
            setWholesaleApps(wholesaleApps.map(a => a.id === id ? { ...a, status: newStatus } : a))
        } catch (error) {
            console.error(error)
            alert("Failed to update wholesale application")
        }
    }

    if (loading) return (
`;

// Extract everything up to useEffect
const parts = content.split('    useEffect(() => {');
const beforeUseEffect = parts[0];

// Extract everything from if (loading)
const afterLoadingParts = parts[1].split('    if (loading) return (');
const afterLoading = '    if (loading) return (' + afterLoadingParts.slice(1).join('    if (loading) return (');

const finalContent = beforeUseEffect + newLogic + afterLoadingParts.slice(1).join('    if (loading) return (');

fs.writeFileSync('src/app/dashboard/admin/page.tsx', finalContent);
console.log("Admin dashboard refactored.");
