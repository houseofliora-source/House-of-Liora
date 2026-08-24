'use client'

import { useEffect, useRef } from 'react'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import('gsap')

      const tl = gsap.timeline({
        onComplete: () => {
          // Allow a brief pause before signalling completion
          setTimeout(onComplete, 200)
        },
      })

      // Entrance animations
      tl.fromTo(
        textRef.current,
        { opacity: 0, y: 30, letterSpacing: '0.3em' },
        {
          opacity: 1,
          y: 0,
          letterSpacing: '0.15em',
          duration: 1.2,
          ease: 'power3.out',
        }
      )
        .fromTo(
          dividerRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power2.inOut' },
          '-=0.4'
        )
        .fromTo(
          taglineRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
          '-=0.3'
        )
        // Hold for a moment
        .to({}, { duration: 1.2 })
        // Fade out
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.9,
          ease: 'power2.inOut',
          pointerEvents: 'none',
        })
    }

    init()
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      id="preloader"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#FAF6F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: '1.5px solid #9C8D7B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.75rem',
          opacity: 0.85,
        }}
      >
        <span
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#2D251F',
            letterSpacing: '0.05em',
          }}
        >
          HL
        </span>
      </div>

      {/* Brand name */}
      <h1
        ref={textRef}
        style={{
          fontFamily: 'Playfair Display, Georgia, serif',
          fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
          fontWeight: 400,
          color: '#2D251F',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          opacity: 0,
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        House of Liora
      </h1>

      {/* Divider */}
      <div
        ref={dividerRef}
        style={{
          width: '120px',
          height: '1px',
          backgroundColor: '#9C8D7B',
          transformOrigin: 'center',
          transform: 'scaleX(0)',
          opacity: 0,
        }}
      />

      {/* Tagline */}
      <p
        ref={taglineRef}
        style={{
          fontFamily: 'Lato, Helvetica, sans-serif',
          fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
          fontWeight: 300,
          color: '#9C8D7B',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          opacity: 0,
        }}
      >
        Gift for your loved ones
      </p>
    </div>
  )
}
