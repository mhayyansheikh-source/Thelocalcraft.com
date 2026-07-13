"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs } from "firebase/firestore"

interface CurrencyContextType {
    currency: "USD" | "PKR"
    rate: number
    symbol: string
    toggleCurrency: () => void
    formatPrice: (priceInBase: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrency] = useState<"USD" | "PKR">("PKR")
    const [rate, setRate] = useState(300) // Default 1 base unit = 300 PKR
    const [symbol, setSymbol] = useState("Rs ")

    useEffect(() => {
        
        // Fetch current rate from Firebase
        async function fetchRate() {
            const q = query(collection(db, 'currency_config'), where('code', '==', 'PKR'))
            const querySnapshot = await getDocs(q)
            if (!querySnapshot.empty) {
                setRate(querySnapshot.docs[0].data().exchange_rate_to_usd)
            }
        }
        fetchRate()
    }, [])

    useEffect(() => {
        setSymbol("Rs ")
    }, [])

    const toggleCurrency = () => {
        // Locked to PKR for national operations
        setCurrency("PKR")
    }

    const formatPrice = (priceInBase: number) => {
        const converted = priceInBase * rate
        return `Rs ${converted.toLocaleString()}`
    }

    return (
        <CurrencyContext.Provider value={{ currency, rate, symbol, toggleCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export const useCurrency = () => {
    const context = useContext(CurrencyContext)
    if (!context) throw new Error("useCurrency must be used within a CurrencyProvider")
    return context
}
