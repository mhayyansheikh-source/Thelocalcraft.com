"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { db } from "@/lib/firebase/config"
import { collection, query, where, getDocs } from "firebase/firestore"

interface CurrencyContextType {
    currency: "USD" | "PKR"
    rate: number
    symbol: string
    toggleCurrency: () => void
    formatPrice: (priceInUsd: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currency, setCurrency] = useState<"USD" | "PKR">("USD")
    const [rate, setRate] = useState(280) // Default 1 USD = 280 PKR
    const [symbol, setSymbol] = useState("$")

    useEffect(() => {
        // Hydrate from localStorage
        const stored = localStorage.getItem("app_currency") as "USD" | "PKR"
        if (stored) setCurrency(stored)
        
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
        localStorage.setItem("app_currency", currency)
        setSymbol(currency === "USD" ? "$" : "PKR ")
    }, [currency])

    const toggleCurrency = () => {
        setCurrency(prev => prev === "USD" ? "PKR" : "USD")
    }

    const formatPrice = (priceInUsd: number) => {
        if (currency === "USD") {
            return `USD ${priceInUsd.toFixed(2)}`
        }
        const converted = priceInUsd * rate
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
