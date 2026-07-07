import ArticleClient from "./ArticleClient"

import { db } from "@/lib/firebase/config"
import { collection, getDocs } from "firebase/firestore"

export async function generateStaticParams() {
    try {
        const pSnap = await getDocs(collection(db, "craftpedia_articles"))
        const articles = pSnap.docs.map(d => ({ slug: d.data().slug || d.id }))
        return articles.length ? articles : [{ slug: 'placeholder' }]
    } catch(e) {
        return [{ slug: 'placeholder' }]
    }
}

export default function Page() {
    return <ArticleClient />;
}
