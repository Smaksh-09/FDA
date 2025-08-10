"use client"

import { useEffect, useState } from 'react'
import { Plus, Video, TrendingUp, Eye, Heart } from 'lucide-react'
import RestaurantSidebar from '../../components/ui/RestaurantSidebar'
import UploadReelPanel from '../../components/ui/UploadReelPanel'
import ReelCard from '../../components/ui/ReelCard'
import { dummyRestaurant } from '../dummyData'
import { Reel } from '../types'

export default function ReelsManagementPage() {
  const [reels, setReels] = useState<Reel[]>([])
  const [isUploadPanelOpen, setIsUploadPanelOpen] = useState(false)
  const [menuItems, setMenuItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inactive'>('all')

  const handleUploadComplete = (newReel: Reel) => {
    setReels(prev => [newReel, ...prev])
  }

  const handleEditReel = (reel: Reel) => {
    // For now, just log - can implement edit modal later
    console.log('Edit reel:', reel)
    alert('Edit functionality coming soon!')
  }

  const handleDeleteReel = (reelId: string) => {
    setReels(prev => prev.filter(reel => reel.id !== reelId))
  }

  const handleToggleActive = (reelId: string) => {
    setReels(prev =>
      prev.map(reel =>
        reel.id === reelId
          ? { ...reel, isActive: !reel.isActive, updatedAt: new Date() }
          : reel
      )
    )
  }

  // Filter reels based on selected filter
  const filteredReels = reels.filter(reel => {
    switch (selectedFilter) {
      case 'active':
        return reel.isActive
      case 'inactive':
        return !reel.isActive
      default:
        return true
    }
  })

  // Calculate stats
  const stats = {
    totalReels: reels.length,
    activeReels: reels.filter(r => r.isActive).length,
    totalViews: reels.reduce((sum, reel) => sum + reel.views, 0),
    totalLikes: reels.reduce((sum, reel) => sum + reel.likes, 0)
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  // Fetch reels for this restaurant on mount
  useEffect(() => {
    const fetchReels = async () => {
      try {
        // Here we assume current user is the owner; backend will filter via restaurantId if provided
        const params = new URLSearchParams()
        // If you have the restaurant id in state, add it here
        // params.set('restaurantId', currentRestaurantId)
        const res = await fetch(`/api/reels?${params.toString()}`, { credentials: 'include' })
        if (!res.ok) throw new Error('Failed to fetch reels')
        const data = await res.json()
        setReels(data.reels || [])
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchReels()
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/food-items', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setMenuItems(data)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchMenu()
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <RestaurantSidebar 
        restaurant={dummyRestaurant} 
        currentPage="reels" 
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {isLoading && (
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-4 border-[#39FF14] border-t-transparent animate-spin" />
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-black text-black mb-2">
              REELS MANAGEMENT
            </h1>
            <p className="text-gray-600 font-normal">
              Upload and manage your restaurant's video content • {stats.totalReels} reels
            </p>
          </div>
          
          <button
            onClick={() => setIsUploadPanelOpen(true)}
            disabled={isUploadPanelOpen}
            className="px-6 py-3 bg-[#39FF14] border-2 border-black text-black font-bold hover:neobrutalist-shadow-active active:translate-x-1 active:translate-y-1 transition-all duration-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            [+ UPLOAD NEW REEL]
          </button>
        </div>

        {/* Upload Panel */}
          <UploadReelPanel
          isOpen={isUploadPanelOpen}
          onClose={() => setIsUploadPanelOpen(false)}
            menuItems={menuItems}
          onUploadComplete={handleUploadComplete}
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border-2 border-black p-4">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-5 h-5 text-black" />
              <span className="font-bold text-black text-sm">TOTAL REELS</span>
            </div>
            <div className="font-bold text-black text-2xl">{stats.totalReels}</div>
            <div className="text-gray-600 font-normal text-sm">
              {stats.activeReels} active, {stats.totalReels - stats.activeReels} inactive
            </div>
          </div>

          <div className="bg-white border-2 border-black p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="font-bold text-black text-sm">ACTIVE REELS</span>
            </div>
            <div className="font-bold text-black text-2xl">{stats.activeReels}</div>
            <div className="text-gray-600 font-normal text-sm">
              {((stats.activeReels / stats.totalReels) * 100).toFixed(0)}% of total
            </div>
          </div>

          <div className="bg-white border-2 border-black p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-black text-sm">TOTAL VIEWS</span>
            </div>
            <div className="font-bold text-black text-2xl">{formatNumber(stats.totalViews)}</div>
            <div className="text-gray-600 font-normal text-sm">
              Avg {Math.round(stats.totalViews / stats.totalReels)} per reel
            </div>
          </div>

          <div className="bg-white border-2 border-black p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-600" />
              <span className="font-bold text-black text-sm">TOTAL LIKES</span>
            </div>
            <div className="font-bold text-black text-2xl">{formatNumber(stats.totalLikes)}</div>
            <div className="text-gray-600 font-normal text-sm">
              {((stats.totalLikes / stats.totalViews) * 100).toFixed(1)}% like rate
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'ALL REELS', count: stats.totalReels },
              { id: 'active', label: 'ACTIVE', count: stats.activeReels },
              { id: 'inactive', label: 'INACTIVE', count: stats.totalReels - stats.activeReels }
            ].map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id as any)}
                className={`px-4 py-2 border-2 border-black font-bold text-sm transition-all flex items-center gap-2 ${
                  selectedFilter === filter.id
                    ? 'bg-[#39FF14] text-black neobrutalist-shadow'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                {filter.label}
                <span className="bg-black text-[#39FF14] px-2 py-1 text-xs font-bold">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Reels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredReels.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="font-bold text-black text-lg mb-2">
                {selectedFilter === 'all' ? 'No reels found' : `No ${selectedFilter} reels`}
              </h3>
              <p className="text-gray-600 font-normal mb-4">
                {selectedFilter === 'all' 
                  ? 'Upload your first reel to get started'
                  : `Switch to another filter or upload new reels`
                }
              </p>
              {selectedFilter === 'all' && (
                <button
                  onClick={() => setIsUploadPanelOpen(true)}
                  className="px-6 py-3 bg-[#39FF14] border-2 border-black text-black font-bold hover:neobrutalist-shadow transition-all flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  [UPLOAD YOUR FIRST REEL]
                </button>
              )}
            </div>
          ) : (
            filteredReels.map(reel => (
              <ReelCard
                key={reel.id}
                reel={reel}
                onEdit={handleEditReel}
                onDelete={handleDeleteReel}
                onToggleActive={handleToggleActive}
              />
            ))
          )}
        </div>

        {/* Performance Tips */}
        {reels.length > 0 && (
          <div className="mt-8 bg-black border-2 border-black p-6 text-white">
            <h3 className="font-bold text-[#39FF14] text-lg mb-4">PERFORMANCE TIPS</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-bold text-white">Upload Quality:</span>
                <p className="text-gray-300">Use 1080p vertical videos for best results</p>
              </div>
              <div>
                <span className="font-bold text-white">Optimal Length:</span>
                <p className="text-gray-300">Keep reels between 15-60 seconds</p>
              </div>
              <div>
                <span className="font-bold text-white">Link Menu Items:</span>
                <p className="text-gray-300">Always link reels to boost menu item sales</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
