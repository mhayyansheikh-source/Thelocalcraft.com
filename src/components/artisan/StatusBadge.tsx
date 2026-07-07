// src/components/artisan/StatusBadge.tsx
"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";

export function StatusBadge({ artisanId }: { artisanId: string }) {
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, "profiles", artisanId), (docSnap) => {
            if (docSnap.exists()) {
                setIsOnline(docSnap.data().is_online || false);
            }
        });

        return () => unsub();
    }, [artisanId]);

    return (
        <div className="d-flex align-items-center gap-2">
            <span
                className={`badge-dot ${isOnline ? "bg-success" : "bg-secondary"}`}
                style={{ width: "10px", height: "10px", borderRadius: "50%", display: "inline-block" }}
            />
            <span className={isOnline ? "text-success font-weight-bold" : "text-muted"}>
                {isOnline ? "Artisan Online" : "Artisan Offline"}
            </span>
        </div>
    );
}
