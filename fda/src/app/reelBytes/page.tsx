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
import SmoothReelScroller from './components/SmoothReelScroller'
import { Reel } from './types'
import OrderConfirmModal from './OrderConfirmModal'

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
  const [allReels, setAllReels] = useState<Reel[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Derived state - get current reel from the array
  const currentReel = allReels.length > 0 ? allReels[currentIndex] : null

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
        const response = await fetch('/api/reels?limit=20', { cache: 'no-store', credentials: 'include' })
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

          setAllReels(mapped)
          setCurrentIndex(0)
        } else {
          setAllReels([])
          setCurrentIndex(0)
        }
      } catch (err) {
        console.error(err)
        setAllReels([])
        setCurrentIndex(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReels()
  }, [])

  const handleReelSelect = (selectedReel: Reel) => {
    // Find the index of the selected reel in allReels
    const index = allReels.findIndex(reel => reel.id === selectedReel.id)
    if (index !== -1) {
      setCurrentIndex(index)
    }
  }

  const handleIndexChange = (newIndex: number) => {
    setCurrentIndex(newIndex)
  }

  // Auto-advance to next reel (simulating end of video)
  useEffect(() => {
    const autoAdvanceTimer = setTimeout(() => {
      // This would normally be triggered by video end event
      // For demo purposes, we'll auto-advance every 30 seconds
      // goToNextReel()
    }, 30000)

    return () => clearTimeout(autoAdvanceTimer)
  }, [currentIndex])

  return (
    <div className="h-screen bg-[#F5F5F5] flex flex-col overflow-hidden">
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
          /* Mobile Layout - Full screen video with smooth scrolling */
          <div className="relative w-full h-full flex flex-col">
            {/* Video Progress Indicators */}
            <div className="absolute top-4 right-4 z-30 pointer-events-none">
              <MobileVideoIndicators 
                currentIndex={currentIndex}
                totalVideos={allReels.length}
                className="w-20"
              />
            </div>

            {/* Smooth Scrolling Video Player */}
            <div className="flex-1 relative overflow-hidden">
              {allReels.length > 0 ? (
                <SmoothReelScroller
                  reels={allReels}
                  initialIndex={currentIndex}
                  isMobile={true}
                  onIndexChange={handleIndexChange}
                  onCommentClick={() => setIsCommentsModalOpen(true)}
                  onMenuClick={() => setIsMobileMenuOpen(true)}
                  onOrderClick={() => setIsOrderModalOpen(true)}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-black bg-gray-100">
                  <div className="text-center">
                    <div className="font-extrabold text-2xl mb-2">LOADING REELS...</div>
                    <div>Finding the best content for you</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Desktop Layout - Three Column */
          <>
            {/* Left Column - Playlist */}
            <aside className="w-80 flex-shrink-0">
              <ReelPlaylist 
                playlist={allReels}
                currentReelId={currentReel?.id ?? ''}
                onReelSelect={handleReelSelect}
              />
            </aside>

            {/* Center Column - Video Player (letterboxed, centered) */}
            <section className="flex-1 p-4 bg-black">
              <div className="h-full w-full flex items-center justify-center">
                <div className="relative w-full max-w-[420px] aspect-[9/16]">
                  {allReels.length > 0 ? (
                    <SmoothReelScroller
                      reels={allReels}
                      initialIndex={currentIndex}
                      isMobile={false}
                      onIndexChange={handleIndexChange}
                      onOrderClick={() => setIsOrderModalOpen(true)}
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
                <ReelInspector reel={currentReel} onOrderClick={() => setIsOrderModalOpen(true)} />
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

      {/* Order Confirmation Modal */}
      {currentReel && (
        <OrderConfirmModal
          reel={currentReel}
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
        />
      )}
    </div>
  )
}
