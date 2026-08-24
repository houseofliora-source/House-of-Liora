'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Product } from '@/types'
import { urlFor } from '@/sanity/lib/client'

interface ProductModalProps {
  product: Product | null
  onClose: () => void
}

type PaymentTab = 'cod' | 'bkash' | 'nagad'

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [activePayment, setActivePayment] = useState<PaymentTab>('cod')
  const [quantity, setQuantity] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const imageRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Lock body scroll on open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [product])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Animate modal in with GSAP
  useEffect(() => {
    if (!product || !modalRef.current) return
    const init = async () => {
      const { gsap } = await import('gsap')
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power3.out' }
      )
    }
    init()
    setOrderPlaced(false)
    setQuantity(1)
    setActivePayment('cod')
  }, [product])

  if (!product) return null

  const imageUrl = product.mainImage
    ? urlFor(product.mainImage).width(800).height(800).quality(90).url()
    : '/images/candle-placeholder.svg'

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return
    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOrderPlaced(true)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        id="modal-backdrop"
        className="modal-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
        }}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        ref={modalRef}
        id="product-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Product details: ${product.title}`}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1001,
          width: 'min(900px, 95vw)',
          maxHeight: '90vh',
          backgroundColor: '#FAF6F0',
          borderRadius: '6px',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          boxShadow: '0 32px 80px rgba(45,37,31,0.25), 0 0 0 1px rgba(156,141,123,0.15)',
        }}
      >
        {/* ── Left: Product Image ── */}
        <div
          ref={imageRef}
          className="zoom-container"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          style={{
            position: 'relative',
            aspectRatio: '1/1',
            backgroundColor: '#F0EBE3',
            overflow: 'hidden',
            cursor: isZoomed ? 'crosshair' : 'zoom-in',
          }}
        >
          <Image
            src={imageUrl}
            alt={product.mainImage?.alt || product.title}
            fill
            className="zoom-image"
            style={{
              objectFit: 'cover',
              transform: isZoomed ? `scale(1.6)` : 'scale(1)',
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transition: isZoomed ? 'transform 0.1s ease' : 'transform 0.5s ease',
            }}
            sizes="(max-width: 768px) 95vw, 450px"
          />

          {/* Zoom hint */}
          {!isZoomed && (
            <div
              style={{
                position: 'absolute',
                bottom: '0.75rem',
                right: '0.75rem',
                background: 'rgba(250,246,240,0.85)',
                backdropFilter: 'blur(8px)',
                borderRadius: '2px',
                padding: '0.2rem 0.5rem',
                fontSize: '0.6rem',
                fontFamily: 'Lato, sans-serif',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#9C8D7B',
              }}
            >
              Hover to zoom
            </div>
          )}
        </div>

        {/* ── Right: Product Details ── */}
        <div
          style={{
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            maxHeight: '90vh',
          }}
        >
          {/* Close button */}
          <button
            id="modal-close-btn"
            onClick={onClose}
            aria-label="Close product modal"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 10,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.4rem',
              color: '#9C8D7B',
              lineHeight: 1,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M1 1L17 17M17 1L1 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Category */}
          <p
            style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#9C8D7B',
              margin: 0,
            }}
          >
            {product.category.replace(/-/g, ' ')}
          </p>

          {/* Title */}
          <h2
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 500,
              color: '#2D251F',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {product.title}
          </h2>

          {/* Price */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.4rem',
            }}
          >
            <span
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '1.8rem',
                fontWeight: 600,
                color: '#B33939',
              }}
            >
              ৳{product.price.toLocaleString('en-BD')}
            </span>
            <span
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: '0.75rem',
                color: '#9C8D7B',
              }}
            >
              BDT
            </span>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', backgroundColor: 'rgba(156,141,123,0.25)' }} />

          {/* Description (Portable Text) */}
          {product.description && product.description.length > 0 && (
            <div className="portable-text">
              <PortableText value={product.description} />
            </div>
          )}

          {/* Quantity selector */}
          {!orderPlaced && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: '#9C8D7B',
                }}
              >
                Qty
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid rgba(156,141,123,0.4)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <button
                  id="qty-decrease"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: '32px',
                    height: '32px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#2D251F',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span
                  style={{
                    width: '36px',
                    textAlign: 'center',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '0.9rem',
                    color: '#2D251F',
                  }}
                >
                  {quantity}
                </span>
                <button
                  id="qty-increase"
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#2D251F',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* ── Payment Options ── */}
          {!orderPlaced ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#9C8D7B',
                  margin: 0,
                }}
              >
                Select Payment Method
              </p>

              {/* Payment tabs */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(
                  [
                    { id: 'cod' as PaymentTab, label: 'Cash on Delivery', emoji: '💵' },
                    { id: 'bkash' as PaymentTab, label: 'bKash', emoji: '💳' },
                    { id: 'nagad' as PaymentTab, label: 'Nagad', emoji: '📱' },
                  ] as const
                ).map((method) => (
                  <button
                    key={method.id}
                    id={`payment-${method.id}`}
                    onClick={() => setActivePayment(method.id)}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.25rem',
                      borderRadius: '3px',
                      border: activePayment === method.id
                        ? '2px solid #B33939'
                        : '1px solid rgba(156,141,123,0.35)',
                      background: activePayment === method.id
                        ? 'rgba(179,57,57,0.06)'
                        : 'transparent',
                      cursor: 'pointer',
                      fontFamily: 'Lato, sans-serif',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      color: activePayment === method.id ? '#B33939' : '#9C8D7B',
                      textTransform: 'uppercase',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.2rem',
                    }}
                    aria-pressed={activePayment === method.id}
                  >
                    <span style={{ fontSize: '1rem' }}>{method.emoji}</span>
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>

              {/* Payment form */}
              <form onSubmit={handleOrderSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <input
                    id="customer-name"
                    type="text"
                    placeholder="Your full name"
                    required
                    style={inputStyle}
                    aria-label="Customer name"
                  />
                  <input
                    id="customer-phone"
                    type="tel"
                    placeholder="Phone number (+880...)"
                    required
                    pattern="^(\+880|0)1[3-9][0-9]{8}$"
                    style={inputStyle}
                    aria-label="Phone number"
                  />
                  <input
                    id="customer-address"
                    type="text"
                    placeholder="Delivery address"
                    required
                    style={inputStyle}
                    aria-label="Delivery address"
                  />

                  {/* bKash / Nagad number field */}
                  {(activePayment === 'bkash' || activePayment === 'nagad') && (
                    <div>
                      <input
                        id={`${activePayment}-number`}
                        type="tel"
                        placeholder={`${activePayment === 'bkash' ? 'bKash' : 'Nagad'} account number`}
                        required
                        style={{
                          ...inputStyle,
                          borderColor:
                            activePayment === 'bkash' ? '#E2136E' : '#F5821F',
                        }}
                        aria-label={`${activePayment} account number`}
                      />
                      <p
                        style={{
                          fontFamily: 'Lato, sans-serif',
                          fontSize: '0.65rem',
                          color: '#9C8D7B',
                          marginTop: '0.25rem',
                          fontStyle: 'italic',
                        }}
                      >
                        * Our team will contact you to confirm the payment.
                      </p>
                    </div>
                  )}
                </div>

                {/* Order total */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'rgba(156,141,123,0.08)',
                    borderRadius: '3px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Lato, sans-serif',
                      fontSize: '0.75rem',
                      color: '#9C8D7B',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Total ({quantity} item{quantity > 1 ? 's' : ''})
                  </span>
                  <span
                    style={{
                      fontFamily: 'Playfair Display, Georgia, serif',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: '#B33939',
                    }}
                  >
                    ৳{(product.price * quantity).toLocaleString('en-BD')}
                  </span>
                </div>

                {/* Submit button */}
                <button
                  id="place-order-btn"
                  type="submit"
                  style={{
                    width: '100%',
                    marginTop: '0.75rem',
                    padding: '0.85rem',
                    background: 'linear-gradient(135deg, #B33939, #921e1e)',
                    color: '#FAF6F0',
                    border: 'none',
                    borderRadius: '3px',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.88'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Place Order →
                </button>
              </form>
            </div>
          ) : (
            /* ── Order Confirmation ── */
            <div
              style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(179,57,57,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                }}
              >
                🕯️
              </div>
              <h3
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  color: '#2D251F',
                }}
              >
                Order Received!
              </h3>
              <p
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.85rem',
                  color: '#9C8D7B',
                  lineHeight: 1.6,
                }}
              >
                Thank you for choosing House of Liora.
                <br />
                Our team will contact you shortly to confirm your order.
              </p>
              <button
                id="close-after-order-btn"
                onClick={onClose}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.6rem 1.5rem',
                  border: '1px solid #B33939',
                  borderRadius: '2px',
                  background: 'transparent',
                  color: '#B33939',
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  border: '1px solid rgba(156,141,123,0.35)',
  borderRadius: '2px',
  backgroundColor: '#ffffff',
  fontFamily: 'Lato, sans-serif',
  fontSize: '0.85rem',
  color: '#2D251F',
  outline: 'none',
  transition: 'border-color 0.2s ease',
}
