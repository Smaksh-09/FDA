"use client"

import { useState } from 'react'
import { Edit, Trash2, Play, Eye, Heart, MoreVertical, ToggleLeft, ToggleRight } from 'lucide-react'
import { Reel } from '../../restaurant/types'

interface ReelCardProps {
  reel: Reel
  onEdit: (reel: Reel) => void
  onDelete: (reelId: string) => void
  onToggleActive: (reelId: string) => void
}

export default function ReelCard({ reel, onEdit, onDelete, onToggleActive }: ReelCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isVideoLoading, setIsVideoLoading] = useState(true)

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete this reel? This action cannot be undone.`)) {
      onDelete(reel.id)
    }
  }

  const formatViews = (views?: number): string => {
    const safe = typeof views === 'number' && !Number.isNaN(views) ? views : 0
    if (safe >= 1000000) {
      return `${(safe / 1000000).toFixed(1)}M`
    } else if (safe >= 1000) {
      return `${(safe / 1000).toFixed(1)}K`
    }
    return String(safe)
  }

  const formatDate = (date: Date | string | undefined): string => {
    const d = date instanceof Date ? date : date ? new Date(date) : new Date()
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className={`bg-black border-2 border-black neobrutalist-shadow relative ${
      !reel.isActive ? 'opacity-60' : ''
    }`}>
      {/* Status Badge */}
      {!reel.isActive && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold border border-black z-10">
          INACTIVE
        </div>
      )}

      {/* Video */}
      <div className="relative aspect-[9/16] bg-gray-800 border-b-2 border-white overflow-hidden">
        <video
          src={(reel as any).videoUrl}
          className="w-full h-full object-cover"
          controls
          onLoadedData={() => setIsVideoLoading(false)}
        />
        {/* Inline video loading spinner */}
        {isVideoLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-[#39FF14] border-t-transparent animate-spin" />
          </div>
        )}
        
        {/* Overlay with video stats */}
        <div className="absolute bottom-2 left-2 right-2 text-white">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black bg-opacity-60 px-2 py-1 border border-white">
            <Eye className="w-3 h-3" />
            <span className="font-bold">{formatViews((reel as any).views)}</span>
          </div>
          <div className="flex items-center gap-1 bg-black bg-opacity-60 px-2 py-1 border border-white">
            <Heart className="w-3 h-3" />
            <span className="font-bold">{(reel as any).likes ?? 0}</span>
          </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 text-white">
        {/* Caption */}
        <p className="text-white font-normal text-sm line-clamp-2 mb-3">
          {reel.caption || 'No caption provided'}
        </p>

        {/* Linked Menu Item */}
        <div className="mb-4">
          <span className="text-[#39FF14] font-bold text-xs block mb-1">LINKED ITEM:</span>
          {reel.linkedMenuItem ? (
            <div className="text-white">
              <p className="font-bold text-sm">{reel.linkedMenuItem.name}</p>
              <p className="text-gray-300 text-xs">₹{reel.linkedMenuItem.price}</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No menu item linked</p>
          )}
        </div>

        {/* Date */}
        <div className="mb-4">
          <span className="text-gray-400 text-xs">
            Created: {formatDate((reel as any).createdAt)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          {/* Status Toggle */}
          <button
            onClick={() => onToggleActive(reel.id)}
            className="flex items-center gap-2 text-white hover:text-[#39FF14] transition-colors"
            title={(reel as any).isActive ? 'Deactivate reel' : 'Activate reel'}
          >
            {(reel as any).isActive !== false ? (
              <ToggleRight className="w-5 h-5 text-[#39FF14]" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-gray-400" />
            )}
            <span className="text-xs font-bold">
              {(reel as any).isActive !== false ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </button>

          {/* Edit/Delete Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(reel)}
              className="p-2 bg-white border-2 border-black text-black hover:bg-[#39FF14] transition-colors"
              title="Edit Reel"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-white border-2 border-black text-black hover:bg-red-500 hover:text-white transition-colors"
              title="Delete Reel"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
