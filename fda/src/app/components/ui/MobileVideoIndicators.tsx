"use client"

interface MobileVideoIndicatorsProps {
  currentIndex: number
  totalVideos: number
  className?: string
}

export default function MobileVideoIndicators({ 
  currentIndex, 
  totalVideos, 
  className = "" 
}: MobileVideoIndicatorsProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {Array.from({ length: Math.min(totalVideos, 5) }, (_, index) => (
        <div
          key={index}
          className={`h-1 flex-1 transition-all duration-300 ${
            index === currentIndex 
              ? 'bg-[#39FF14] border border-black' 
              : 'bg-white bg-opacity-40 border border-gray-400'
          }`}
          style={{ minWidth: '8px' }}
        />
      ))}
      {totalVideos > 5 && (
        <span className="text-white text-xs font-bold ml-2">
          +{totalVideos - 5}
        </span>
      )}
    </div>
  )
}
