"use client"

import { useState, useEffect } from 'react'
import RestaurantSidebar from '../components/ui/RestaurantSidebar'
import LiveTicker from '../components/ui/LiveTicker'
import OrderManagement from '../components/ui/OrderManagement'
import { calculateStats } from './dummyData'
import { Order, OrderStatus, RestaurantStats, Restaurant } from './types'

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<RestaurantStats>({
    incomingOrders: 0,
    preparingOrders: 0,
    totalSalesToday: 0,
    ordersCompletedToday: 0,
    averagePrepTime: 0,
    revenue: { today: 0, week: 0, month: 0 }
  })
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch restaurant data and orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch restaurant info
        const restaurantRes = await fetch('/api/restaurants', { credentials: 'include' })
        if (restaurantRes.ok) {
          const restaurantData = await restaurantRes.json()
          setRestaurant(restaurantData)
        }
        
        // Fetch orders
        const ordersRes = await fetch('/api/orders', { credentials: 'include' })
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
          setOrders(ordersData)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Update stats whenever orders change
  useEffect(() => {
    setStats(calculateStats(orders))
  }, [orders])

  // Auto-refresh orders and stats every 30 seconds for live feel
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const ordersRes = await fetch('/api/orders', { credentials: 'include' })
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json()
          setOrders(ordersData)
        }
      } catch (error) {
        console.error('Failed to refresh orders:', error)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleOrderStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Failed to update order status:', errorData.error)
        alert(`Failed to update order status: ${errorData.error || 'Unknown error'}`)
        return
      }

      // Update local state on successful API call
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                updatedAt: new Date(),
                // Adjust estimated time based on status
                estimatedTime: newStatus === 'DELIVERED' ? 0 : order.estimatedTime
              }
            : order
        )
      )

      console.log(`Order ${orderId} status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-[#39FF14] border-t-transparent animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-black mb-2">Loading Dashboard...</h2>
          <p className="text-gray-600 font-normal">Fetching your restaurant data</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-2">Restaurant Not Found</h2>
          <p className="text-gray-600 font-normal">No restaurant associated with your account</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <RestaurantSidebar 
        restaurant={restaurant} 
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
