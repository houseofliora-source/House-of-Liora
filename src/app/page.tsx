'use client'

import { useState, useEffect, useCallback } from 'react'
import Preloader from '@/components/ui/Preloader'
import ScrollStage from '@/components/scene/ScrollStage'
import { Product } from '@/types'
import { client } from '@/sanity/lib/client'
import { ALL_PRODUCTS_QUERY } from '@/sanity/lib/queries'

export default function HomePage() {
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  const handlePreloaderComplete = useCallback(() => setPreloaderDone(true), [])

  // ── Fetch products from Sanity ──────────────────────────────────────────────
  useEffect(() => {
    if (!preloaderDone) return

    let cancelled = false

    const fetchProducts = async () => {
      try {
        const data = await client.fetch<Product[]>(ALL_PRODUCTS_QUERY)
        if (!cancelled && data && data.length > 0) {
          setProducts(data)
        }
      } catch {
        console.info('Sanity not configured — showing placeholder products.')
      }
    }

    fetchProducts()

    return () => {
      cancelled = true
    }
  }, [preloaderDone])

  // ── Lock page scroll until the intro is ready ───────────────────────────────
  useEffect(() => {
    if (!preloaderDone) {
      document.body.classList.add('scroll-locked')
    } else {
      document.body.classList.remove('scroll-locked')
    }
    return () => {
      document.body.classList.remove('scroll-locked')
    }
  }, [preloaderDone])

  return (
    <>
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
      {preloaderDone && <ScrollStage products={products} />}
    </>
  )
}
