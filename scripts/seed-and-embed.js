/**
 * scripts/seed-and-embed.js
 * Comprehensive Heritage Seeder: Artisans, Categories, and AI-Powered Products.
 */
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
let envLines = [];
try { envLines = fs.readFileSync(envPath, 'utf8').split('\n'); } catch (e) { process.exit(1); }

const envConfig = {};
for (const line of envLines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const firstEq = trimmed.indexOf('=');
        if (firstEq !== -1) {
            envConfig[trimmed.substring(0, firstEq).trim()] = trimmed.substring(firstEq + 1).trim();
        }
    }
}

const SUPABASE_URL = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const HF_TOKEN = envConfig.HF_API_TOKEN;

async function getEmbedding(text) {
    const response = await fetch("https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5", {
        method: "POST",
        headers: { "Authorization": `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: text })
    });
    if (!response.ok) throw new Error(`HF error: ${response.status} - ${await response.text()}`);
    const result = await response.json();
    return Array.isArray(result[0]) ? result[0] : result;
}

async function request(table, method, body) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method,
        headers: {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) console.error(`Error in ${table}:`, await response.text());
}

const categories = [
    { id: "00000000-0000-0000-0000-000000000001", name: "Blue Pottery", heritage_site: "Multan Old City", description: "Centuries-old indigo glazed ceramics crafted from special clay.", image_url: "https://images.unsplash.com/photo-1590424768461-5509c107e324?auto=format&fit=crop&q=80" },
    { id: "00000000-0000-0000-0000-000000000002", name: "Ajrak Textiles", heritage_site: "Lower Indus Valley", description: "Sacred block-printed fabrics using natural madder and indigo dyes.", image_url: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&q=80" },
    { id: "00000000-0000-0000-0000-000000000003", name: "Chiniot Woodwork", heritage_site: "Punjab Heartlands", description: "Elaborate rosewood and shisham carvings with brass inlay masters.", image_url: "https://images.unsplash.com/photo-1611484712647-99e6c227f60b?auto=format&fit=crop&q=80" },
    { id: "00000000-0000-0000-0000-000000000004", name: "Swat Valley Embroidery", heritage_site: "Northern Peaks", description: "Silk thread work on vibrant fabrics, reflecting Gandhara heritage.", image_url: "https://images.unsplash.com/photo-1582142407894-ec85a1268a4e?auto=format&fit=crop&q=80" }
];

const artisans = [
    { id: "00000000-0000-0000-0000-000000000001", full_name: "Ustaad Allah Baksh", specialty: "Kashi-Gari Master", location: "Multan", bio: "6th generation master potter preserving the indigo secrets of Multan.", avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80" },
    { id: "00000000-0000-0000-0000-000000000002", full_name: "Mai Bhagi", specialty: "Ajrak Artisan", location: "Bhit Shah", bio: "Keeper of the 17-step block printing tradition in the Indus valley.", avatar_url: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80" },
    { id: "00000000-0000-0000-0000-000000000003", full_name: "Master Karim", specialty: "Hardwood Inlay", location: "Chiniot", bio: "Expert in brass-on-wood inlay, creating heirloom quality furniture.", avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80" }
];

const products = [
    { title: "Multani Indigo Vase", category: "Blue Pottery", price: 65, artisan_id: "00000000-0000-0000-0000-000000000001", description: "A classic floral Kashi-Gari vase. Each brushstroke is a signature of Multani heritage.", image_url: "https://images.unsplash.com/photo-1590424768461-5509c107e324?auto=format&fit=crop&q=80" },
    { title: "Sacred Ajrak Shawl", category: "Ajrak Textiles", price: 45, artisan_id: "00000000-0000-0000-0000-000000000002", description: "Authenticated vegetable dye ajrak with the 'Mian' block pattern.", image_url: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&q=80" },
    { title: "Rosewood Trunk with Inlay", category: "Chiniot Woodwork", price: 280, artisan_id: "00000000-0000-0000-0000-000000000003", description: "Solid shisham wood chest with intricate brass floral inlay patterns.", image_url: "https://images.unsplash.com/photo-1541533848490-bc8115cd6522?auto=format&fit=crop&q=80" },
    { title: "Peacock Motif Platter", category: "Blue Pottery", price: 55, artisan_id: "00000000-0000-0000-0000-000000000001", description: "Large glazed platter featuring the iconic peacock motif of the Punjab plains.", image_url: "https://images.unsplash.com/photo-1592991538534-00972b6f59ab?auto=format&fit=crop&q=80" }
];

async function seed() {
    console.log("🚀 Syncing Premium Heritage Data...");

    console.log("📁 Syncing Categories...");
    for (const c of categories) await request('categories', 'POST', c);

    console.log("👨‍🎨 Syncing Master Artisans...");
    for (const a of artisans) await request('artisans', 'POST', a);

    console.log("🏺 Syncing AI-Signed Products...");
    for (const p of products) {
        try {
            console.log(`✨ Generating AI Vector for: ${p.title}`);
            const emb = await getEmbedding(`${p.title} ${p.description} ${p.category}`);
            await request('products', 'POST', { ...p, embedding: emb });
        } catch (e) { console.error(e); }
    }

    console.log("✅ Platform Synchronization Complete!");
}

seed();
