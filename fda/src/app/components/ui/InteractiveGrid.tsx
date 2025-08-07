"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GridItem from './Grids'
import ExampleButton from './ExampleButton'
import ExampleCard from './ExampleCard'
import ExampleVideoPlayer from './VideoPlayer'
import { ShoppingCart, Star, Clock, MapPin, User, Heart, Search, Menu } from 'lucide-react'

interface MousePosition {
  x: number
  y: number
}

export default function InteractiveGrid() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const gridItems = [
    // Row 1
    { component: <ExampleButton text="Order Now" variant="secondary" />, span: 'col-span-2' },
    { component: <div className="flex items-center justify-center h-full border-2 border-black bg-white"><Search className="w-8 h-8" /></div>, span: 'col-span-1' },
    { component: <ExampleCard title="Pizza" price="$12.99" />, span: 'col-span-2' },
    { component: <div className="flex items-center justify-center h-full border-2 border-black bg-white"><Menu className="w-8 h-8" /></div>, span: 'col-span-1' },
    
    // Row 2
    { component: <div className="flex items-center justify-center h-full border-2 border-black bg-white"><MapPin className="w-8 h-8" /></div>, span: 'col-span-1' },
    { component: <ExampleVideoPlayer />, span: 'col-span-2' },
    { component: <div className="flex items-center justify-center h-full border-2 border-black bg-white"><Clock className="w-6 h-6" /><span className="ml-2 font-bold">15 min</span></div>, span: 'col-span-2' },
    { component: <div className="flex items-center justify-center h-full border-2 border-black bg-white"><Heart className="w-8 h-8" /></div>, span: 'col-span-1' },
    
    // Row 3 - Hero Section
    { component: <div className="flex items-center justify-center h-full border-2 border-black bg-white"><Star className="w-8 h-8" /></div>, span: 'col-span-1' },
    { 
      component: (
        <div className="flex flex-col items-center justify-center h-full bg-[#F5F5F5] p-8">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-black text-center leading-none">
            ReelBites.
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center mt-4">
            Raw. Fast. Food.
          </p>
        </div>
      ), 
      span: 'col-span-4' 
    },
    { component: <div className="flex items-center justify-center h-full border-2 border-black bg-white"><ShoppingCart className="w-8 h-8" /></div>, span: 'col-span-1' },
    
    // Row 4
    { component: <ExampleCard title="Burger" price="$8.99" />, span: 'col-span-2' },
    { component: <ExampleButton text="Sign Up / Login" variant="primary" isPermanentActive={true} href="/auth/register" />, span: 'col-span-2' },
    { component: <ExampleCard title="Sushi" price="$15.99" />, span: 'col-span-2' },
    
    // Row 5
    { component: <div className="flex items-center justify-center h-full border-2 border-black bg-white"><User className="w-8 h-8" /></div>, span: 'col-span-1' },
    { component: <ExampleButton text="View Menu" variant="secondary" />, span: 'col-span-2' },
    { component: <div className="flex items-center justify-center h-full border-2 border-black bg-white p-4"><span className="font-bold text-center">4.9★ Rating</span></div>, span: 'col-span-2' },
    { component: <div className="flex items-center justify-center h-full border-2 border-black bg-white"><MapPin className="w-8 h-8" /></div>, span: 'col-span-1' },
  ]

  return (
    <div className="relative min-h-screen p-4">
      {/* Spotlight Effect */}
      <motion.div
        className="fixed pointer-events-none z-10 w-80 h-80 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(57, 255, 20, 0.1) 0%, rgba(57, 255, 20, 0.05) 50%, transparent 70%)`,
          left: mousePosition.x - 160,
          top: mousePosition.y - 160,
        }}
        animate={{
          left: mousePosition.x - 160,
          top: mousePosition.y - 160,
        }}
        transition={{
          type: "tween",
          duration: 0.1,
        }}
      />
      
      {/* Grid */}
      <div className="grid grid-cols-6 gap-4 min-h-screen auto-rows-fr">
        {gridItems.map((item, index) => (
          <GridItem
            key={index}
            mousePosition={mousePosition}
            className={item.span}
            isPermanentActive={item.component.props?.isPermanentActive}
          >
            {item.component}
          </GridItem>
        ))}
      </div>
    </div>
  )
}
