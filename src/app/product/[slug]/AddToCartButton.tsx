'use client'

import { useState } from 'react'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch', height: '3.5rem' }}>
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          border: '1px solid #9C8D7B', 
          borderRadius: '4px',
          padding: '0 1rem'
        }}
      >
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#2D251F' }}
        >
          -
        </button>
        <span style={{ fontFamily: 'Lato, sans-serif', width: '3rem', textAlign: 'center', fontSize: '1.1rem' }}>
          {quantity}
        </span>
        <button 
          onClick={() => setQuantity(quantity + 1)}
          style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#2D251F' }}
        >
          +
        </button>
      </div>
      
      <button
        onClick={() => addToCart(product, quantity)}
        style={{
          flex: 1,
          backgroundColor: '#2D251F',
          color: '#FAF6F0',
          border: 'none',
          borderRadius: '4px',
          fontFamily: 'Lato, sans-serif',
          fontSize: '0.9rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4A3F35')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2D251F')}
      >
        Add to Cart
      </button>
    </div>
  )
}
