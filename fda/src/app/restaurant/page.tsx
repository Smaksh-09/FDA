"use client"

import { useState, useEffect } from 'react'
import RestaurantSidebar from '../components/ui/RestaurantSidebar'
import LiveTicker from '../components/ui/LiveTicker'
import OrderManagement from '../components/ui/OrderManagement'
import { dummyOrders, dummyRestaurant, calculateStats } from './dummyData'
import { Order, OrderStatus, RestaurantStats } from './types'

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState<Order[]>(dummyOrders)
  const [stats, setStats] = useState<RestaurantStats>(calculateStats(dummyOrders))

  // Update stats whenever orders change
  useEffect(() => {
    setStats(calculateStats(orders))
  }, [orders])

  // Auto-refresh stats every 30 seconds for live feel
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(calculateStats(orders))
    }, 30000)

    return () => clearInterval(interval)
  }, [orders])

  const handleOrderStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              updatedAt: new Date(),
              // Adjust estimated time based on status
              estimatedTime: newStatus === 'READY' || newStatus === 'DELIVERED' ? 0 : order.estimatedTime
            }
          : order
      )
    )

    // Show a brief success indication (you could add a toast here)
    console.log(`Order ${orderId} status updated to ${newStatus}`)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <RestaurantSidebar 
        restaurant={dummyRestaurant} 
        currentPage="dashboard" 
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Live Ticker */}
        <LiveTicker stats={stats} />

        {/* Order Management */}
        <OrderManagement 
          orders={orders}
          onOrderStatusChange={handleOrderStatusChange}
        />

        {/* Quick Stats Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border-2 border-black p-4">
            <h3 className="font-bold text-black text-sm mb-2">TODAY'S PERFORMANCE</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-normal text-black">Orders Completed:</span>
                <span className="font-bold text-black">{stats.ordersCompletedToday}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-normal text-black">Revenue:</span>
                <span className="font-bold text-black">₹{stats.revenue.today.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-normal text-black">Avg Prep Time:</span>
                <span className="font-bold text-black">{stats.averagePrepTime} mins</span>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-4">
            <h3 className="font-bold text-black text-sm mb-2">WEEKLY OVERVIEW</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-normal text-black">Projected Revenue:</span>
                <span className="font-bold text-black">₹{stats.revenue.week.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-normal text-black">Daily Average:</span>
                <span className="font-bold text-black">₹{Math.round(stats.revenue.week / 7).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-4">
            <h3 className="font-bold text-black text-sm mb-2">QUICK ACTIONS</h3>
            <div className="space-y-2">
              <button className="w-full py-2 px-3 bg-[#39FF14] border-2 border-black text-black font-bold text-sm hover:neobrutalist-shadow transition-all">
                MARK ALL READY
              </button>
              <button className="w-full py-2 px-3 bg-white border-2 border-black text-black font-bold text-sm hover:bg-gray-50 transition-colors">
                EXPORT ORDERS
              </button>
              <button className="w-full py-2 px-3 bg-white border-2 border-black text-black font-bold text-sm hover:bg-gray-50 transition-colors">
                CLOSE RESTAURANT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
