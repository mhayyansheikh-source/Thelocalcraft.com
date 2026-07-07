import re

with open("src/app/dashboard/artisan/page.tsx", "r") as f:
    content = f.read()

# 1. Imports
content = content.replace('import { supabase } from "@/lib/supabase/client"',
'''import { db, auth } from "@/lib/firebase/config"
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc, addDoc, deleteDoc, orderBy } from "firebase/firestore"
import { signOut, onAuthStateChanged } from "firebase/auth"''')


# 2. auth.getUser
content = content.replace('const { data: { user } } = await supabase.auth.getUser()',
'''const user = auth.currentUser
            if (!user) {
                router.push("/login")
                return
            }''')

content = content.replace('''
            if (!user) {
                router.push("/login")
                return
            }

            setUser(user)''', 'setUser(user)')


# 3. get profile
content = re.sub(
r'const { data: profile } = await supabase\s*\.from\("profiles"\)\s*\.select\("\*"\)\s*\.eq\("id", user\.id\)\s*\.single\(\)',
'''const pSnap = await getDoc(doc(db, "profiles", user.uid))
            const profile = pSnap.exists() ? { id: pSnap.id, ...pSnap.data() } : null''', content, flags=re.MULTILINE | re.DOTALL)


content = content.replace('user.id', 'user.uid')

# 4. signOut
content = content.replace('await supabase.auth.signOut()', 'await signOut(auth)')

# 5. get myOrders
content = re.sub(
r'const { data: myOrders } = await supabase\s*\.from\("order_items"\)\s*\.select\(`.*?`\)\s*\.eq\("artisan_id", user\.uid\)\s*\.order\("created_at", { ascending: false }\)',
'''const oQ = query(collection(db, "order_items"), where("artisan_id", "==", user.uid), orderBy("created_at", "desc"))
            const oSnap = await getDocs(oQ)
            const myOrders: any[] = []
            for (const d of oSnap.docs) {
                const item = d.data()
                if (item.order_id) {
                    const oSnap2 = await getDoc(doc(db, "orders", item.order_id))
                    if (oSnap2.exists()) item.orders = { id: oSnap2.id, ...oSnap2.data() }
                }
                if (item.product_id) {
                    const pSnap2 = await getDoc(doc(db, "products", item.product_id))
                    if (pSnap2.exists()) item.product = { id: pSnap2.id, ...pSnap2.data() }
                }
                myOrders.push({ id: d.id, ...item })
            }''', content, flags=re.MULTILINE | re.DOTALL)

# 6. categories
content = content.replace("const { data: catData } = await supabase.from('categories').select('*')",
"const catSnap = await getDocs(collection(db, 'categories')); const catData = catSnap.docs.map(d => ({ id: d.id, ...d.data() }))")


# 7. artisan_id products
content = content.replace("const { data: prodData } = await supabase.from('products').select('id').eq('artisan_id', user.uid)",
"const prodSnap = await getDocs(query(collection(db, 'products'), where('artisan_id', '==', user.uid))); const prodData = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }))")


# 8. reviews
content = content.replace("const { data: artisanProducts } = await supabase.from('products').select('id').eq('artisan_id', user.uid);", "")
content = re.sub(r"const { data: reviewsData } = await supabase\.from\('reviews'\)\.select\('rating'\)\.in\('product_id', productIds\);",
'''const reviewsData: any[] = [];
                for (const pid of productIds) {
                    const rSnap = await getDocs(query(collection(db, 'reviews'), where('product_id', '==', pid)));
                    reviewsData.push(...rSnap.docs.map(d => d.data()));
                }''', content)


# 9. update artisan mastery
content = content.replace("supabase.from('artisans').update({ mastery_tier: currentTier, mastery_points: currentPoints }).eq('id', user.uid).then();",
"updateDoc(doc(db, 'artisans', user.uid), { mastery_tier: currentTier, mastery_points: currentPoints }).catch(e => console.error(e));")


# 10. wiki Data
content = content.replace("const { data: wikiData } = await supabase.from('craftpedia_articles').select('*').eq('author_id', user.uid)",
"const wSnap = await getDocs(query(collection(db, 'craftpedia_articles'), where('author_id', '==', user.uid))); const wikiData = wSnap.docs.map(d => ({ id: d.id, ...d.data() }))")


# 11. Feed Data
content = content.replace("const { data: feedData } = await supabase.from('artisan_feeds').select('*').eq('artisan_id', user.uid).eq('status', 'active')",
"const fSnap = await getDocs(query(collection(db, 'artisan_feeds'), where('artisan_id', '==', user.uid), where('status', '==', 'active'))); const feedData = fSnap.docs.map(d => ({ id: d.id, ...d.data() }))")


# 12. process-artisan-story
content = re.sub(r"const { data, error } = await supabase\.functions\.invoke\('process-artisan-story'.*?}\)",
"const data = null as any; const error = null; // Supabase func removed", content, flags=re.MULTILINE | re.DOTALL)


# 13. handleOrderStatusChange
content = content.replace("const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)",
"await updateDoc(doc(db, 'orders', orderId), { status: newStatus }); const error = null;")


# 14. profile update
content = re.sub(r"await supabase\.from\('profiles'\)\.update\({.*?}\)\.eq\(\"id\", user\.uid\)",
'''await updateDoc(doc(db, "profiles", user.uid), {
                full_name: settingForm.full_name,
                bio: settingForm.bio,
                location: settingForm.location,
                specialty: settingForm.specialty
            })''', content, flags=re.MULTILINE | re.DOTALL)


# 15. artisans update
content = re.sub(r"await supabase\.from\('artisans'\)\.update\({.*?}\)\.eq\(\"id\", user\.uid\)",
'''await setDoc(doc(db, "artisans", user.uid), {
                full_name: settingForm.full_name,
                bio: settingForm.bio,
                location: settingForm.location,
                specialty: settingForm.specialty
            }, { merge: true })''', content, flags=re.MULTILINE | re.DOTALL)

# 16. save craft
content = content.replace("const { data, error } = await supabase.from('products').update(formData).eq('id', editingCraftId).select().single()",
"await updateDoc(doc(db, 'products', editingCraftId), formData); const data = { id: editingCraftId, ...formData }; const error = null;")
content = content.replace("const { data, error } = await supabase.from('products').insert([formData]).select().single()",
"const docRef = await addDoc(collection(db, 'products'), formData); const data = { id: docRef.id, ...formData }; const error = null;")

content = re.sub(r"const { data: embedData, error: embedError } = await supabase\.functions\.invoke\('get-query-embedding'.*?}\)",
"const embedData = null as any; const embedError = null;", content, flags=re.MULTILINE | re.DOTALL)
content = content.replace("await supabase.from('products').update({ embedding: embedData.embedding }).eq('id', savedProduct.id);", "")


# 17. delete craft
content = content.replace("const { error } = await supabase.from('products').delete().eq('id', id)",
"await deleteDoc(doc(db, 'products', id)); const error = null;")


# 18. save wiki
content = content.replace("const { error } = await supabase.from('craftpedia_articles').update(formData).eq('id', editingWikiId)",
"await updateDoc(doc(db, 'craftpedia_articles', editingWikiId), formData); const error = null;")
content = content.replace("const { data, error } = await supabase.from('craftpedia_articles').insert([formData]).select().single()",
"const docRef = await addDoc(collection(db, 'craftpedia_articles'), formData); const data = { id: docRef.id, ...formData }; const error = null;")

# 19. delete wiki
content = content.replace("const { error } = await supabase.from('craftpedia_articles').delete().eq('id', id)",
"await deleteDoc(doc(db, 'craftpedia_articles', id)); const error = null;")

# 20. save feed
content = content.replace('''const { data, error } = await supabase.from('artisan_feeds').insert([{
                ...feedForm,
                artisan_id: user.uid,
                status: 'active'
            }]).select().single()''',
'''const feedData = {
                ...feedForm,
                artisan_id: user.uid,
                status: 'active'
            };
            const docRef = await addDoc(collection(db, 'artisan_feeds'), feedData);
            const data = { id: docRef.id, ...feedData };
            const error = null;''')

# 21. delete feed
content = content.replace("const { error } = await supabase.from('artisan_feeds').update({ status: 'archived' }).eq('id', id)",
"await updateDoc(doc(db, 'artisan_feeds', id), { status: 'archived' }); const error = null;")


# Wrapper for Auth
content = content.replace('''    useEffect(() => {
        const checkUser = async () => {
            setLoading(true)
            const user = auth.currentUser
            if (!user) {
                router.push("/login")
                return
            }
            setUser(user)''',
'''    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true)
            if (!user) {
                router.push("/login")
                return
            }
            setUser(user)''')

content = content.replace('''        }
        checkUser()
    }, [router])''', '''        })
        return () => unsubscribe()
    }, [router])''')

with open("src/app/dashboard/artisan/page.tsx", "w") as f:
    f.write(content)

