"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type CartItem = {
    product: any;
    quantity: number;
}

type CartContextType = {
    items: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
        const saved = localStorage.getItem('heritage_cart')
        if (saved) {
            try { setItems(JSON.parse(saved)) } catch (e) { }
        }
    }, [])

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('heritage_cart', JSON.stringify(items))
        }
    }, [items, isMounted])

    const addToCart = (product: any) => {
        let maxQuantityReached = false;

        setItems(prev => {
            const existing = prev.find(i => i.product.id === product.id)
            if (existing) {
                if (existing.quantity >= product.stock) {
                    maxQuantityReached = true;
                    return prev;
                }
                return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
            }
            if (product.stock < 1) {
                maxQuantityReached = true;
                return prev;
            }
            return [...prev, { product, quantity: 1 }]
        })

        if (maxQuantityReached) {
            alert(`Sorry, you cannot add more. Only ${product.stock} left in stock.`)
        } else {
            setIsCartOpen(true)
        }
    }

    const removeFromCart = (productId: string) => {
        setItems(prev => prev.filter(i => i.product.id !== productId))
    }

    const clearCart = () => {
        setItems([])
    }

    const cartTotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0)

    return (
        <CartContext.Provider value={{ items: isMounted ? items : [], addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, cartTotal }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
