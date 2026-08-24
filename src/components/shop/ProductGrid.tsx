'use client'

import { useState, useRef, useEffect } from 'react'
import { Product } from '@/types'
import ProductCard from './ProductCard'
import ProductModal from './ProductModal'

interface ProductGridProps {
  products: Product[]
  /** 0–1: how far the slide-up panel has traveled (driven by scroll step 3 progress) */
  slideProgress: number
  /** Whether the grid should be rendered/visible */
  isActive: boolean
}

export default function ProductGrid({ products, slideProgress, isActive }: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)



  return (
    <>
      <div
        id="product-grid-panel"
        ref={gridRef}
        style={{
          position: 'relative',
          backgroundColor: '#FAF6F0',
          minHeight: '100vh',
          zIndex: 50,
        }}
      >
        {/* ── Header ── */}
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: 'rgba(250,246,240,0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(156,141,123,0.2)',
            padding: '1.1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: '#9C8D7B',
                marginBottom: '0.1rem',
              }}
            >
              House of Liora
            </p>
            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)',
                fontWeight: 500,
                color: '#2D251F',
                margin: 0,
                lineHeight: 1,
              }}
            >
              Our Collection
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <p
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: '0.75rem',
                color: '#9C8D7B',
                letterSpacing: '0.1em',
              }}
            >
              {products.length} piece{products.length !== 1 ? 's' : ''}
            </p>

            {/* Scroll back up indicator */}
            <div
              style={{
                width: '1px',
                height: '20px',
                backgroundColor: 'rgba(156,141,123,0.35)',
              }}
            />

            <a
              href="#candle-scene"
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#9C8D7B',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 10L6 2M6 2L2 6M6 2L10 6"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </a>
          </div>
        </header>

        {/* ── Decorative tagline ── */}
        <div
          style={{
            padding: '3rem 2rem 2rem',
            textAlign: 'center',
            borderBottom: '1px solid rgba(156,141,123,0.15)',
            marginBottom: '2rem',
          }}
        >
          <p
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#9C8D7B',
              letterSpacing: '0.05em',
            }}
          >
            "Gift for your loved ones — handcrafted with love"
          </p>
        </div>

        {/* ── Product Grid ── */}
        <main
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 clamp(1rem, 4vw, 2.5rem) 5rem',
          }}
        >
          {products.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
                gap: 'clamp(1rem, 3vw, 1.75rem)',
              }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={setSelectedProduct}
                />
              ))}
            </div>
          ) : (
            /* Empty state / Placeholder products */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
                gap: 'clamp(1rem, 3vw, 1.75rem)',
              }}
            >
              {PLACEHOLDER_PRODUCTS.map((p, i) => (
                <PlaceholderCard key={i} product={p} onClick={() => setSelectedProduct(p as Product)} />
              ))}
            </div>
          )}
        </main>

        {/* ── Footer strip ── */}
        <footer
          style={{
            borderTop: '1px solid rgba(156,141,123,0.2)',
            padding: '1.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#9C8D7B',
            }}
          >
            © {new Date().getFullYear()} House of Liora — All Rights Reserved
          </p>
        </footer>
      </div>

      {/* Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </>
  )
}

// ── Placeholder products (shown when Sanity has no data yet) ──────────────────
const PLACEHOLDER_PRODUCTS = [
  {
    _id: 'placeholder-1',
    title: 'Red Rose Candle',
    slug: { current: 'red-rose-candle' },
    mainImage: null,
    hoverImage: null,
    price: 450,
    category: 'rose-candle',
    description: null,
    inStock: true,
    featured: true,
  },
  {
    _id: 'placeholder-2',
    title: 'Blush Peony Candle',
    slug: { current: 'blush-peony-candle' },
    mainImage: null,
    hoverImage: null,
    price: 380,
    category: 'rose-candle',
    description: null,
    inStock: true,
    featured: false,
  },
  {
    _id: 'placeholder-3',
    title: 'Velvet Crimson Jar',
    slug: { current: 'velvet-crimson-jar' },
    mainImage: null,
    hoverImage: null,
    price: 520,
    category: 'jar-candle',
    description: null,
    inStock: true,
    featured: false,
  },
  {
    _id: 'placeholder-4',
    title: 'Gift Set — Rose & Pearl',
    slug: { current: 'gift-set-rose-pearl' },
    mainImage: null,
    hoverImage: null,
    price: 850,
    category: 'gift-set',
    description: null,
    inStock: true,
    featured: true,
  },
  {
    _id: 'placeholder-5',
    title: 'Ivory Pillar Candle',
    slug: { current: 'ivory-pillar-candle' },
    mainImage: null,
    hoverImage: null,
    price: 290,
    category: 'pillar-candle',
    description: null,
    inStock: true,
    featured: false,
  },
  {
    _id: 'placeholder-6',
    title: 'Midnight Ember Taper',
    slug: { current: 'midnight-ember-taper' },
    mainImage: null,
    hoverImage: null,
    price: 340,
    category: 'taper-candle',
    description: null,
    inStock: true,
    featured: false,
  },
]

function PlaceholderCard({
  product,
  onClick,
}: {
  product: (typeof PLACEHOLDER_PRODUCTS)[0]
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        background: '#ffffff',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: hovered
          ? '0 16px 48px rgba(45,37,31,0.12)'
          : '0 4px 16px rgba(45,37,31,0.06)',
        transition: 'box-shadow 0.4s ease, transform 0.4s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View ${product.title} — ৳${product.price}`}
    >
      {/* Placeholder image */}
      <div
        style={{
          aspectRatio: '1/1',
          background: 'linear-gradient(135deg, #F0EBE3 0%, #E8DFD5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <span style={{ fontSize: '3rem', opacity: 0.5 }}>🕯️</span>
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            background: 'rgba(250,246,240,0.88)',
            backdropFilter: 'blur(8px)',
            borderRadius: '2px',
            padding: '0.2rem 0.6rem',
            fontSize: '0.6rem',
            fontFamily: 'Lato, sans-serif',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#9C8D7B',
          }}
        >
          {product.category.replace(/-/g, ' ')}
        </div>
      </div>

      <div
        style={{
          padding: '1rem 1.1rem 1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
        }}
      >
        <h3
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '1rem',
            fontWeight: 500,
            color: '#2D251F',
            margin: 0,
          }}
        >
          {product.title}
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '1.05rem',
              fontWeight: 600,
              color: '#B33939',
            }}
          >
            ৳{product.price.toLocaleString('en-BD')}
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              fontFamily: 'Lato, sans-serif',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#9C8D7B',
              border: '1px solid #9C8D7B',
              borderRadius: '2px',
              padding: '0.15rem 0.4rem',
            }}
          >
            View
          </span>
        </div>
      </div>
    </article>
  )
}
