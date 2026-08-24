'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product, CartItem } from '@/types'

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  // Load from local storage on mount
  useEffect(() => {
    setIsMounted(true)
    try {
      const stored = localStorage.getItem('liora_cart')
      if (stored) {
        setCart(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to parse cart from local storage', e)
    }
  }, [])

  // Save to local storage on change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('liora_cart', JSON.stringify(cart))
    }
  }, [cart, isMounted])

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id)
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    )
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)



  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
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
