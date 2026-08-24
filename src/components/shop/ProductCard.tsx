'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { urlFor } from '@/sanity/lib/client'

interface ProductCardProps {
  product: Product
  onClick: (product: Product) => void
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const mainImageUrl = product.mainImage
    ? urlFor(product.mainImage).width(600).height(600).quality(85).url()
    : '/images/candle-placeholder.svg'

  const hoverImageUrl = product.hoverImage
    ? urlFor(product.hoverImage).width(600).height(600).quality(85).url()
    : mainImageUrl

  return (
    <article
      className="product-card"
      onClick={() => onClick(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        cursor: 'pointer',
        background: '#ffffff',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: isHovered
          ? '0 16px 48px rgba(45,37,31,0.12)'
          : '0 4px 16px rgba(45,37,31,0.06)',
        transition: 'box-shadow 0.4s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
      }}
      role="button"
      aria-label={`View ${product.title} — ৳${product.price}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(product)}
    >
      {/* Image area */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          backgroundColor: '#FAF6F0',
          overflow: 'hidden',
        }}
      >
        {/* Main image */}
        <div
          className="card-main-img"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: isHovered ? 0 : 1,
            transition: 'opacity 0.5s ease',
          }}
        >
          <Image
            src={mainImageUrl}
            alt={product.mainImage?.alt || product.title}
            fill
            style={{
              objectFit: 'cover',
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Hover image */}
        {product.hoverImage && (
          <div
            className="card-hover-img"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          >
            <Image
              src={hoverImageUrl}
              alt={product.hoverImage?.alt || `${product.title} — alternate view`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Category badge */}
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

      {/* Info area */}
      <div
        style={{
          padding: '1rem 1.1rem 1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          flex: 1,
        }}
      >
        <h3
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
            fontWeight: 500,
            color: '#2D251F',
            lineHeight: 1.3,
            margin: 0,
          }}
        >
          {product.title}
        </h3>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.25rem',
          }}
        >
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
              fontFamily: 'Lato, sans-serif',
              fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#9C8D7B',
              border: '1px solid #9C8D7B',
              borderRadius: '2px',
              padding: '0.15rem 0.4rem',
              opacity: isHovered ? 1 : 0.7,
              transition: 'opacity 0.3s ease',
            }}
          >
            View
          </span>
        </div>
      </div>
    </article>
  )
}
