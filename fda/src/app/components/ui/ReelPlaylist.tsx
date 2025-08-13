"use client"

import { Clock, Eye } from 'lucide-react'
import { Reel } from '../../reelBytes/types'

interface ReelPlaylistProps {
  playlist: Reel[]
  currentReelId: string
  onReelSelect: (reel: Reel) => void
}

export default function ReelPlaylist({ playlist, currentReelId, onReelSelect }: ReelPlaylistProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatPrice = (price: number): string => `₹${price.toFixed(2)}`

  return (
    <div className="h-full bg-black border-2 border-black flex flex-col">
      {/* Header */}
      <div className="p-4 border-b-2 border-white flex-shrink-0">
        <h2 className="text-white font-bold text-xl">Up Next</h2>
        <p className="text-gray-300 font-normal text-sm mt-1">
          {playlist.length} videos in queue
        </p>
      </div>

      {/* Playlist Items */}
      <div className="flex-1 overflow-y-auto pb-20">
        {playlist.map((reel, index) => {
          const isCurrentlyPlaying = reel.id === currentReelId
          
          return (
            <div
              key={reel.id}
              onClick={() => onReelSelect(reel)}
              className={`p-4 border-b-2 border-gray-800 cursor-pointer transition-all hover:bg-gray-900 ${
                isCurrentlyPlaying 
                  ? 'bg-[#39FF14] text-black border-[#39FF14]' 
                  : 'text-white'
              }`}
            >
              {/* Queue Number */}
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 w-8 h-8 border-2 ${
                  isCurrentlyPlaying 
                    ? 'border-black bg-black text-[#39FF14]' 
                    : 'border-white bg-transparent text-white'
                } flex items-center justify-center font-bold text-sm`}>
                  {isCurrentlyPlaying ? '▶' : index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Restaurant Name */}
                  <p className={`font-bold text-sm truncate ${
                    isCurrentlyPlaying ? 'text-black' : 'text-gray-300'
                  }`}>
                    {reel.restaurant.name}
                  </p>

                  {/* Food Item */}
                  <h3 className={`font-bold text-base truncate mt-1 ${
                    isCurrentlyPlaying ? 'text-black' : 'text-white'
                  }`}>
                    {reel.foodItem.name}
                  </h3>

                  {/* Price */}
                  <p className={`font-bold text-lg mt-1 ${
                    isCurrentlyPlaying ? 'text-black' : 'text-[#39FF14]'
                  }`}>
                    {formatPrice(reel.foodItem.price)}
                  </p>

                  {/* Stats */}
                  <div className={`flex items-center gap-4 mt-2 text-xs ${
                    isCurrentlyPlaying ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span className="font-normal">{formatNumber(reel.views)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="font-normal">{reel.restaurant.deliveryTime}</span>
                    </div>
                  </div>

                  {/* Caption Preview */}
                  <p className={`text-xs mt-2 line-clamp-2 font-normal ${
                    isCurrentlyPlaying ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {reel.caption}
                  </p>
                </div>
              </div>

              {/* Currently Playing Indicator */}
              {isCurrentlyPlaying && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-black animate-pulse"></div>
                    <div className="w-1 h-4 bg-black animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-4 bg-black animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-black font-bold text-xs">NOW PLAYING</span>
                </div>
              )}
            </div>
          )
        })}

        {/* Empty State */}
        {playlist.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-400 font-normal">No more videos in queue</p>
            <p className="text-gray-500 font-normal text-sm mt-2">
              Browse more content to add to your playlist
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
