"use client"

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Share, Menu } from 'lucide-react'
import { Reel } from '../../reelBytes/types'

interface ReelVideoPlayerProps {
  reel: Reel
  isActive: boolean
  onCommentClick?: () => void
  onMenuClick?: () => void
  isMobile?: boolean
  onOrderClick?: (reel: Reel) => void
}

export default function ReelVideoPlayer({ 
  reel, 
  isActive, 
  onCommentClick, 
  onMenuClick, 
  isMobile = false,
  onOrderClick,
}: ReelVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Auto play/pause when component becomes active
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let cancelled = false
    const safePlay = async () => {
      try {
        if (!video.isConnected || !document.contains(video)) return
        const playPromise = video.play()
        if (playPromise && typeof playPromise.then === 'function') {
          await playPromise
        }
        if (!cancelled) setIsPlaying(true)
      } catch (err) {
        // Autoplay may be blocked or interrupted; keep paused state
        if (!cancelled) setIsPlaying(!video.paused)
      }
    }

    if (isActive) {
      safePlay()
    } else {
      video.pause()
      setIsPlaying(false)
    }

    return () => {
      cancelled = true
    }
  }, [isActive])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div 
      className={`relative h-full w-full bg-black border-2 border-black group cursor-pointer ${
        isMobile ? 'min-h-screen' : ''
      }`}
      onMouseEnter={() => !isMobile && setShowControls(true)}
      onMouseLeave={() => !isMobile && setShowControls(false)}
      onTouchStart={() => isMobile && setShowControls(true)}
      onClick={togglePlay}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted={isMuted}
        autoPlay={isActive}
        loop
        playsInline
        onLoadedData={() => {
          if (isActive && videoRef.current) {
            const v = videoRef.current
            v.play().then(() => setIsPlaying(true)).catch(() => {})
          }
        }}
      >
        <source src={reel.videoUrl} type="video/mp4" />
        {/* Fallback for when no video is available */}
        <div className="flex items-center justify-center h-full bg-black text-white">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
              <Play className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 font-bold">Video Loading...</p>
          </div>
        </div>
      </video>

      {/* Video Controls Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-200 ${
        showControls || isMobile ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Top Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          {/* Menu Button (Mobile Only) */}
          {isMobile && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMenuClick?.()
              }}
              className="p-3 bg-black bg-opacity-60 border-2 border-white text-white hover:bg-opacity-80 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleMute()
            }}
            className="p-2 bg-black bg-opacity-60 border-2 border-white text-white hover:bg-opacity-80 transition-all"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Center Play Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 bg-black bg-opacity-60 border-2 border-white">
              <Play className="w-12 h-12 text-white" fill="white" />
            </div>
          </div>
        )}

        {/* Bottom Content */}
        <div className={`absolute bottom-4 left-4 ${isMobile ? 'right-20' : 'right-4'}`}>
          {/* Restaurant Info (Mobile) */}
          {isMobile && (
            <div className="mb-3 bg-black bg-opacity-60 p-3 border-2 border-white">
              <p className="text-[#39FF14] font-bold text-sm">{reel.restaurant.name}</p>
              <p className="text-white font-bold text-lg">{reel.foodItem.name}</p>
              <p className="text-[#39FF14] font-bold text-xl">₹{reel.foodItem.price.toFixed(2)}</p>
            </div>
          )}
          
          {/* Caption */}
          <div className="mb-4">
            <p className={`text-white font-bold ${isMobile ? 'text-base' : 'text-lg'} bg-black bg-opacity-60 p-2 border-2 border-white`}>
              {reel.caption}
            </p>
          </div>

          {/* Order Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOrderClick?.(reel)
            }}
            className="px-4 py-2 bg-[#39FF14] border-2 border-white text-black font-bold hover:neobrutalist-shadow transition-all"
          >
            [ORDER NOW – ₹{reel.foodItem.price.toFixed(2)}]
          </button>
        </div>
      </div>

      {/* Side Action Buttons */}
      <div className={`absolute ${isMobile ? 'right-4 bottom-32' : 'right-4 bottom-20'} flex flex-col gap-4`}>
        {/* Like Button */}
        <div className="text-center">
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleLike()
            }}
            className={`p-3 border-2 border-white transition-all ${
              isLiked 
                ? 'bg-[#39FF14] text-black' 
                : 'bg-black bg-opacity-60 text-white hover:bg-opacity-80'
            }`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <p className="text-white text-sm font-bold mt-1 bg-black bg-opacity-60 px-2 py-1">
            {formatNumber(isLiked ? reel.likes + 1 : reel.likes)}
          </p>
        </div>

        {/* Comment Button */}
        <div className="text-center">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCommentClick?.()
            }}
            className="p-3 bg-black bg-opacity-60 border-2 border-white text-white hover:bg-opacity-80 transition-all"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <p className="text-white text-sm font-bold mt-1 bg-black bg-opacity-60 px-2 py-1">
            {reel.comments.length}
          </p>
        </div>

        {/* Share Button */}
        <div className="text-center">
          <button
            onClick={(e) => {
              e.stopPropagation()
              // TODO: Share functionality
            }}
            className="p-3 bg-black bg-opacity-60 border-2 border-white text-white hover:bg-opacity-80 transition-all"
          >
            <Share className="w-6 h-6" />
          </button>
          <p className="text-white text-sm font-bold mt-1 bg-black bg-opacity-60 px-2 py-1">
            {formatNumber(reel.views)}
          </p>
        </div>
      </div>
    </div>
  )
}
