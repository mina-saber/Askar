import React, { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  const addToCart = useCallback((product, size, color, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(
        item => item.product.id === product.id && item.size === size && item.color === color
      )
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, size, color, quantity }]
    })
  }, [])

  const removeFromCart = useCallback((productId, size, color) => {
    setCartItems(prev =>
      prev.filter(
        item => !(item.product.id === productId && item.size === size && item.color === color)
      )
    )
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
