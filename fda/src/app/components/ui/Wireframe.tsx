"use client"

import { motion } from 'framer-motion'
import { Play, Heart, ShoppingCart, Star } from 'lucide-react'

export default function AppWireframe() {
  return (
    <div className="relative">
      {/* Phone Frame */}
      <motion.div
        className="w-80 h-[600px] bg-white border-4 border-white relative overflow-hidden"
        animate={{ 
          rotateY: [0, 5, -5, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Status Bar */}
        <div className="h-8 bg-black flex items-center justify-between px-4">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-[#39FF14] rounded-full"></div>
            <div className="w-1 h-1 bg-[#39FF14] rounded-full"></div>
            <div className="w-1 h-1 bg-[#39FF14] rounded-full"></div>
          </div>
          <div className="text-[#39FF14] text-xs font-bold">100%</div>
        </div>

        {/* Header */}
        <div className="h-16 bg-[#39FF14] border-b-2 border-black flex items-center justify-center">
          <h3 className="text-black font-black text-xl">ReelBites</h3>
        </div>

        {/* Video Feed */}
        <div className="flex-1 p-4 space-y-4">
          {/* Video Card 1 */}
          <motion.div
            className="bg-black border-2 border-black h-32 relative overflow-hidden"
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: 0
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#39FF14] to-transparent opacity-20"></div>
            <div className="absolute top-2 left-2">
              <Play className="w-6 h-6 text-[#39FF14]" fill="currentColor" />
            </div>
            <div className="absolute bottom-2 left-2 text-white">
              <div className="text-sm font-bold">Pizza Margherita</div>
              <div className="text-xs">₹129.99</div>
            </div>
            <div className="absolute bottom-2 right-2">
              <Heart className="w-5 h-5 text-white" />
            </div>
          </motion.div>

          {/* Video Card 2 */}
          <motion.div
            className="bg-black border-2 border-black h-32 relative overflow-hidden"
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: 0.5
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-transparent opacity-20"></div>
            <div className="absolute top-2 left-2">
              <Play className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <div className="absolute bottom-2 left-2 text-white">
              <div className="text-sm font-bold">Sushi Roll</div>
              <div className="text-xs">₹159.99</div>
            </div>
            <div className="absolute bottom-2 right-2 flex items-center space-x-1">
              <Star className="w-4 h-4 text-[#39FF14]" fill="currentColor" />
              <span className="text-white text-xs">4.9</span>
            </div>
          </motion.div>

          {/* Video Card 3 */}
          <motion.div
            className="bg-black border-2 border-black h-32 relative overflow-hidden"
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              delay: 1
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-transparent opacity-20"></div>
            <div className="absolute top-2 left-2">
              <Play className="w-6 h-6 text-red-400" fill="currentColor" />
            </div>
            <div className="absolute bottom-2 left-2 text-white">
              <div className="text-sm font-bold">Burger Deluxe</div>
              <div className="text-xs">₹89.99</div>
            </div>
            <div className="absolute top-2 right-2">
              <div className="bg-[#39FF14] text-black text-xs font-bold px-2 py-1">
                LIVE
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Navigation */}
        <div className="h-16 bg-black border-t-2 border-white flex items-center justify-around">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          >
            <Play className="w-6 h-6 text-[#39FF14]" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          >
            <Heart className="w-6 h-6 text-white" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
          >
            <ShoppingCart className="w-6 h-6 text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className="absolute -top-4 -right-4 w-8 h-8 bg-[#39FF14] border-2 border-black"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        className="absolute -bottom-4 -left-4 w-6 h-6 bg-white border-2 border-black"
        animate={{ 
          rotate: -360,
          y: [0, -10, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}
