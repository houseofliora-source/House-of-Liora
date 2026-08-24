'use client'

import React, { useRef, useEffect, useLayoutEffect, useState, useCallback } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import CanvasScene, { type CanvasSceneHandle } from './CanvasScene'
import ProductGrid from '@/components/shop/ProductGrid'
import { Product } from '@/types'

/**
 * Scroll budget, expressed in viewport heights (1 = 100vh).
 *
 *   scrollY 0            → FRAME_SCROLL_VH   frame sequence scrubs; panel 100% offscreen
 *   scrollY FRAME_SCROLL → TOTAL_SCROLL_VH   panel slides up over the pinned hero
 *   scrollY TOTAL_SCROLL                     == max scroll; panel covers, scrolls internally
 */
const FRAME_SCROLL_VH = 3.6
const SLIDE_SCROLL_VH = 1
const TOTAL_SCROLL_VH = FRAME_SCROLL_VH + SLIDE_SCROLL_VH

/**
 * Max scrollY == documentHeight - viewportHeight, so the driver must be one
 * viewport TALLER than the scroll distance we actually want to consume.
 * 4.6 + 1 = 5.6 → max scrollY = 5.6vh - 1vh = 4.6vh = TOTAL_SCROLL_VH exactly.
 * This is what guarantees the slide-up is reachable AND that there is no dead
 * scroll left over once it completes.
 */
const DRIVER_VH = TOTAL_SCROLL_VH + 1

/** Progress past which the panel is treated as fully settled over the hero. */
const SETTLED_THRESHOLD = 0.999

export interface ScrollStageProps {
  products: Product[]
}

/**
 * Two permanently-fixed layers plus one scroll driver.
 *
 * Layer 1 (z-index 1): the hero canvas — `position: fixed`, so it is visually
 * pinned for the whole experience without GSAP pin-spacers, and therefore
 * without any of the layout-jump / dead-space problems those bring.
 *
 * Layer 2 (z-index 10): the product panel — also `position: fixed; inset: 0`,
 * translated to `yPercent: 100` so it sits exactly one viewport below the fold
 * and is 100% invisible. GSAP scrubs it back to `yPercent: 0`, at which point it
 * covers the hero precisely, edge to edge.
 *
 * Neither layer contributes document height, so the scroll length comes solely
 * from `#scroll-driver` — which is what lets the document end at exactly the
 * scroll position where the slide-up completes.
 *
 * Note both fixed layers size themselves with `inset: 0` rather than
 * `100vw/100vh`: `100vw` would include the desktop scrollbar width (horizontal
 * overflow) and `100vh` overshoots the visible area on mobile when the URL bar
 * is showing. `inset: 0` is exactly the viewport on every platform.
 */
export default function ScrollStage({ products }: ScrollStageProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const driverRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const canvasApiRef = useRef<CanvasSceneHandle>(null)

  const [canvasReady, setCanvasReady] = useState(false)
  const [panelSettled, setPanelSettled] = useState(false)
  const [showScrollCue, setShowScrollCue] = useState(true)

  const handleCanvasReady = useCallback(() => setCanvasReady(true), [])

  // ── Hide the panel before the browser can paint it ──────────────────────────
  useLayoutEffect(() => {
    if (!panelRef.current) return
    gsap.set(panelRef.current, { yPercent: 100 })
  }, [])

  // ── Start every visit at the top of the story ───────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // ── The scroll timeline ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!canvasReady) return

    const driver = driverRef.current
    const panel = panelRef.current
    if (!driver || !panel) return

    // Registered here rather than at module scope so nothing plugin-related is
    // evaluated during the server render.
    gsap.registerPlugin(ScrollTrigger)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scrub: number | boolean = prefersReducedMotion ? true : 1

    const ctx = gsap.context(() => {
      // ── Phase 1: frame sequence scrub, scrollY 0 → 360vh ───────────────────
      const playhead = { progress: 0 }

      gsap.to(playhead, {
        progress: 1,
        ease: 'none',
        onUpdate: () => {
          canvasApiRef.current?.renderProgress(playhead.progress)
        },
        scrollTrigger: {
          trigger: driver,
          start: 'top top',
          end: () => `+=${window.innerHeight * FRAME_SCROLL_VH}`,
          scrub,
          invalidateOnRefresh: true,
          // Fade the graphical cue out as soon as the story starts moving.
          onUpdate: (self) => setShowScrollCue(self.progress < 0.015),
        },
      })

      // ── Phase 2: panel slides up over the pinned hero, 360vh → 460vh ───────
      // yPercent is relative to the panel's own height. The panel is
      // `position: fixed; inset: 0`, so its height is always exactly one
      // viewport — which makes 100 exactly offscreen and 0 an exact cover, and
      // keeps both correct when the viewport resizes (e.g. mobile URL bar).
      gsap.fromTo(
        panel,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: driver,
            start: () => `top top-=${window.innerHeight * FRAME_SCROLL_VH}`,
            end: () => `top top-=${window.innerHeight * TOTAL_SCROLL_VH}`,
            scrub,
            invalidateOnRefresh: true,
            onUpdate: (self) => setPanelSettled(self.progress >= SETTLED_THRESHOLD),
            // With a lagging scrub the progress callback can miss the exact
            // endpoints, so latch the state on the boundary callbacks too.
            onLeave: () => setPanelSettled(true),
            onEnterBack: () => setPanelSettled(false),
            onLeaveBack: () => setPanelSettled(false),
          },
        }
      )
    }, rootRef)

    // Keep the viewport-dependent start/end values honest across resizes.
    let resizeTimer: ReturnType<typeof setTimeout> | null = null
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150)
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
      // revert() kills the triggers and undoes the inline transforms, so React
      // StrictMode's double-invoke and fast refresh cannot leave duplicates.
      ctx.revert()
    }
  }, [canvasReady])

  // Product data arrives after mount. Both layers are fixed so the document
  // height cannot change, but refresh anyway so measurements stay accurate.
  useEffect(() => {
    if (!canvasReady) return
    ScrollTrigger.refresh()
  }, [products, canvasReady])

  return (
    <div ref={rootRef}>
      {/* ── Layer 1: pinned, full-bleed hero canvas ── */}
      <div
        id="hero-layer"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          overflow: 'hidden',
          backgroundColor: '#FAF6F0',
        }}
      >
        <CanvasScene ref={canvasApiRef} onReady={handleCanvasReady} />

        {/* Graphical-only scroll cue — no text is stamped over the frames. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '2.25rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 2,
            opacity: canvasReady && showScrollCue ? 1 : 0,
            transition: 'opacity 0.6s ease',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              display: 'block',
              width: '1px',
              height: '46px',
              background: 'linear-gradient(to bottom, rgba(156,141,123,0), #9C8D7B)',
            }}
          />
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
            <path
              d="M1 1L7 7L13 1"
              stroke="#9C8D7B"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* ── Layer 2: the slide-up product panel ── */}
      <div
        id="product-panel-layer"
        ref={panelRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10,
          willChange: 'transform',
          // Mid-slide the panel must not swallow wheel events or clicks,
          // otherwise its inner scroller would stall the slide.
          pointerEvents: panelSettled ? 'auto' : 'none',
          boxShadow: '0 -24px 60px rgba(45,37,31,0.18)',
        }}
      >
        <ProductGrid products={products} scrollEnabled={panelSettled} />
      </div>

      {/* ── Scroll driver: the only element contributing document height ── */}
      <div
        id="scroll-driver"
        ref={driverRef}
        aria-hidden="true"
        style={{
          position: 'relative',
          width: '100%',
          height: `${DRIVER_VH * 100}vh`,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
