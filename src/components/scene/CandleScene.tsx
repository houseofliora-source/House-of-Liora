'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import CandleFlame from './CandleFlame'
import { ScrollStep } from '@/types'

interface CandleSceneProps {
  /** Current scroll story step (0–3) */
  step: ScrollStep
  /** Progress within the current step (0–1) */
  stepProgress: number
}

export default function CandleScene({ step, stepProgress }: CandleSceneProps) {
  const candleWrapRef = useRef<HTMLDivElement>(null)

  // ─── Step 0: Rotate from top-down (75°) to side view (0°) ───
  const rotateX =
    step === 0
      ? 75 - 75 * stepProgress  // 75° → 0° (top-down to side)
      : 0

  // ─── Step 1: Flame intensity ───
  const flameIntensity =
    step === 0
      ? 0
      : step === 1
        ? stepProgress
        : 1

  // ─── Step 0 hint: side image fades in as rotation completes ───
  const sideImageOpacity =
    step === 0
      ? stepProgress
      : 1

  const topImageOpacity =
    step === 0
      ? 1 - stepProgress
      : 0

  // ─── Candle scale: subtle zoom on step 1 ───
  const candleScale = step === 1 ? 1 + 0.04 * stepProgress : step > 1 ? 1.04 : 1

  // ─── Scroll hint arrow (visible at very start) ───
  const hintOpacity = step === 0 ? 1 - stepProgress * 3 : 0

  // ─── Brand name overlay: fades on step 2 ───
  const brandOpacity = step < 2 ? 1 : 0

  return (
    <div
      id="candle-scene"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: '#FAF6F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* ── Background radial glow (intensifies on step 2) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255, 140, 50, ${
            flameIntensity * 0.12
          }) 0%, transparent 70%)`,
          pointerEvents: 'none',
          transition: 'background 0.5s ease',
        }}
      />

      {/* ── Brand wordmark ── */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: brandOpacity,
          transition: 'opacity 0.5s ease',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: '#9C8D7B',
            fontWeight: 400,
          }}
        >
          House of Liora
        </p>
      </div>

      {/* ── Step indicator dots ── */}
      <div
        style={{
          position: 'absolute',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          zIndex: 10,
          opacity: step < 3 ? 0.8 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: step > i ? '#B33939' : '#9C8D7B',
              transition: 'background-color 0.4s ease, transform 0.3s ease',
              transform: step === i + 1 ? 'scale(1.6)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* ── Candle 3D perspective wrapper ── */}
      <div
        className="candle-perspective"
        style={{
          width: 'min(420px, 80vw)',
          height: 'min(420px, 80vw)',
          position: 'relative',
        }}
      >
        <div
          ref={candleWrapRef}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transform: `rotateX(${rotateX}deg) scale(${candleScale})`,
            transition: 'transform 0.05s linear',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Top-down image */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: topImageOpacity,
              transition: 'opacity 0.1s linear',
            }}
          >
            <Image
              src="/images/candle-top.svg"
              alt="Red rose candle — top-down view"
              fill
              unoptimized
              style={{ objectFit: 'contain' }}
              priority
              sizes="(max-width: 768px) 80vw, 420px"
            />
          </div>

          {/* Side view image */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: sideImageOpacity,
              transition: 'opacity 0.1s linear',
            }}
          >
            <Image
              src="/images/candle-side.svg"
              alt="Red rose candle — side view, unlit"
              fill
              unoptimized
              style={{ objectFit: 'contain' }}
              priority
              sizes="(max-width: 768px) 80vw, 420px"
            />
          </div>

          {/* ── Candle Flame ── */}
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 5,
            }}
          >
            <CandleFlame intensity={flameIntensity} />
          </div>
        </div>
      </div>

      {/* ── Step labels ── */}
      {step === 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '6rem',
            textAlign: 'center',
            opacity: Math.min(stepProgress * 3, 1),
            transform: `translateY(${(1 - Math.min(stepProgress * 2, 1)) * 10}px)`,
            transition: 'none',
          }}
        >
          <p
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              color: '#2D251F',
              fontStyle: 'italic',
              letterSpacing: '0.05em',
            }}
          >
            A candle for every moment
          </p>
        </div>
      )}

      {step === 2 && (
        <div
          style={{
            position: 'absolute',
            bottom: '6rem',
            textAlign: 'center',
            opacity: Math.min(stepProgress * 2, 1),
          }}
        >
          <p
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              color: '#B33939',
              fontStyle: 'italic',
              letterSpacing: '0.05em',
            }}
          >
            Let it burn bright
          </p>
        </div>
      )}

      {/* ── Scroll hint (step 0) ── */}
      <div
        className="scroll-indicator"
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: hintOpacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            fontFamily: 'Lato, Helvetica, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#9C8D7B',
          }}
        >
          Scroll to explore
        </span>
        {/* Animated chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            animation: 'bounce 1.5s ease-in-out infinite',
          }}
        >
          <path
            d="M2 5L8 11L14 5"
            stroke="#9C8D7B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
    </div>
  )
}
