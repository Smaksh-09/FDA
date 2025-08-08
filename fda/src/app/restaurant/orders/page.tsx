"use client"

import { useState, useEffect } from 'react'
import { Clock, Phone, MapPin, CreditCard, X } from 'lucide-react'
import RestaurantSidebar from '../../components/ui/RestaurantSidebar'
import { dummyOrders, dummyRestaurant } from '../dummyData'
import { Order, OrderStatus } from '../types'

interface StatusModalProps {
  order: Order
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void
}

function StatusModal({ order, isOpen, onClose, onStatusUpdate }: StatusModalProps) {
  if (!isOpen) return null

  const getNextActions = (currentStatus: OrderStatus): { label: string; status: OrderStatus; color: string }[] => {
    switch (currentStatus) {
      case 'PENDING':
        return [
          { label: 'CONFIRM ORDER', status: 'CONFIRMED', color: 'bg-[#39FF14] text-black' },
          { label: 'CANCEL ORDER', status: 'CANCELLED', color: 'bg-red-500 text-white' }
        ]
      case 'CONFIRMED':
        return [
          { label: 'START PREPARING', status: 'PREPARING', color: 'bg-[#0052FF] text-white' },
          { label: 'CANCEL ORDER', status: 'CANCELLED', color: 'bg-red-500 text-white' }
        ]
      case 'PREPARING':
        return [
          { label: 'MARK AS READY', status: 'READY', color: 'bg-[#39FF14] text-black' }
        ]
      case 'READY':
        return [
          { label: 'MARK AS DELIVERED', status: 'DELIVERED', color: 'bg-[#39FF14] text-black' }
        ]
      default:
        return []
    }
  }

  const nextActions = getNextActions(order.status)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black p-6 max-w-md w-full mx-4 neobrutalist-shadow">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-black">UPDATE ORDER STATUS</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Order Info */}
        <div className="mb-6 p-4 bg-[#F5F5F5] border-2 border-black">
          <div className="font-mono font-bold text-lg text-black mb-2">
            {order.orderNumber}
          </div>
          <div className="text-sm space-y-1">
            <div><span className="font-bold">Customer:</span> {order.customerName}</div>
            <div><span className="font-bold">Total:</span> ₹{order.totalAmount.toLocaleString('en-IN')}</div>
            <div><span className="font-bold">Current Status:</span> {order.status}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {nextActions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                onStatusUpdate(order.id, action.status)
                onClose()
              }}
              className={`w-full py-3 px-4 border-2 border-black font-bold text-sm transition-all hover:neobrutalist-shadow ${action.color}`}
            >
              [ {action.label} ]
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 px-4 bg-white border-2 border-black text-black font-bold text-sm hover:bg-gray-50 transition-colors"
        >
          [ CANCEL ]
        </button>
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(dummyOrders)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newOrderHighlight, setNewOrderHighlight] = useState<Set<string>>(new Set())

  // Simulate new orders coming in
  useEffect(() => {
    const interval = setInterval(() => {
      // Random chance of new order (20% every 30 seconds)
      if (Math.random() < 0.2) {
        const newOrder: Order = {
          id: `new-${Date.now()}`,
          orderNumber: `ORD-${String(Math.floor(Math.random() * 9999)).padStart(3, '0')}`,
          customerName: ['John Doe', 'Jane Smith', 'Alex Kumar', 'Sarah Wilson'][Math.floor(Math.random() * 4)],
          customerPhone: '+91 98765 43210',
          items: [
            { id: '1', name: 'Classic Cheeseburger', quantity: 1, price: 249 },
            { id: '2', name: 'French Fries', quantity: 1, price: 99 }
          ],
          totalAmount: 348,
          status: 'PENDING',
          estimatedTime: 15,
          placedAt: new Date(),
          updatedAt: new Date(),
          deliveryAddress: 'New Order Address',
          paymentMethod: 'UPI'
        }

        setOrders(prev => [newOrder, ...prev])
        
        // Add highlight effect
        setNewOrderHighlight(prev => new Set([...prev, newOrder.id]))
        
        // Remove highlight after 5 seconds
        setTimeout(() => {
          setNewOrderHighlight(prev => {
            const newSet = new Set(prev)
            newSet.delete(newOrder.id)
            return newSet
          })
        }, 5000)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              updatedAt: new Date(),
              estimatedTime: newStatus === 'READY' || newStatus === 'DELIVERED' ? 0 : order.estimatedTime
            }
          : order
      )
    )
  }

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'PENDING':
        return 'bg-[#0052FF] text-white'
      case 'CONFIRMED':
        return 'bg-gray-600 text-white'
      case 'PREPARING':
        return 'bg-[#39FF14] text-black'
      case 'READY':
        return 'bg-orange-500 text-white'
      case 'DELIVERED':
        return 'bg-green-600 text-white'
      case 'CANCELLED':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-400 text-white'
    }
  }

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const sortedOrders = [...orders].sort((a, b) => {
    // Sort by status priority first, then by time
    const statusPriority = { 'PENDING': 0, 'CONFIRMED': 1, 'PREPARING': 2, 'READY': 3, 'DELIVERED': 4, 'CANCELLED': 5 }
    const aPriority = statusPriority[a.status] || 99
    const bPriority = statusPriority[b.status] || 99
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }
    
    return b.placedAt.getTime() - a.placedAt.getTime()
  })

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <RestaurantSidebar 
        restaurant={dummyRestaurant} 
        currentPage="orders" 
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-black text-black mb-2">
            ACTIVE ORDERS
          </h1>
          <p className="text-gray-600 font-normal">
            Real-time order management • {orders.length} total orders
          </p>
        </div>

        {/* Orders Table */}
        <div className="bg-white border-2 border-black neobrutalist-shadow">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 p-4 border-b-2 border-black bg-[#F5F5F5] font-bold text-black text-sm">
            <div>ORDER ID</div>
            <div>CUSTOMER</div>
            <div>ITEMS</div>
            <div>TOTAL</div>
            <div>STATUS</div>
            <div>TIME</div>
          </div>

          {/* Orders List */}
          <div className="divide-y-2 divide-black">
            {sortedOrders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600 font-normal text-lg">No orders found</p>
              </div>
            ) : (
              sortedOrders.map((order) => (
                <div
                  key={order.id}
                  className={`grid grid-cols-6 gap-4 p-4 hover:bg-gray-50 transition-all ${
                    newOrderHighlight.has(order.id) 
                      ? 'bg-[#39FF14] bg-opacity-20 border-2 border-[#39FF14] animate-pulse' 
                      : ''
                  }`}
                >
                  {/* Order ID */}
                  <div>
                    <div className="font-mono font-bold text-black text-lg">
                      {order.orderNumber}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(order.placedAt)}
                    </div>
                  </div>

                  {/* Customer */}
                  <div>
                    <div className="font-bold text-black">{order.customerName}</div>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {order.customerPhone}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{order.deliveryAddress}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <div className="font-normal text-black">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-600">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx}>{item.quantity}x {item.name}</div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-gray-500">+{order.items.length - 2} more...</div>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  <div>
                    <div className="font-bold text-black text-lg">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      {order.paymentMethod}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className={`px-3 py-2 border-2 border-black font-bold text-sm transition-all hover:neobrutalist-shadow ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </button>
                    {order.estimatedTime > 0 && (
                      <div className="text-xs text-gray-600 mt-1">
                        ~{order.estimatedTime} mins
                      </div>
                    )}
                  </div>

                  {/* Time Elapsed */}
                  <div>
                    <div className="font-normal text-black">
                      {Math.floor((Date.now() - order.placedAt.getTime()) / 60000)} min ago
                    </div>
                    <div className="text-xs text-gray-600">
                      Updated: {formatTime(order.updatedAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'PENDING', count: orders.filter(o => o.status === 'PENDING').length, color: 'bg-[#0052FF]' },
            { label: 'PREPARING', count: orders.filter(o => o.status === 'PREPARING').length, color: 'bg-[#39FF14]' },
            { label: 'READY', count: orders.filter(o => o.status === 'READY').length, color: 'bg-orange-500' },
            { label: 'DELIVERED', count: orders.filter(o => o.status === 'DELIVERED').length, color: 'bg-green-600' }
          ].map((stat, index) => (
            <div key={index} className="bg-white border-2 border-black p-4">
              <div className={`w-4 h-4 ${stat.color} border border-black mb-2`}></div>
              <div className="font-bold text-black text-2xl">{stat.count}</div>
              <div className="text-gray-600 font-normal text-sm">{stat.label}</div>
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
