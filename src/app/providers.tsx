"use client"

import { CartProvider } from '@/context/CartContext'
import { CurrencyProvider } from '@/context/CurrencyContext'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CurrencyProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </CurrencyProvider>
    )
}
