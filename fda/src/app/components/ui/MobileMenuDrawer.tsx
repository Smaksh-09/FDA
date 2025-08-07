"use client"

import { useState } from 'react'
import { X, Star, Clock, ShoppingCart, Plus, Minus, MapPin, Heart } from 'lucide-react'
import { Reel } from '../../reelBytes/types'

interface MobileMenuDrawerProps {
  reel: Reel
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenuDrawer({ reel, isOpen, onClose }: MobileMenuDrawerProps) {
  const [quantity, setQuantity] = useState(1)

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`
  }

  const getTotalPrice = (): string => {
    return formatPrice(reel.foodItem.price * quantity)
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    alert(`Added ${quantity}x ${reel.foodItem.name} to cart`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F5F5F5] border-t-2 border-black z-50 max-h-[80vh] overflow-y-auto transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="bg-white border-b-2 border-black p-4 flex items-center justify-between sticky top-0">
          <h2 className="text-black font-bold text-xl">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 bg-white border-2 border-black text-black hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Restaurant Profile */}
          <div className="bg-white border-2 border-black p-4 neobrutalist-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gray-200 border-2 border-black flex items-center justify-center">
                <span className="font-bold text-black text-lg">
                  {reel.restaurant.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-black text-lg">{reel.restaurant.name}</h3>
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-black" fill="black" />
                    <span className="font-bold text-black">{reel.restaurant.rating}</span>
                  </div>
                  <span className="text-gray-600">•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-black" />
                    <span className="font-normal text-black">{reel.restaurant.deliveryTime}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Restaurant Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 px-3 bg-white border-2 border-black text-black font-bold text-sm hover:bg-gray-50 transition-colors">
                View Menu
              </button>
              <button className="py-2 px-3 bg-white border-2 border-black text-black font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3" />
                Location
              </button>
            </div>
          </div>

          {/* Food Item Details */}
          <div className="bg-white border-2 border-black p-4 neobrutalist-shadow">
            <div className="mb-4">
              <h3 className="font-bold text-black text-xl mb-2">{reel.foodItem.name}</h3>
              <p className="text-black font-normal text-sm mb-3 leading-relaxed">
                {reel.foodItem.description}
              </p>
              <p className="font-bold text-black text-2xl">{formatPrice(reel.foodItem.price)}</p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="block text-black font-bold text-sm mb-3">Quantity</label>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-12 h-12 bg-white border-2 border-black text-black font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-black text-xl w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 99}
                    className="w-12 h-12 bg-white border-2 border-black text-black font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-black font-bold text-lg">Total: {getTotalPrice()}</p>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 px-4 bg-[#39FF14] border-2 border-black text-black font-bold text-xl hover:neobrutalist-shadow-active active:translate-x-1 active:translate-y-1 transition-all duration-100 flex items-center justify-center gap-3"
            >
              <ShoppingCart className="w-6 h-6" />
              Add to Cart • {getTotalPrice()}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border-2 border-black p-4 neobrutalist-shadow">
            <h3 className="font-bold text-black text-lg mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="py-3 px-4 bg-white border-2 border-black text-black font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Heart className="w-4 h-4" />
                Save
              </button>
              <button className="py-3 px-4 bg-white border-2 border-black text-black font-bold text-sm hover:bg-gray-50 transition-colors">
                Share
              </button>
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-black border-2 border-black p-4 text-white">
            <h3 className="font-bold text-white text-lg mb-2">Video Info</h3>
            <p className="font-normal text-gray-300 text-sm mb-2">{reel.caption}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-bold text-[#39FF14]">{reel.likes.toLocaleString()} likes</span>
              <span className="font-normal text-gray-400">{reel.views.toLocaleString()} views</span>
              <span className="font-normal text-gray-400">{reel.comments.length} comments</span>
            </div>
          </div>

          {/* Bottom Spacing for safe area */}
          <div className="h-8"></div>
        </div>
      </div>
    </>
  )
}
