"use client"

import { useState } from 'react'
import { Clock, Phone, MapPin, CreditCard, Banknote, Smartphone } from 'lucide-react'
import { Order, OrderStatus } from '../../restaurant/types'

interface OrderManagementProps {
  orders: Order[]
  onOrderStatusChange: (orderId: string, newStatus: OrderStatus) => void
}

export default function OrderManagement({ orders, onOrderStatusChange }: OrderManagementProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const formatTime = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    return `${Math.floor(diffMins / 60)}h ${diffMins % 60}m ago`
  }

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'PENDING': return 'text-red-600'
      case 'CONFIRMED': return 'text-blue-600'
      case 'PREPARING': return 'text-[#39FF14]'
      case 'READY': return 'text-green-600'
      case 'DELIVERED': return 'text-gray-600'
      case 'CANCELLED': return 'text-red-400'
      default: return 'text-black'
    }
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'CASH': return <Banknote className="w-4 h-4" />
      case 'CARD': return <CreditCard className="w-4 h-4" />
      case 'UPI': return <Smartphone className="w-4 h-4" />
      default: return <CreditCard className="w-4 h-4" />
    }
  }

  const getActionButtons = (order: Order) => {
    switch (order.status) {
      case 'PENDING':
        return (
          <>
            <button
              onClick={() => onOrderStatusChange(order.id, 'CONFIRMED')}
              className="px-3 py-1 bg-[#39FF14] border-2 border-black text-black font-bold text-sm hover:neobrutalist-shadow transition-all"
            >
              [CONFIRM]
            </button>
            <button
              onClick={() => onOrderStatusChange(order.id, 'CANCELLED')}
              className="px-3 py-1 bg-white border-2 border-black text-black font-bold text-sm hover:bg-red-50 transition-colors"
            >
              [CANCEL]
            </button>
          </>
        )
      case 'CONFIRMED':
        return (
          <button
            onClick={() => onOrderStatusChange(order.id, 'PREPARING')}
            className="px-3 py-1 bg-[#39FF14] border-2 border-black text-black font-bold text-sm hover:neobrutalist-shadow transition-all"
          >
            [START PREP]
          </button>
        )
      case 'PREPARING':
        return (
          <button
            onClick={() => onOrderStatusChange(order.id, 'READY')}
            className="px-3 py-1 bg-[#39FF14] border-2 border-black text-black font-bold text-sm hover:neobrutalist-shadow transition-all"
          >
            [READY]
          </button>
        )
      case 'READY':
        return (
          <button
            onClick={() => onOrderStatusChange(order.id, 'DELIVERED')}
            className="px-3 py-1 bg-[#39FF14] border-2 border-black text-black font-bold text-sm hover:neobrutalist-shadow transition-all"
          >
            [DELIVERED]
          </button>
        )
      default:
        return (
          <span className="px-3 py-1 bg-gray-200 border-2 border-black text-gray-600 font-bold text-sm">
            [{order.status}]
          </span>
        )
    }
  }

  // Sort orders by status priority and time
  const sortedOrders = [...orders].sort((a, b) => {
    const statusPriority = {
      'PENDING': 0,
      'CONFIRMED': 1,
      'PREPARING': 2,
      'READY': 3,
      'DELIVERED': 4,
      'CANCELLED': 5
    }
    
    const aPriority = statusPriority[a.status]
    const bPriority = statusPriority[b.status]
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }
    
    return a.placedAt.getTime() - b.placedAt.getTime()
  })

  return (
    <div className="bg-white border-2 border-black">
      {/* Header */}
      <div className="p-4 border-b-2 border-black bg-[#F5F5F5]">
        <h2 className="text-black font-black text-xl">ORDER MANAGEMENT</h2>
        <p className="text-gray-600 font-normal text-sm mt-1">
          {orders.length} orders • Click actions to update status
        </p>
      </div>

      {/* Orders List */}
      <div className="max-h-[70vh] overflow-y-auto">
        {sortedOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 font-normal">No orders to display</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-black">
            {sortedOrders.map((order) => (
              <div
                key={order.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${
                  selectedOrder === order.id ? 'bg-gray-50' : ''
                }`}
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <span className="font-black text-black text-lg font-mono">
                      {order.orderNumber}
                    </span>
                    <span className={`font-bold text-sm font-mono ${getStatusColor(order.status)}`}>
                      [{order.status}]
                    </span>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="font-normal text-sm">{formatTime(order.placedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getActionButtons(order)}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <span className="font-bold text-black text-sm">CUSTOMER:</span>
                    <p className="font-normal text-black">{order.customerName}</p>
                    <div className="flex items-center gap-1 text-gray-600 mt-1">
                      <Phone className="w-3 h-3" />
                      <span className="font-normal text-xs">{order.customerPhone}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-bold text-black text-sm">PAYMENT:</span>
                    <div className="flex items-center gap-1 mt-1">
                      {getPaymentIcon(order.paymentMethod)}
                      <span className="font-normal text-black">{order.paymentMethod}</span>
                      <span className="font-bold text-black ml-2">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-bold text-black text-sm">EST. TIME:</span>
                    <p className="font-bold text-black">{order.estimatedTime} mins</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-3">
                  <span className="font-bold text-black text-sm">ITEMS:</span>
                  <div className="mt-1 space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="font-normal text-black">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-bold text-black">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                {order.deliveryAddress && (
                  <div>
                    <span className="font-bold text-black text-sm">DELIVERY:</span>
                    <div className="flex items-start gap-1 mt-1">
                      <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                      <p className="font-normal text-gray-600 text-sm leading-tight">
                        {order.deliveryAddress}
                      </p>
                    </div>
                  </div>
                )}

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                  className="mt-3 text-xs font-bold text-gray-600 hover:text-black transition-colors"
                >
                  {selectedOrder === order.id ? '[ HIDE DETAILS ]' : '[ SHOW DETAILS ]'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
