'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'

const FRAME_COUNT = 190
const FRAME_PREFIX = '/frames/ezgif-frame-'
const FRAME_SUFFIX = '.jpg'

/** Zero-pads a frame index to the 3-digit filename convention (ezgif-frame-001.jpg). */
function pad(value: number, length: number): string {
  let str = String(value)
  while (str.length < length) str = '0' + str
  return str
}

export interface CanvasSceneProps {
  /** Called once every frame image has finished decoding. */
  onReady?: () => void
  /** Called on every scrub tick with the sequence progress, 0–1. */
  onProgress?: (progress: number) => void
}

export interface CanvasSceneHandle {
  /** Draws the frame corresponding to a 0–1 progress value. */
  renderProgress: (progress: number) => void
}

/**
 * Full-bleed, scroll-scrubbed frame sequence.
 *
 * This component owns ONLY the painting of the canvas — it deliberately does not
 * create its own ScrollTrigger. The parent stage drives it through the imperative
 * handle so that the frame scrub and the product panel slide-up live on a single
 * synchronised timeline.
 */
const CanvasScene = React.forwardRef<CanvasSceneHandle, CanvasSceneProps>(
  function CanvasScene({ onReady, onProgress }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imagesRef = useRef<HTMLImageElement[]>([])
    const currentFrameRef = useRef<number>(-1)

    const [imagesLoaded, setImagesLoaded] = useState(false)
    const [loadingProgress, setLoadingProgress] = useState(0)

    // ── Cover-fit painter ─────────────────────────────────────────────────────
    // Fills the entire canvas edge-to-edge. Crops overflow; never distorts.
    const drawFrame = useCallback((index: number) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const context = canvas.getContext('2d')
      if (!context) return

      const clamped = Math.max(0, Math.min(FRAME_COUNT - 1, index))
      const img = imagesRef.current[clamped]
      if (!img || !img.complete || img.naturalWidth === 0) return

      currentFrameRef.current = clamped

      // CSS pixel dimensions of the canvas box.
      const viewW = canvas.clientWidth
      const viewH = canvas.clientHeight
      if (viewW === 0 || viewH === 0) return

      context.clearRect(0, 0, viewW, viewH)

      // `cover` maths: scale so the image fully covers the box, then centre it.
      const ratio = Math.max(viewW / img.naturalWidth, viewH / img.naturalHeight)
      const drawW = img.naturalWidth * ratio
      const drawH = img.naturalHeight * ratio
      const offsetX = (viewW - drawW) / 2
      const offsetY = (viewH - drawH) / 2

      context.drawImage(img, offsetX, offsetY, drawW, drawH)
    }, [])

    // ── Size the backing store to the viewport at device pixel ratio ──────────
    const resizeCanvas = useCallback(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const context = canvas.getContext('2d')
      if (!context) return

      // Cap DPR at 3 — beyond that the memory cost outweighs the visual gain.
      const dpr = Math.min(window.devicePixelRatio || 1, 3)
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (width === 0 || height === 0) return

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)

      // Draw in CSS pixels; the transform maps them onto the HiDPI backing store.
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const frame = currentFrameRef.current
      drawFrame(frame >= 0 ? frame : 0)
    }, [drawFrame])

    // ── Expose the imperative painter to the parent stage ─────────────────────
    React.useImperativeHandle(
      ref,
      () => ({
        renderProgress: (progress: number) => {
          const clampedProgress = Math.max(0, Math.min(1, progress))
          const frame = Math.round(clampedProgress * (FRAME_COUNT - 1))
          if (frame !== currentFrameRef.current) {
            drawFrame(frame)
          }
          onProgress?.(clampedProgress)
        },
      }),
      [drawFrame, onProgress]
    )

    // ── Preload every frame ───────────────────────────────────────────────────
    useEffect(() => {
      let cancelled = false
      let loadedCount = 0
      const images: HTMLImageElement[] = new Array(FRAME_COUNT)

      const settle = () => {
        if (cancelled) return
        loadedCount++
        setLoadingProgress(Math.floor((loadedCount / FRAME_COUNT) * 100))
        if (loadedCount === FRAME_COUNT) {
          setImagesLoaded(true)
        }
      }

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new window.Image()
        img.decoding = 'async'
        img.src = `${FRAME_PREFIX}${pad(i + 1, 3)}${FRAME_SUFFIX}`
        img.onload = settle
        // A missing/corrupt frame must not deadlock the loader.
        img.onerror = settle
        images[i] = img
      }

      imagesRef.current = images

      return () => {
        cancelled = true
        images.forEach((img) => {
          img.onload = null
          img.onerror = null
        })
      }
    }, [])

    // ── First paint + resize handling ─────────────────────────────────────────
    useEffect(() => {
      if (!imagesLoaded) return

      resizeCanvas()
      onReady?.()

      let resizeTimer: ReturnType<typeof setTimeout> | null = null
      const handleResize = () => {
        if (resizeTimer) clearTimeout(resizeTimer)
        resizeTimer = setTimeout(resizeCanvas, 120)
      }

      window.addEventListener('resize', handleResize)
      window.addEventListener('orientationchange', handleResize)

      return () => {
        if (resizeTimer) clearTimeout(resizeTimer)
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('orientationchange', handleResize)
      }
    }, [imagesLoaded, resizeCanvas, onReady])

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: '#FAF6F0',
        }}
      >
        {/* Full-bleed canvas — no margins, no letterboxing, no side gaps. */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            border: 'none',
          }}
        />

        {/* Loading state — shown BEFORE the sequence, never stamped over frames. */}
        {!imagesLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FAF6F0',
              zIndex: 2,
            }}
          >
            <p
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: '0.7rem',
                color: '#9C8D7B',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
              }}
            >
              Preparing the experience — {loadingProgress}%
            </p>
            <div
              style={{
                width: '180px',
                height: '1px',
                backgroundColor: 'rgba(156,141,123,0.25)',
              }}
            >
              <div
                style={{
                  width: `${loadingProgress}%`,
                  height: '100%',
                  backgroundColor: '#9C8D7B',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
)

export default CanvasScene
