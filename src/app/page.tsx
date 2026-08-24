'use client'

import { useState, useCallback, useEffect } from 'react'
import Preloader from '@/components/ui/Preloader'
import CandleScene from '@/components/scene/CandleScene'
import ProductGrid from '@/components/shop/ProductGrid'
import { useScrollStory } from '@/hooks/useScrollStory'
import { Product, ScrollStep } from '@/types'
import { client } from '@/sanity/lib/client'
import { ALL_PRODUCTS_QUERY } from '@/sanity/lib/queries'

export default function HomePage() {
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [currentStep, setCurrentStep] = useState<ScrollStep>(0)
  const [stepProgress, setStepProgress] = useState(0)
  const [products, setProducts] = useState<Product[]>([])

  // ── Fetch products from Sanity ──────────────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await client.fetch<Product[]>(ALL_PRODUCTS_QUERY)
        if (data && data.length > 0) {
          setProducts(data)
        }
      } catch (err) {
        // Sanity not configured yet — placeholder products in ProductGrid will show
        console.info('Sanity not configured. Using placeholder products.')
      }
    }
    if (preloaderDone) {
      fetchProducts()
    }
  }, [preloaderDone])

  // ── Scroll story callbacks ─────────────────────────────────────────────────
  const handleStepChange = useCallback((step: ScrollStep) => {
    setCurrentStep(step)
  }, [])

  const handleProgress = useCallback((step: ScrollStep, progress: number) => {
    setCurrentStep(step)
    setStepProgress(progress)
  }, [])

  // ── Attach GSAP scroll story ONLY after preloader finishes ─────────────────
  const { containerRef } = useScrollStory({
    onStepChange: handleStepChange,
    onProgress: handleProgress,
    totalSteps: 3,
    enabled: preloaderDone,
  })

  // ── Lock/unlock body scroll ─────────────────────────────────────────────────
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
      {/* ── Preloader ── */}
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      {/* ── Scroll container (pinned by GSAP) ── */}
      <div
        ref={containerRef}
        id="scroll-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {/* ── The Candle Scene (scroll steps 0–1) ── */}
        <CandleScene step={currentStep} stepProgress={stepProgress} />
      </div>

      {/* ── Product Grid (Normal flow, slides over the pinned scene) ── */}
      <div 
        style={{ 
          position: 'relative', 
          zIndex: 20,
          marginTop: '-100vh' // Overlaps the pin-spacer visually, causing a native "curtain reveal" slide-up effect
        }}
      >
        <ProductGrid
          products={products}
          slideProgress={stepProgress}
          isActive={true}
        />
      </div>
    </>
  )
}
