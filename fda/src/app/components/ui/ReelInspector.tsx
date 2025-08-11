"use client"

import { useState } from 'react'
import { Star, Clock, MapPin, Heart, MessageCircle, Send, ShoppingCart, Plus, Minus } from 'lucide-react'
import { Reel, Comment } from '../../reelBytes/types'

interface ReelInspectorProps {
  reel: Reel
  onOrderClick?: (reel: Reel) => void
}

export default function ReelInspector({ reel, onOrderClick }: ReelInspectorProps) {
  const [quantity, setQuantity] = useState(1)
  const [newComment, setNewComment] = useState('')
  const [showAllComments, setShowAllComments] = useState(false)

  const formatPrice = (price: number): string => `₹${price.toFixed(2)}`

  const getTotalPrice = (): string => {
    return formatPrice(reel.foodItem.price * quantity)
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity)
    }
  }

  const handleOrderNow = () => {
    onOrderClick?.(reel)
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      // TODO: Implement comment submission
      console.log('New comment:', newComment)
      setNewComment('')
    }
  }

  const displayedComments = showAllComments 
    ? reel.comments 
    : reel.comments.slice(0, 3)

  return (
    <div className="h-full bg-[#F5F5F5] border-2 border-black overflow-y-auto">
      {/* Header */}
      <div className="p-4 bg-white border-b-2 border-black">
        <h2 className="text-black font-bold text-xl">Details</h2>
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
            <div>
              <h3 className="font-bold text-black text-lg">{reel.restaurant.name}</h3>
              <div className="flex items-center gap-2 text-sm">
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
          <button className="w-full py-2 px-4 bg-white border-2 border-black text-black font-bold hover:bg-gray-50 transition-colors">
            View Restaurant
          </button>
        </div>

        {/* Food Item Details */}
        <div className="bg-white border-2 border-black p-4 neobrutalist-shadow">
          <div className="mb-4">
            <h3 className="font-bold text-black text-xl mb-2">{reel.foodItem.name}</h3>
            <p className="text-black font-normal text-sm mb-3">{reel.foodItem.description}</p>
            <p className="font-bold text-black text-2xl">{formatPrice(reel.foodItem.price)}</p>
          </div>

          {/* Quantity Selector */}
          <div className="mb-4">
            <label className="block text-black font-bold text-sm mb-2">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-10 h-10 bg-white border-2 border-black text-black font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4 mx-auto" />
              </button>
              <span className="font-bold text-black text-lg w-8 text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 99}
                className="w-10 h-10 bg-white border-2 border-black text-black font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>

          {/* Order Now Button */}
          <button
            onClick={handleOrderNow}
            className="w-full py-3 px-4 bg-[#39FF14] border-2 border-black text-black font-bold text-lg hover:neobrutalist-shadow-active active:translate-x-1 active:translate-y-1 transition-all duration-100 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Order Now • {getTotalPrice()}
          </button>
        </div>

        {/* Comments Section */}
        <div className="bg-white border-2 border-black p-4 neobrutalist-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-black text-lg">Comments</h3>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4 text-black" />
              <span className="font-bold text-black text-sm">{reel.comments.length}</span>
            </div>
          </div>

          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border-2 border-black bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-[#39FF14] border-2 border-black text-black font-bold hover:neobrutalist-shadow active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {displayedComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-8 h-8 bg-gray-200 border-2 border-black flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-black text-xs">
                    {comment.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-black text-sm">{comment.userName}</span>
                    <span className="text-gray-600 text-xs font-normal">{comment.timestamp}</span>
                  </div>
                  <p className="text-black font-normal text-sm mb-1">{comment.text}</p>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-black transition-colors">
                      <Heart className="w-3 h-3" />
                      <span className="text-xs font-normal">{comment.likes}</span>
                    </button>
                    <button className="text-gray-600 hover:text-black transition-colors text-xs font-normal">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Show More Comments Button */}
            {reel.comments.length > 3 && !showAllComments && (
              <button
                onClick={() => setShowAllComments(true)}
                className="w-full py-2 text-black font-bold text-sm border-2 border-gray-300 hover:border-black transition-colors"
              >
                Show {reel.comments.length - 3} more comments
              </button>
            )}

            {showAllComments && reel.comments.length > 3 && (
              <button
                onClick={() => setShowAllComments(false)}
                className="w-full py-2 text-black font-bold text-sm border-2 border-gray-300 hover:border-black transition-colors"
              >
                Show less
              </button>
            )}
          </div>
        </div>

        {/* Additional Actions */}
        <div className="bg-white border-2 border-black p-4 neobrutalist-shadow">
          <h3 className="font-bold text-black text-lg mb-3">Actions</h3>
          <div className="space-y-2">
            <button className="w-full py-2 px-4 bg-white border-2 border-black text-black font-bold hover:bg-gray-50 transition-colors">
              Save to Favorites
            </button>
            <button className="w-full py-2 px-4 bg-white border-2 border-black text-black font-bold hover:bg-gray-50 transition-colors">
              Share Video
            </button>
            <button className="w-full py-2 px-4 bg-white border-2 border-black text-black font-bold hover:bg-gray-50 transition-colors">
              Report Content
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
