import ProductClient from "./ProductClient"
import { db } from "@/lib/firebase/config"
import { collection, getDocs } from "firebase/firestore"

export async function generateStaticParams() {
    try {
        const pSnap = await getDocs(collection(db, "products"))
        const products = pSnap.docs.map(d => ({ id: d.id }))
        return products.length ? products : [{ id: 'placeholder' }]
    } catch(e) {
        return [{ id: 'placeholder' }]
    }
}

export default function Page() {
    return <ProductClient />;
}
