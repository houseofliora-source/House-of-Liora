'use client'

import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'

export default function CartWidget() {
  const { cartCount, cartTotal, cart, removeFromCart, updateQuantity } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  // Don't show widget if cart is empty and not open
  if (cartCount === 0 && !isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {/* Mini Cart Panel */}
      {isOpen && (
        <div
          style={{
            backgroundColor: '#FAF6F0',
            border: '1px solid rgba(156,141,123,0.3)',
            borderRadius: '8px',
            boxShadow: '0 10px 40px rgba(45,37,31,0.15)',
            width: 'min(350px, 90vw)',
            maxHeight: '60vh',
            overflowY: 'auto',
            marginBottom: '1rem',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(156,141,123,0.2)', paddingBottom: '0.8rem' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: '#2D251F', margin: 0 }}>Your Cart</h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#9C8D7B' }}
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <p style={{ fontFamily: 'Lato, sans-serif', color: '#9C8D7B', textAlign: 'center', margin: '2rem 0' }}>Your cart is empty.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.map((item) => (
                <div key={item.product._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.9rem', color: '#2D251F', margin: '0 0 0.3rem 0', fontWeight: 600 }}>{item.product.title}</p>
                    <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.8rem', color: '#B33939', margin: 0 }}>৳{item.product.price.toLocaleString('en-BD')}</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #9C8D7B', borderRadius: '4px', padding: '0.2rem 0.5rem' }}>
                    <button 
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2D251F', fontSize: '1rem' }}
                    >-</button>
                    <span style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.8rem', width: '1.5rem', textAlign: 'center' }}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2D251F', fontSize: '1rem' }}
                    >+</button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.product._id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B33939', fontSize: '1.2rem', marginLeft: '0.5rem' }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

          {cart.length > 0 && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(156,141,123,0.2)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#2D251F', fontWeight: 600 }}>Total:</span>
                <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#B33939', fontWeight: 700 }}>৳{cartTotal.toLocaleString('en-BD')}</span>
              </div>
              <button
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  backgroundColor: '#2D251F',
                  color: '#FAF6F0',
                  border: 'none',
                  borderRadius: '4px',
                  fontFamily: 'Lato, sans-serif',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4A3F35')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2D251F')}
                onClick={() => alert("Checkout page coming soon!")}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#2D251F',
          color: '#FAF6F0',
          border: 'none',
          boxShadow: '0 4px 12px rgba(45,37,31,0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'transform 0.3s, background-color 0.3s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.backgroundColor = '#4A3F35';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = '#2D251F';
        }}
        aria-label="Open Cart"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        
        {cartCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: '#B33939',
              color: '#fff',
              fontSize: '0.75rem',
              fontFamily: 'Lato, sans-serif',
              fontWeight: 700,
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #FAF6F0',
            }}
          >
            {cartCount}
          </span>
        )}
      </button>
    </div>
  )
}
