"use client"

import { useEffect, useState } from 'react'
import { RestaurantStats } from '../../restaurant/types'

interface LiveTickerProps {
  stats: RestaurantStats
}

export default function LiveTicker({ stats }: LiveTickerProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second for live feel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-IN', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="bg-black border-2 border-black p-6 mb-6">
      {/* Header with time */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[#39FF14] font-black text-2xl tracking-wider font-mono">
          LIVE DASHBOARD
        </h1>
        <div className="text-[#39FF14] font-bold text-lg font-mono">
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Main stats ticker */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Incoming Orders */}
        <div className="text-center">
          <div className="text-[#39FF14] font-mono font-bold text-sm mb-2 tracking-widest">
            INCOMING ORDERS
          </div>
          <div className="text-white font-mono font-black text-5xl md:text-6xl">
            {stats.incomingOrders.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Preparing */}
        <div className="text-center">
          <div className="text-[#39FF14] font-mono font-bold text-sm mb-2 tracking-widest">
            PREPARING
          </div>
          <div className="text-white font-mono font-black text-5xl md:text-6xl">
            {stats.preparingOrders.toString().padStart(2, '0')}
          </div>
        </div>

        {/* Total Sales Today */}
        <div className="text-center">
          <div className="text-[#39FF14] font-mono font-bold text-sm mb-2 tracking-widest">
            SALES TODAY
          </div>
          <div className="text-white font-mono font-black text-3xl md:text-4xl">
            {formatCurrency(stats.totalSalesToday)}
          </div>
        </div>

        {/* Average Prep Time */}
        <div className="text-center">
          <div className="text-[#39FF14] font-mono font-bold text-sm mb-2 tracking-widest">
            AVG PREP TIME
          </div>
          <div className="text-white font-mono font-black text-4xl md:text-5xl">
            {stats.averagePrepTime}
            <span className="text-2xl ml-1">MINS</span>
          </div>
        </div>
      </div>

      {/* Secondary stats */}
      <div className="mt-6 pt-4 border-t border-[#39FF14] flex justify-between items-center text-sm">
        <div className="text-[#39FF14] font-mono font-bold">
          COMPLETED TODAY: <span className="text-white">{stats.ordersCompletedToday}</span>
        </div>
        <div className="text-[#39FF14] font-mono font-bold">
          STATUS: <span className="text-white">OPERATIONAL</span>
        </div>
        <div className="text-[#39FF14] font-mono font-bold">
          ACTIVE SINCE: <span className="text-white">06:00</span>
        </div>
      </div>
    </div>
  )
}
