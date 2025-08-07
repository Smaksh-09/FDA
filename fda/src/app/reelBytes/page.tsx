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
import { dummyData, dummyReels } from './dummyData'
import { Reel } from './types'

export default function ReelBytesPage() {
  const [currentReel, setCurrentReel] = useState<Reel>(dummyData.currentReel)
  const [playlist, setPlaylist] = useState<Reel[]>(dummyData.playlist)
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

  const handleReelSelect = (selectedReel: Reel) => {
    // Update current reel
    setCurrentReel(selectedReel)
    
    // Remove selected reel from playlist and add current reel to the end
    const newPlaylist = playlist.filter(reel => reel.id !== selectedReel.id)
    newPlaylist.push(currentReel)
    setPlaylist(newPlaylist)
  }

  const goToNextReel = () => {
    if (playlist.length > 0) {
      handleReelSelect(playlist[0])
    }
  }

  const goToPreviousReel = () => {
    // Find current reel index in the full list
    const allReels = [currentReel, ...playlist]
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
            <ReelVideoPlayer 
              reel={currentReel}
              isActive={true}
              isMobile={true}
              onCommentClick={() => setIsCommentsModalOpen(true)}
              onMenuClick={() => setIsMobileMenuOpen(true)}
            />
            
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
                currentReelId={currentReel.id}
                onReelSelect={handleReelSelect}
              />
            </aside>

            {/* Center Column - Video Player */}
            <section className="flex-1 p-4">
              <div className="h-full">
                <ReelVideoPlayer 
                  reel={currentReel}
                  isActive={true}
                  isMobile={false}
                />
              </div>
            </section>

            {/* Right Column - Inspector */}
            <aside className="w-96 flex-shrink-0">
              <ReelInspector reel={currentReel} />
            </aside>
          </>
        )}
      </main>

      {/* Mobile Components */}
      {isMobile && (
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
