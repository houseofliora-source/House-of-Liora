import { client } from '@/sanity/lib/client'
import { PRODUCT_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { Product } from '@/types'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import urlBuilder from '@sanity/image-url'
import AddToCartButton from './AddToCartButton'
import Link from 'next/link'

const builder = urlBuilder(client)
function urlFor(source: any) {
  return builder.image(source)
}

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  const product = await client.fetch<Product | null>(PRODUCT_BY_SLUG_QUERY, {
    slug: resolvedParams.slug,
  })

  if (!product) {
    return notFound()
  }

  const imageUrl = product.mainImage
    ? urlFor(product.mainImage).width(800).url()
    : '/images/candle-placeholder.svg'

  return (
    <div style={{ backgroundColor: '#FAF6F0', minHeight: '100vh' }}>
      {/* ── Header ── */}
      <header
        style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid rgba(156,141,123,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <p
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(0.8rem, 1.5vw, 1rem)',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#2D251F',
              margin: 0,
            }}
          >
            House of Liora
          </p>
        </Link>
        <Link 
          href="/" 
          style={{ 
            fontFamily: 'Lato, sans-serif', 
            fontSize: '0.8rem', 
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#9C8D7B',
            textDecoration: 'none' 
          }}
        >
          Back to Shop
        </Link>
      </header>

      {/* ── Product Details Layout ── */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', display: 'flex', flexWrap: 'wrap', gap: '4rem' }}>
        
        {/* Left: Image Gallery */}
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F0EBE3' }}>
            {product.mainImage ? (
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            ) : (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '5rem', opacity: 0.5 }}>🕯️</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Info */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontFamily: 'Lato, sans-serif',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#9C8D7B',
              marginBottom: '1rem',
            }}
          >
            {product.category?.replace(/-/g, ' ')}
          </span>
          <h1
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 500,
              color: '#2D251F',
              margin: '0 0 1rem 0',
              lineHeight: 1.1,
            }}
          >
            {product.title}
          </h1>
          <p
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#B33939',
              margin: '0 0 2rem 0',
            }}
          >
            ৳{product.price.toLocaleString('en-BD')}
          </p>

          <div
            style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: '1rem',
              color: '#4A3F35',
              lineHeight: 1.6,
              marginBottom: '3rem',
            }}
          >
            {product.description ? (
              <PortableText value={product.description} />
            ) : (
              <p>Experience the luxurious scent and warm glow of the {product.title}. Hand-poured with love and crafted to perfection.</p>
            )}
          </div>

          <AddToCartButton product={product} />

          {/* Additional info */}
          <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(156,141,123,0.2)', paddingTop: '2rem' }}>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.8rem', color: '#9C8D7B', margin: '0 0 0.5rem 0' }}>
              ✓ Handcrafted in Bangladesh
            </p>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.8rem', color: '#9C8D7B', margin: '0 0 0.5rem 0' }}>
              ✓ 100% Premium Soy Wax
            </p>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: '0.8rem', color: '#9C8D7B', margin: 0 }}>
              ✓ Secure Delivery via Pathao/RedX
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
