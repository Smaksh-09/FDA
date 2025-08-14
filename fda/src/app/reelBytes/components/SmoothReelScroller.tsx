"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { Reel } from '../types'
import ReelVideoPlayer from '../../components/ui/ReelVideoPlayer'

interface SmoothReelScrollerProps {
  reels: Reel[]
  initialIndex: number
  isMobile: boolean
  onIndexChange: (index: number) => void
  onCommentClick?: () => void
  onMenuClick?: () => void
  onOrderClick?: () => void
}

export default function SmoothReelScroller({
  reels,
  initialIndex,
  isMobile,
  onIndexChange,
  onCommentClick,
  onMenuClick,
  onOrderClick
}: SmoothReelScrollerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isAnimating, setIsAnimating] = useState(false)
  const [wrapperTransform, setWrapperTransform] = useState('translateY(0)')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const lastScrollTimeRef = useRef<number>(0)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Scroll throttling - prevent oversensitive scrolling
  const SCROLL_THROTTLE = 800 // 800ms between scroll events
  const ANIMATION_DURATION = 500 // 500ms animation duration

  // Get the three reels for the current view (previous, current, next)
  const getReelsForView = useCallback(() => {
    const previousReel = currentIndex > 0 ? reels[currentIndex - 1] : null
    const currentReel = reels[currentIndex] || null
    const nextReel = currentIndex < reels.length - 1 ? reels[currentIndex + 1] : null

    return { previousReel, currentReel, nextReel }
  }, [reels, currentIndex])

  // Update parent component when index changes
  useEffect(() => {
    onIndexChange(currentIndex)
  }, [currentIndex, onIndexChange])

  // Handle navigation to next reel
  const goToNext = useCallback(() => {
    if (isAnimating || currentIndex >= reels.length - 1) return

    const now = Date.now()
    if (now - lastScrollTimeRef.current < SCROLL_THROTTLE) return

    lastScrollTimeRef.current = now
    setIsAnimating(true)

    // Start animation - slide up
    setWrapperTransform('translateY(-100%)')

    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current)
    }

    // After animation completes, reset position and update state
    animationTimeoutRef.current = setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setWrapperTransform('translateY(0)')
      setIsAnimating(false)
    }, ANIMATION_DURATION)
  }, [isAnimating, currentIndex, reels.length])

  // Handle navigation to previous reel
  const goToPrevious = useCallback(() => {
    if (isAnimating || currentIndex <= 0) return

    const now = Date.now()
    if (now - lastScrollTimeRef.current < SCROLL_THROTTLE) return

    lastScrollTimeRef.current = now
    setIsAnimating(true)

    // Start animation - slide down
    setWrapperTransform('translateY(100%)')

    // Clear any existing timeout
    if (animationTimeoutRef.current) {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current)
    }

    // After animation completes, reset position and update state
    animationTimeoutRef.current = setTimeout(() => {
      setCurrentIndex(prev => prev - 1)
      setWrapperTransform('translateY(0)')
      setIsAnimating(false)
    }, ANIMATION_DURATION)
  }, [isAnimating, currentIndex])

  // Touch event handlers for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isUpSwipe = distance > 50
    const isDownSwipe = distance < -50

    if (isUpSwipe) {
      goToNext()
    } else if (isDownSwipe) {
      goToPrevious()
    }
  }

  // Mouse wheel handler for desktop
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()

    if (e.deltaY > 0) {
      goToNext()
    } else if (e.deltaY < 0) {
      goToPrevious()
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  const { previousReel, currentReel, nextReel } = getReelsForView()

  return (
    <div 
      className="h-full w-full overflow-hidden relative bg-black"
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
      onWheel={!isMobile ? handleWheel : undefined}
    >
      {/* Smooth scrolling wrapper */}
      <div
        ref={wrapperRef}
        className="h-full w-full"
        style={{
          transform: wrapperTransform,
          transition: isAnimating ? `transform ${ANIMATION_DURATION}ms ease-in-out` : 'none',
        }}
      >
        {/* Previous Reel (positioned above current view) */}
        <div className="h-full w-full absolute top-[-100%] left-0">
          {previousReel && (
            <ReelVideoPlayer
              key={`prev-${previousReel.id}`}
              reel={previousReel}
              isActive={false} // Not active since it's not the current reel
              isMobile={isMobile}
              onCommentClick={onCommentClick}
              onMenuClick={onMenuClick}
              onOrderClick={onOrderClick}
            />
          )}
        </div>

        {/* Current Reel (positioned in current view) */}
        <div className="h-full w-full absolute top-0 left-0">
          {currentReel && (
            <ReelVideoPlayer
              key={`current-${currentReel.id}`}
              reel={currentReel}
              isActive={!isAnimating} // Active only when not animating
              isMobile={isMobile}
              onCommentClick={onCommentClick}
              onMenuClick={onMenuClick}
              onOrderClick={onOrderClick}
            />
          )}
        </div>

        {/* Next Reel (positioned below current view) */}
        <div className="h-full w-full absolute top-[100%] left-0">
          {nextReel && (
            <ReelVideoPlayer
              key={`next-${nextReel.id}`}
              reel={nextReel}
              isActive={false} // Not active since it's not the current reel
              isMobile={isMobile}
              onCommentClick={onCommentClick}
              onMenuClick={onMenuClick}
              onOrderClick={onOrderClick}
            />
          )}
        </div>
      </div>

      {/* Visual indicators */}
      {isMobile && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
          <div className="bg-black bg-opacity-60 border border-white px-2 py-1 text-white text-xs font-bold">
            Swipe ↑ for next {currentIndex > 0 && "| ↓ for prev"}
          </div>
        </div>
      )}

      {!isMobile && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-60 border border-white px-3 py-2 text-white text-xs font-bold z-10 pointer-events-none">
          Scroll {currentIndex > 0 && "↑ "}↓ for more reels
        </div>
      )}
    </div>
  )
}
