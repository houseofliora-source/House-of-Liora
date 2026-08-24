'use client'

import { useEffect, useRef, useCallback } from 'react'

export type ScrollStep = 0 | 1 | 2 | 3

interface UseScrollStoryOptions {
  onStepChange: (step: ScrollStep) => void
  onProgress: (step: ScrollStep, progress: number) => void
  totalSteps?: number
  enabled?: boolean
}

/**
 * useScrollStory — GSAP ScrollTrigger-based scroll narrative hook.
 * Pins the scene container and converts scroll distance into
 * discrete story steps (0–3) + per-step progress (0–1).
 */
export function useScrollStory({
  onStepChange,
  onProgress,
  totalSteps = 3,
  enabled = true,
}: UseScrollStoryOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const currentStepRef = useRef<ScrollStep>(0)
  const gsapRef = useRef<typeof import('gsap').gsap | null>(null)

  const cleanup = useCallback(() => {
    if (triggerRef.current) {
      triggerRef.current.kill()
      triggerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    let ctx: ReturnType<typeof import('gsap').gsap.context> | null = null

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      gsapRef.current = gsap

      if (!containerRef.current) return

      // Each step occupies one viewport-height worth of scroll distance
      const scrollDistance = window.innerHeight * totalSteps

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ paused: true })

        // Dummy tween — just drives progress from 0 → totalSteps
        tl.to({}, { duration: totalSteps })

        triggerRef.current = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${scrollDistance}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const totalProgress = self.progress * totalSteps
            const rawStep = Math.floor(totalProgress)
            const step = Math.min(rawStep, totalSteps - 1) as ScrollStep
            const stepProgress = totalProgress - step

            // Notify step change
            if (step !== currentStepRef.current) {
              currentStepRef.current = step
              onStepChange(step)
            }

            // Always notify progress
            onProgress(step, Math.min(stepProgress, 1))
          },
        })
      }, containerRef)
    }

    init()

    return () => {
      ctx?.revert()
      cleanup()
    }
  }, [onStepChange, onProgress, totalSteps, enabled, cleanup])

  return { containerRef }
}
