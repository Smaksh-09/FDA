"use client"

import { Star } from 'lucide-react'

interface ExampleCardProps {
  title: string
  price: string
  isActive?: boolean
}

export default function ExampleCard({ title, price, isActive = false }: ExampleCardProps) {
  return (
    <div className={`w-full h-full border-2 border-black p-4 transition-all duration-100 ${
      isActive 
        ? 'bg-[#39FF14] neobrutalist-shadow-active' 
        : 'bg-white'
    }`}>
      <div className="flex flex-col justify-between h-full">
        <div>
          <h3 className="font-bold text-xl text-black">{title}</h3>
          <div className="flex items-center mt-2">
            <Star className="w-4 h-4 fill-black" />
            <Star className="w-4 h-4 fill-black" />
            <Star className="w-4 h-4 fill-black" />
            <Star className="w-4 h-4 fill-black" />
            <Star className="w-4 h-4 fill-black" />
          </div>
        </div>
        <div className="mt-4">
          <span className="font-black text-2xl text-black">{price.replace('$', '₹')}</span>
        </div>
      </div>
    </div>
  )
}
