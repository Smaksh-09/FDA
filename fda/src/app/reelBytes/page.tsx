"use client"

import { useState, useEffect } from 'react'
import { ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import ReelVideoPlayer from '../components/ui/ReelVideoPlayer'
import ReelPlaylist from '../components/ui/ReelPlaylist'
import ReelInspector from '../components/ui/ReelInspector'
import MobileMenuDrawer from '../components/ui/MobileMenuDrawer'
import MobileCommentsModal from '../components/ui/MobileCommentsModal'
import MobileVideoIndicators from '../components/ui/MobileVideoIndicators'
import { Reel } from './types'

type ApiReel = {
  id: string
  videoUrl: string
  caption?: string | null
  createdAt: string
  foodItem: {
    id: string
    name: string
    price: number
  }
  restaurant: {
    id: string
    name: string
    imageUrl?: string | null
  }
}

export default function ReelBytesPage() {
  const [currentReel, setCurrentReel] = useState<Reel | null>(null)
  const [playlist, setPlaylist] = useState<Reel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Detect if user is on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Fetch reels from backend
  useEffect(() => {
    const fetchReels = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/reels?limit=20', { cache: 'no-store' })
        if (!response.ok) throw new Error('Failed to load reels')
        const data: { reels: ApiReel[]; nextCursor?: string | null } = await response.json()

        if (data.reels && data.reels.length > 0) {
          const mapped: Reel[] = data.reels.map((r) => ({
            id: r.id,
            videoUrl: r.videoUrl,
            caption: r.caption ?? '',
            restaurant: {
              id: r.restaurant.id,
              name: r.restaurant.name,
              logoUrl: r.restaurant.imageUrl ?? '/placeholder-restaurant.jpg',
              rating: 4.8, // placeholder until backend provides
              deliveryTime: '15-25 min', // placeholder until backend provides
            },
            foodItem: {
              id: r.foodItem.id,
              name: r.foodItem.name,
              price: r.foodItem.price,
              description: '',
              imageUrl: '/placeholder-food.jpg',
            },
            comments: [],
            likes: 0,
            views: 0,
            createdAt: r.createdAt,
          }))

          setCurrentReel(mapped[0])
          setPlaylist(mapped.slice(1))
        } else {
          setCurrentReel(null)
          setPlaylist([])
        }
      } catch (err) {
        console.error(err)
        setCurrentReel(null)
        setPlaylist([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchReels()
  }, [])

  const handleReelSelect = (selectedReel: Reel) => {
    // Update current reel
    setCurrentReel(selectedReel)
    
    // Remove selected reel from playlist and add current reel to the end
    const newPlaylist = playlist.filter(reel => reel.id !== selectedReel.id)
    if (currentReel) newPlaylist.push(currentReel)
    setPlaylist(newPlaylist)
  }

  const goToNextReel = () => {
    if (playlist.length > 0) {
      handleReelSelect(playlist[0])
    }
  }

  const goToPreviousReel = () => {
    // Find current reel index in the full list
    const allReels = currentReel ? [currentReel, ...playlist] : [...playlist]
    const currentIndex = 0 // Current reel is always at index 0
    
    if (currentIndex < allReels.length - 1) {
      // Go to next reel (swipe up behavior)
      goToNextReel()
    }
  }

  // Handle touch events for mobile swipe navigation
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
      // Swipe up - go to next reel
      goToNextReel()
    } else if (isDownSwipe) {
      // Swipe down - go to previous reel (for now, just stay on current)
      // Could implement going back in history here
      console.log('Swipe down detected')
    }
  }

  // Auto-advance to next reel (simulating end of video)
  useEffect(() => {
    const autoAdvanceTimer = setTimeout(() => {
      // This would normally be triggered by video end event
      // For demo purposes, we'll auto-advance every 30 seconds
      // goToNextReel()
    }, 30000)

    return () => clearTimeout(autoAdvanceTimer)
  }, [currentReel])

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      {/* Header Navigation - Hidden on Mobile */}
      {!isMobile && (
        <header className="bg-white border-b-2 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-black font-bold hover:text-[#39FF14] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <div className="w-px h-6 bg-black"></div>
            <h1 className="text-2xl font-black text-black">ReelBites.</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black text-black font-bold hover:bg-gray-50 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {isMobile ? (
          /* Mobile Layout - Full screen video with swipe */
          <div 
            className="w-full h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {currentReel ? (
              <ReelVideoPlayer 
                reel={currentReel}
                isActive={true}
                isMobile={true}
                onCommentClick={() => setIsCommentsModalOpen(true)}
                onMenuClick={() => setIsMobileMenuOpen(true)}
              />
            ) : (
              <div className="min-h-screen flex items-center justify-center text-black">Loading...</div>
            )}
            
            {/* Mobile UI Overlays */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
              {/* Swipe Indicator */}
              <div className="bg-black bg-opacity-60 border border-white px-2 py-1 text-white text-xs font-bold">
                Swipe ↑ for next
              </div>
              
              {/* Video Progress Indicators */}
              <MobileVideoIndicators 
                currentIndex={0}
                totalVideos={playlist.length + 1}
                className="w-20"
              />
            </div>
          </div>
        ) : (
          /* Desktop Layout - Three Column */
          <>
            {/* Left Column - Playlist */}
            <aside className="w-80 flex-shrink-0">
              <ReelPlaylist 
                playlist={playlist}
                currentReelId={currentReel?.id ?? ''}
                onReelSelect={handleReelSelect}
              />
            </aside>

            {/* Center Column - Video Player (letterboxed, centered) */}
            <section className="flex-1 p-4 bg-black">
              <div className="h-full w-full flex items-center justify-center">
                <div className="relative w-full max-w-[420px] aspect-[9/16]">
                  {currentReel ? (
                    <ReelVideoPlayer 
                      reel={currentReel}
                      isActive={true}
                      isMobile={false}
                    />
                  ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center text-white border-2 border-black">
                      Loading...
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Right Column - Inspector */}
            <aside className="w-96 flex-shrink-0">
              {currentReel ? (
                <ReelInspector reel={currentReel} />
              ) : (
                <div className="h-full bg-[#F5F5F5] border-2 border-black flex items-center justify-center">Loading...</div>
              )}
            </aside>
          </>
        )}
      </main>

      {/* Mobile Components */}
      {isMobile && currentReel && (
        <>
          <MobileMenuDrawer
            reel={currentReel}
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
          
          <MobileCommentsModal
            reel={currentReel}
            isOpen={isCommentsModalOpen}
            onClose={() => setIsCommentsModalOpen(false)}
          />
        </>
      )}
    </div>
  )
}
