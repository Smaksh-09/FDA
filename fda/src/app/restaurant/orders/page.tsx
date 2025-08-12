"use client"

import { useState, useEffect } from 'react'
import { Clock, Phone, MapPin, CreditCard, X, RefreshCw } from 'lucide-react'
import RestaurantSidebar from '../../components/ui/RestaurantSidebar'
import { useUserStore } from '@/store/useUserStore'
import { OrderStatus } from '@prisma/client'

// Real data interfaces based on API structure
interface OrderItem {
  id: string
  quantity: number
  priceAtTimeOfOrder: number
  foodItem: {
    name: string
    imageUrl?: string
  }
}

interface Order {
  id: string
  totalPrice: number
  status: OrderStatus
  createdAt: string
  updatedAt: string
  user?: {
    name: string
    email: string
  }
  restaurant: {
    name: string
  }
  items: OrderItem[]
}

interface Restaurant {
  id: string
  name: string
  description: string
  address: string
  imageUrl?: string
  isOpen: boolean
  phone: string
  email: string
}

interface StatusModalProps {
  order: Order
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => Promise<void>
}

function StatusModal({ order, isOpen, onClose, onStatusUpdate }: StatusModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  
  if (!isOpen) return null

  const getNextActions = (currentStatus: OrderStatus): { label: string; status: OrderStatus; color: string }[] => {
    switch (currentStatus) {
      case 'PENDING':
        return [
          { label: 'CONFIRM ORDER', status: 'CONFIRMED', color: 'bg-lime-400 text-black' },
          { label: 'CANCEL ORDER', status: 'CANCELLED', color: 'bg-black text-white' }
        ]
      case 'CONFIRMED':
        return [
          { label: 'START PREPARING', status: 'PREPARING', color: 'bg-blue-600 text-white' },
          { label: 'CANCEL ORDER', status: 'CANCELLED', color: 'bg-black text-white' }
        ]
      case 'PREPARING':
        return [
          { label: 'OUT FOR DELIVERY', status: 'OUT_FOR_DELIVERY', color: 'bg-lime-400 text-black' }
        ]
      case 'OUT_FOR_DELIVERY':
        return [
          { label: 'MARK AS DELIVERED', status: 'DELIVERED', color: 'bg-lime-400 text-black' }
        ]
      default:
        return []
    }
  }

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setIsUpdating(true)
    try {
      await onStatusUpdate(order.id, newStatus)
      onClose()
    } catch (error) {
      console.error('Failed to update order status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const nextActions = getNextActions(order.status)

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 border-2 border-black p-6 max-w-md w-full mx-4" style={{ boxShadow: '4px 4px 0px #000' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-black">UPDATE ORDER STATUS</h2>
          <button
            onClick={onClose}
            className="p-1 border-2 border-black hover:bg-lime-400 transition-colors"
            disabled={isUpdating}
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Order Info */}
        <div className="mb-6 p-4 bg-white border-2 border-black">
          <div className="font-mono font-bold text-lg text-black mb-2">
            ORDER #{order.id.slice(-8).toUpperCase()}
          </div>
          <div className="text-sm space-y-1">
            <div><span className="font-bold">Customer:</span> {order.user?.name || 'Unknown Customer'}</div>
            <div><span className="font-bold">Email:</span> {order.user?.email || 'No email available'}</div>
            <div><span className="font-bold">Total:</span> ₹{order.totalPrice.toLocaleString('en-IN')}</div>
            <div><span className="font-bold">Current Status:</span> {order.status}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {nextActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleStatusUpdate(action.status)}
              disabled={isUpdating}
              className={`w-full py-3 px-4 border-2 border-black font-bold text-sm transition-all hover:translate-x-1 hover:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed ${action.color}`}
              style={{ boxShadow: '2px 2px 0px #000' }}
            >
              {isUpdating ? 'UPDATING...' : `[ ${action.label} ]`}
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          disabled={isUpdating}
          className="w-full mt-4 py-2 px-4 bg-white border-2 border-black text-black font-bold text-sm hover:bg-lime-400 transition-colors disabled:opacity-50"
          style={{ boxShadow: '2px 2px 0px #000' }}
        >
          [ CANCEL ]
        </button>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const { user, isLoading } = useUserStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newOrderHighlight, setNewOrderHighlight] = useState<Set<string>>(new Set())
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!user?.id) return
      
      try {
        const response = await fetch('/api/restaurants', {
          method: 'GET',
          credentials: 'include'
        })
        
        if (response.ok) {
          const restaurantData = await response.json()
          setRestaurant(restaurantData)
        }
      } catch (error) {
        console.error('Failed to fetch restaurant:', error)
      }
    }
    
    if (user && user.role === 'RESTAURANT_OWNER') {
      fetchRestaurant()
    }
  }, [user])

  // Fetch orders data
  const fetchOrders = async () => {
    if (!user?.id) return
    
    setIsLoadingOrders(true)
    setError(null)
    
    try {
      const response = await fetch('/api/orders', {
        method: 'GET',
        credentials: 'include'
      })
      
      if (response.ok) {
        const ordersData = await response.json()
        setOrders(ordersData)
      } else {
        throw new Error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      setError('Failed to load orders. Please try again.')
    } finally {
      setIsLoadingOrders(false)
    }
  }

  useEffect(() => {
    if (user && user.role === 'RESTAURANT_OWNER') {
      fetchOrders()
    }
  }, [user])

  // Auto-refresh orders every 30 seconds
  useEffect(() => {
    if (user && user.role === 'RESTAURANT_OWNER') {
      const interval = setInterval(fetchOrders, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus): Promise<void> => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        // Update local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId
              ? {
                  ...order,
                  status: newStatus,
                  updatedAt: new Date().toISOString()
                }
              : order
          )
        )
      } else {
        throw new Error('Failed to update order status')
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
      throw error
    }
  }

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'PENDING':
        return 'bg-blue-600 text-white'
      case 'CONFIRMED':
        return 'bg-black text-white'
      case 'PREPARING':
        return 'bg-lime-400 text-black'
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-600 text-white'
      case 'DELIVERED':
        return 'bg-black text-white'
      case 'CANCELLED':
        return 'bg-black text-white'
      default:
        return 'bg-black text-white'
    }
  }

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const sortedOrders = [...orders].sort((a, b) => {
    // Sort by status priority first, then by time
    const statusPriority = { 
      'PENDING': 0, 
      'CONFIRMED': 1, 
      'PREPARING': 2, 
      'OUT_FOR_DELIVERY': 3, 
      'DELIVERED': 4, 
      'CANCELLED': 5 
    }
    const aPriority = statusPriority[a.status] || 99
    const bPriority = statusPriority[b.status] || 99
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="font-extrabold text-2xl text-black mb-2">LOADING...</div>
          <div className="text-black">Please wait while we load your data</div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'RESTAURANT_OWNER') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="font-extrabold text-2xl text-black mb-2">ACCESS DENIED</div>
          <div className="text-black">You need to be a restaurant owner to access this page</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <RestaurantSidebar 
        restaurant={restaurant || { 
          phone: '',
          email: '',
          id: '', 
          name: 'Loading...', 
          description: '', 
          address: '', 
          isOpen: false 
        }} 
        currentPage="orders" 
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-black mb-2">
              ACTIVE ORDERS
            </h1>
            <p className="text-black font-normal">
              Real-time order management • {orders.length} total orders
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={isLoadingOrders}
            className="px-4 py-2 bg-lime-400 border-2 border-black text-black font-bold hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50"
            style={{ boxShadow: '2px 2px 0px #000' }}
          >
            <RefreshCw className={`w-4 h-4 inline mr-2 ${isLoadingOrders ? 'animate-spin' : ''}`} />
            REFRESH
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-white border-2 border-black">
            <div className="text-black font-bold">ERROR: {error}</div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white border-2 border-black" style={{ boxShadow: '4px 4px 0px #000' }}>
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 p-4 border-b-2 border-black bg-gray-100 font-bold text-black text-sm">
            <div>ORDER ID</div>
            <div>CUSTOMER</div>
            <div>ITEMS</div>
            <div>TOTAL</div>
            <div>STATUS</div>
          </div>

          {/* Orders List */}
          <div className="divide-y-2 divide-black">
            {isLoadingOrders ? (
              <div className="p-8 text-center">
                <p className="text-black font-bold text-lg">LOADING ORDERS...</p>
              </div>
            ) : sortedOrders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-black font-normal text-lg">NO ORDERS FOUND</p>
                <p className="text-black text-sm mt-2">New orders will appear here automatically</p>
              </div>
            ) : (
              sortedOrders.map((order) => (
                <div
                  key={order.id}
                  className={`grid grid-cols-5 gap-4 p-4 hover:bg-lime-400 hover:bg-opacity-20 transition-all ${
                    newOrderHighlight.has(order.id) 
                      ? 'bg-lime-400 bg-opacity-20 animate-pulse' 
                      : ''
                  }`}
                >
                  {/* Order ID */}
                  <div>
                    <div className="font-mono font-bold text-black text-lg">
                      #{order.id.slice(-8).toUpperCase()}
                    </div>
                    <div className="text-xs text-black flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(order.createdAt)}
                    </div>
                  </div>

                  {/* Customer */}
                  <div>
                    <div className="font-bold text-black">{order.user?.name || 'Unknown Customer'}</div>
                    <div className="text-xs text-black">
                      {order.user?.email || 'No email available'}
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <div className="font-bold text-black">
                      {order.items.length} ITEM{order.items.length > 1 ? 'S' : ''}
                    </div>
                    <div className="text-xs text-black">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx}>{item.quantity}x {item.foodItem.name}</div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-black">+{order.items.length - 2} more...</div>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div>
                    <div className="font-bold text-black text-lg">
                      ₹{order.totalPrice.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-black">
                      ORDER TOTAL
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className={`px-3 py-2 border-2 border-black font-bold text-sm transition-all hover:translate-x-1 hover:translate-y-1 ${getStatusColor(order.status)}`}
                      style={{ boxShadow: '2px 2px 0px #000' }}
                    >
                      {order.status.replace('_', ' ')}
                    </button>
                    <div className="text-xs text-black mt-1">
                      {Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)} min ago
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'PENDING', count: orders.filter(o => o.status === 'PENDING').length, color: 'bg-blue-600' },
            { label: 'CONFIRMED', count: orders.filter(o => o.status === 'CONFIRMED').length, color: 'bg-black' },
            { label: 'PREPARING', count: orders.filter(o => o.status === 'PREPARING').length, color: 'bg-lime-400' },
            { label: 'OUT FOR DELIVERY', count: orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length, color: 'bg-blue-600' },
            { label: 'DELIVERED', count: orders.filter(o => o.status === 'DELIVERED').length, color: 'bg-black' }
          ].map((stat, index) => (
            <div key={index} className="bg-white border-2 border-black p-4" style={{ boxShadow: '2px 2px 0px #000' }}>
              <div className={`w-4 h-4 ${stat.color} border border-black mb-2`}></div>
              <div className="font-bold text-black text-2xl">{stat.count}</div>
              <div className="text-black font-bold text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Update Modal */}
      <StatusModal
        order={selectedOrder!}
        isOpen={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  )
}
