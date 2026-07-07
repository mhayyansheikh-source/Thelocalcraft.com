const fs = require('fs');
const path = require('path');

const files = [
    'src/app/categories/[id]/page.tsx',
    'src/app/delivery/[city]/page.tsx',
    'src/app/stories/page.tsx',
    'src/app/region/[region]/page.tsx',
    'src/app/products/[id]/layout.tsx'
];

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace import
    content = content.replace(/import \{ supabase \} from "@\/lib\/supabase\/client"/g, 
        \`import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs, doc, getDoc, orderBy } from "firebase/firestore"\`);

    // We can't automatically parse AST but we can make crude regex replacements
    // for common supabase fetch patterns in these files if they exist.
    // E.g. const { data: categories } = await supabase.from("categories").select("id")
    // Let's do them manually in a few steps inside the loop.

    if (file.includes('categories/[id]/page.tsx')) {
        content = content.replace(/const \{ data: categories \} = await supabase\.from\("categories"\)\.select\("id"\)/,
            \`const snap = await getDocs(collection(db, "categories"))\n    const categories = snap.docs.map(d => ({ id: d.id }))\`);
        content = content.replace(/const \{ data: category \} = await supabase[\s\S]*?\.single\(\)/,
            \`const cSnap = await getDoc(doc(db, "categories", id))\n    const category = cSnap.exists() ? { id: cSnap.id, ...cSnap.data() } : null\`);
        content = content.replace(/const \{ data: prodData \} = await supabase[\s\S]*?\.order\("created_at", \{ ascending: false \}\)/,
            \`const pQ = query(collection(db, "products"), where("category", "==", category.name), orderBy("created_at", "desc"))\n        const pSnap = await getDocs(pQ)\n        const prodData = pSnap.docs.map(d => ({ id: d.id, ...d.data() }))\`);
    }

    if (file.includes('delivery/[city]/page.tsx')) {
        content = content.replace(/const \{ data: products \} = await supabase[\s\S]*?\.order\("created_at", \{ ascending: false \}\)/,
            \`const pQ = query(collection(db, "products"), orderBy("created_at", "desc"))\n    const pSnap = await getDocs(pQ)\n    const products = pSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter((p: any) => p.artisans?.location?.toLowerCase().includes(decodedCity.toLowerCase()))\`);
    }

    if (file.includes('stories/page.tsx')) {
        content = content.replace(/const \{ data, error \} = await supabase[\s\S]*?\.order\('created_at', \{ ascending: false \}\)/,
            \`const q = query(collection(db, 'artisan_feeds'), where('status', '==', 'active'), orderBy('created_at', 'desc'))\n            const snap = await getDocs(q)\n            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))\n            const error = null\`);
    }

    if (file.includes('region/[region]/page.tsx')) {
        content = content.replace(/let \{ data: products \} = await supabase[\s\S]*?\.order\("created_at", \{ ascending: false \}\)/,
            \`const pQ = query(collection(db, "products"), orderBy("created_at", "desc"))\n    const pSnap = await getDocs(pQ)\n    let products = pSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter((p: any) => p.artisans?.location?.toLowerCase().includes(decodedRegion.toLowerCase()))\`);
    }

    if (file.includes('products/[id]/layout.tsx')) {
        content = content.replace(/const \{ data: products \} = await supabase\.from\("products"\)\.select\("id"\)/,
            \`const pSnap = await getDocs(collection(db, "products"))\n    const products = pSnap.docs.map(d => ({ id: d.id }))\`);
    }

    fs.writeFileSync(file, content);
}
console.log('App pages refactored.');
