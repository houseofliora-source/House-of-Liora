'use client'

interface CandleFlameProps {
  /** 0 = invisible, 1 = fully lit */
  intensity: number
  className?: string
}

export default function CandleFlame({ intensity, className = '' }: CandleFlameProps) {
  const visible = intensity > 0.05

  return (
    <div
      className={className}
      style={{
        opacity: intensity,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Outer glow ring */}
      {visible && (
        <div
          style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,160,50,0.35) 0%, rgba(255,100,20,0.15) 50%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -60%)',
            animation: intensity > 0.5 ? 'glowPulse 2s ease-in-out infinite' : 'none',
            filter: `blur(${4 + intensity * 6}px)`,
          }}
        />
      )}

      {/* Flame SVG */}
      <div
        className="flame-container"
        style={{
          animation: intensity > 0.5 ? 'flicker 2s ease-in-out infinite' : 'none',
          transformOrigin: 'bottom center',
        }}
      >
        <svg
          width="28"
          height="52"
          viewBox="0 0 28 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          {/* Outer flame — warm orange */}
          <path
            d="M14 52 C4 48 0 38 2 28 C4 18 8 12 10 4 C11 0 14 0 14 0 C14 0 17 0 18 4 C20 12 24 18 26 28 C28 38 24 48 14 52Z"
            fill="url(#outerFlameGradient)"
          />
          {/* Inner flame — bright yellow-white */}
          <path
            d="M14 46 C8 42 7 34 9 26 C10 20 12 15 13 9 C13.5 6 14 5 14 5 C14 5 14.5 6 15 9 C16 15 18 20 19 26 C21 34 20 42 14 46Z"
            fill="url(#innerFlameGradient)"
          />
          {/* Core — white hot center */}
          <ellipse
            cx="14"
            cy="32"
            rx="3"
            ry="8"
            fill="url(#coreGradient)"
            opacity="0.8"
          />
          <defs>
            <radialGradient
              id="outerFlameGradient"
              cx="50%"
              cy="80%"
              r="70%"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0%" stopColor="#FF8C00" />
              <stop offset="50%" stopColor="#FF4500" />
              <stop offset="100%" stopColor="#CC2200" stopOpacity="0.7" />
            </radialGradient>
            <radialGradient
              id="innerFlameGradient"
              cx="50%"
              cy="85%"
              r="60%"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="40%" stopColor="#FFB833" />
              <stop offset="100%" stopColor="#FF6600" stopOpacity="0.5" />
            </radialGradient>
            <radialGradient
              id="coreGradient"
              cx="50%"
              cy="50%"
              r="50%"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#FFF5CC" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#FFE066" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  )
}
