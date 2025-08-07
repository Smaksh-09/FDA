"use client"

import { Play, Pause } from 'lucide-react'

interface ExampleVideoPlayerProps {
  isActive?: boolean
}

export default function ExampleVideoPlayer({ isActive = false }: ExampleVideoPlayerProps) {
  return (
    <div className={`w-full h-full border-2 border-black transition-all duration-100 ${
      isActive 
        ? 'bg-black neobrutalist-shadow-active' 
        : 'bg-white'
    }`}>
      <div className="flex items-center justify-center h-full">
        {isActive ? (
          <div className="text-[#39FF14] flex flex-col items-center">
            <Pause className="w-12 h-12 mb-2" />
            <span className="font-bold text-sm">PLAYING</span>
          </div>
        ) : (
          <div className="text-black flex flex-col items-center">
            <Play className="w-12 h-12 mb-2" />
            <span className="font-bold text-sm">VIDEO</span>
          </div>
        )}
      </div>
    </div>
  )
}
