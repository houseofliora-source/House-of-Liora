'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Product } from '@/types'
import ProductCard from './ProductCard'

interface ProductGridProps {
  products: Product[]
  /**
   * Whether the panel has finished sliding up and may scroll internally.
   * While false the panel is mid-slide and its scroll is locked so the outer
   * page scroll keeps driving the slide-up.
   */
  scrollEnabled: boolean
}

/** Just the fields the placeholder card renders — decoupled from the full Product. */
type PlaceholderProduct = Pick<Product, 'title' | 'slug' | 'price' | 'category'> & {
  _id: string
}

export default function ProductGrid({ products, scrollEnabled }: ProductGridProps) {
  const count = products.length > 0 ? products.length : PLACEHOLDER_PRODUCTS.length

  return (
    <div
      id="product-grid-panel"
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#FAF6F0',
        // Own scroll context — this is what keeps the pinned panel usable and
        // keeps the sticky header working (the ancestor is not transformed here).
        overflowY: scrollEnabled ? 'auto' : 'hidden',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        // Deliberately NOT `overscroll-behavior: contain` — chaining is what
        // lets an upward scroll at the panel's top continue into the document
        // and slide the panel back down to reveal the hero again.
        overscrollBehavior: 'auto',
      }}
    >
      {/* ── Header (sticky within this scroll container) ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'rgba(250,246,240,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(156,141,123,0.2)',
          padding: '1.1rem clamp(1rem, 4vw, 2.5rem)',
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

        <p
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.75rem',
            color: '#9C8D7B',
            letterSpacing: '0.1em',
          }}
        >
          {count} piece{count !== 1 ? 's' : ''}
        </p>
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
          &ldquo;Gift for your loved ones — handcrafted with love&rdquo;
        </p>
      </div>

      {/* ── Product grid ── */}
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(1rem, 4vw, 2.5rem) 5rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
            gap: 'clamp(1rem, 3vw, 1.75rem)',
          }}
        >
          {products.length > 0
            ? products.map((product) => <ProductCard key={product._id} product={product} />)
            : PLACEHOLDER_PRODUCTS.map((p) => <PlaceholderCard key={p._id} product={p} />)}
        </div>
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
          © House of Liora — All Rights Reserved
        </p>
      </footer>
    </div>
  )
}

// ── Placeholder products (shown when Sanity has no data yet) ──────────────────
const PLACEHOLDER_PRODUCTS: PlaceholderProduct[] = [
  { _id: 'placeholder-1', title: 'Red Rose Candle', slug: { current: 'red-rose-candle' }, price: 450, category: 'rose-candle' },
  { _id: 'placeholder-2', title: 'Blush Peony Candle', slug: { current: 'blush-peony-candle' }, price: 380, category: 'rose-candle' },
  { _id: 'placeholder-3', title: 'Velvet Crimson Jar', slug: { current: 'velvet-crimson-jar' }, price: 520, category: 'jar-candle' },
  { _id: 'placeholder-4', title: 'Gift Set — Rose & Pearl', slug: { current: 'gift-set-rose-pearl' }, price: 850, category: 'gift-set' },
  { _id: 'placeholder-5', title: 'Ivory Pillar Candle', slug: { current: 'ivory-pillar-candle' }, price: 290, category: 'pillar-candle' },
  { _id: 'placeholder-6', title: 'Midnight Ember Taper', slug: { current: 'midnight-ember-taper' }, price: 340, category: 'taper-candle' },
]

function PlaceholderCard({ product }: { product: PlaceholderProduct }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/product/${product.slug.current}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: 'none',
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
      aria-label={`View ${product.title} — ৳${product.price}`}
    >
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
    </Link>
  )
}
