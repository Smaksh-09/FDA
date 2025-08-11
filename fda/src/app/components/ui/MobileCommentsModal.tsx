"use client"

import { useState } from 'react'
import { X, Heart, Send, MessageCircle } from 'lucide-react'
import { Reel, Comment } from '../../reelBytes/types'

interface MobileCommentsModalProps {
  reel: Reel
  isOpen: boolean
  onClose: () => void
}

export default function MobileCommentsModal({ reel, isOpen, onClose }: MobileCommentsModalProps) {
  const [newComment, setNewComment] = useState('')
  const [showAllComments, setShowAllComments] = useState(false)

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
    : reel.comments.slice(0, 5)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-[#F5F5F5] z-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b-2 border-black p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-black" />
            <h2 className="text-black font-bold text-xl">Comments</h2>
            <div className="bg-black text-white px-2 py-1 text-sm font-bold">
              {reel.comments.length}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white border-2 border-black text-black hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Info Strip */}
        <div className="bg-black border-b-2 border-black p-3 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-700 border border-gray-500 flex items-center justify-center">
              <span className="font-bold text-white text-xs">
                {reel.restaurant.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#39FF14] font-bold text-sm truncate">{reel.restaurant.name}</p>
              <p className="text-white font-bold text-base truncate">{reel.foodItem.name}</p>
            </div>
            <div className="text-right">
              <p className="text-[#39FF14] font-bold text-lg">₹{reel.foodItem.price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayedComments.map((comment, index) => (
            <div key={comment.id} className="bg-white border-2 border-black p-3 neobrutalist-shadow">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 border-2 border-black flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-black text-sm">
                    {comment.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-black text-sm">{comment.userName}</span>
                    <span className="text-gray-600 text-xs font-normal">{comment.timestamp}</span>
                  </div>
                  <p className="text-black font-normal text-sm mb-3 leading-relaxed">{comment.text}</p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-black transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm font-normal">{comment.likes}</span>
                    </button>
                    <button className="text-gray-600 hover:text-black transition-colors text-sm font-normal">
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Show More Comments Button */}
          {reel.comments.length > 5 && !showAllComments && (
            <button
              onClick={() => setShowAllComments(true)}
              className="w-full py-3 text-black font-bold text-sm bg-white border-2 border-black hover:bg-gray-50 transition-colors"
            >
              Show {reel.comments.length - 5} more comments
            </button>
          )}

          {showAllComments && reel.comments.length > 5 && (
            <button
              onClick={() => setShowAllComments(false)}
              className="w-full py-3 text-black font-bold text-sm bg-white border-2 border-black hover:bg-gray-50 transition-colors"
            >
              Show less
            </button>
          )}

          {/* Empty State */}
          {reel.comments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-200 border-2 border-black flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-black font-bold text-lg mb-2">No comments yet</p>
              <p className="text-gray-600 font-normal text-sm">Be the first to share your thoughts!</p>
            </div>
          )}
        </div>

        {/* Comment Input - Fixed at bottom */}
        <div className="bg-white border-t-2 border-black p-4">
          <form onSubmit={handleCommentSubmit}>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-200 border-2 border-black flex items-center justify-center flex-shrink-0">
                <span className="font-bold text-black text-sm">U</span>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-3 py-3 border-2 border-black bg-white text-black font-normal focus:outline-none focus:border-[#39FF14] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-3 bg-[#39FF14] border-2 border-black text-black font-bold hover:neobrutalist-shadow active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
          
          {/* Quick Reactions */}
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 bg-white border-2 border-black text-black font-bold text-sm hover:bg-gray-50 transition-colors">
              🔥
            </button>
            <button className="px-3 py-1 bg-white border-2 border-black text-black font-bold text-sm hover:bg-gray-50 transition-colors">
              😍
            </button>
            <button className="px-3 py-1 bg-white border-2 border-black text-black font-bold text-sm hover:bg-gray-50 transition-colors">
              🤤
            </button>
            <button className="px-3 py-1 bg-white border-2 border-black text-black font-bold text-sm hover:bg-gray-50 transition-colors">
              👏
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
