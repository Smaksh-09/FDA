"use client"

import { useState } from 'react'
import { ChevronDown, ChevronUp, Calendar, IndianRupee } from 'lucide-react'
import { OrderHistoryItem, OrderStatus } from '../../account/types'

interface OrderHistoryTabProps {
  orderHistory: OrderHistoryItem[]
}

export default function OrderHistoryTab({ orderHistory }: OrderHistoryTabProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'PREPARING':
        return 'bg-[#0052FF] text-white' // Warning Blue
      case 'DELIVERED':
        return 'bg-[#39FF14] text-black' // Electric Lime
      case 'CANCELLED':
        return 'bg-red-500 text-white' // Red
      case 'PENDING':
        return 'bg-gray-600 text-white'
      case 'CONFIRMED':
        return 'bg-blue-600 text-white'
      case 'OUT_FOR_DELIVERY':
        return 'bg-orange-600 text-white'
      default:
        return 'bg-gray-400 text-white'
    }
  }

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatOrderTotal = (items: OrderHistoryItem['items']): string => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    return formatCurrency(total)
  }

  // Sort orders by date (most recent first)
  const sortedOrders = [...orderHistory].sort((a, b) => 
    b.placedAt.getTime() - a.placedAt.getTime()
  )

  return (
    <div className="bg-white border-2 border-black neobrutalist-shadow">
      {/* Header */}
      <div className="p-6 border-b-2 border-black bg-[#F5F5F5]">
        <h2 className="text-2xl font-bold text-black mb-2">
          ORDER HISTORY
        </h2>
        <p className="text-gray-600 font-normal text-sm">
          {orderHistory.length} orders • Click on any order to view details
        </p>
      </div>

      {/* Orders List */}
      <div className="divide-y-2 divide-black">
        {sortedOrders.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 font-normal text-lg">No orders found</p>
            <p className="text-gray-500 font-normal text-sm mt-2">
              When you place your first order, it will appear here.
            </p>
          </div>
        ) : (
          sortedOrders.map((order) => {
            const isExpanded = expandedOrders.has(order.id)
            
            return (
              <div key={order.id} className="hover:bg-gray-50 transition-colors">
                {/* Order Row */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleOrderExpansion(order.id)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    {/* Order ID */}
                    <div>
                      <span className="font-bold text-black text-lg font-mono">
                        {order.orderNumber}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                        <span className="text-gray-600 text-xs font-normal">
                          {isExpanded ? 'Hide Details' : 'Show Details'}
                        </span>
                      </div>
                    </div>

                    {/* Restaurant */}
                    <div>
                      <span className="font-bold text-black text-sm">RESTAURANT</span>
                      <p className="font-normal text-black">{order.restaurantName}</p>
                    </div>

                    {/* Total */}
                    <div>
                      <span className="font-bold text-black text-sm">TOTAL</span>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-black" />
                        <span className="font-bold text-black text-lg">
                          {order.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <span className="font-bold text-black text-sm">DATE</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span className="font-normal text-black text-sm">
                          {formatDate(order.placedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex justify-end">
                      <span className={`px-3 py-2 border-2 border-black font-bold text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-6 pb-6 bg-gray-50">
                    <div className="border-2 border-black p-4 bg-white">
                      {/* Order Items */}
                      <div className="mb-4">
                        <h4 className="font-bold text-black text-sm mb-3">ORDER ITEMS</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                              <div>
                                <span className="font-normal text-black">
                                  {item.quantity}x {item.name}
                                </span>
                              </div>
                              <div>
                                <span className="font-bold text-black">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                                <span className="text-gray-600 text-sm ml-2">
                                  ({formatCurrency(item.price)} each)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Timeline */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div>
                          <span className="font-bold text-black text-sm">ORDER PLACED</span>
                          <p className="font-normal text-gray-600">{formatDate(order.placedAt)}</p>
                        </div>
                        {order.deliveredAt && (
                          <div>
                            <span className="font-bold text-black text-sm">DELIVERED</span>
                            <p className="font-normal text-gray-600">{formatDate(order.deliveredAt)}</p>
                          </div>
                        )}
                        {order.estimatedDeliveryTime && (
                          <div>
                            <span className="font-bold text-black text-sm">ESTIMATED TIME</span>
                            <p className="font-normal text-gray-600">{order.estimatedDeliveryTime}</p>
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-black text-sm">CURRENT STATUS</span>
                          <p className="font-normal text-gray-600">{order.status.replace('_', ' ')}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 mt-4">
                        <button className="px-4 py-2 bg-[#39FF14] border-2 border-black text-black font-bold text-sm hover:neobrutalist-shadow transition-all">
                          [REORDER]
                        </button>
                        <button className="px-4 py-2 bg-white border-2 border-black text-black font-bold text-sm hover:bg-gray-50 transition-colors">
                          [VIEW RECEIPT]
                        </button>
                        {order.status === 'DELIVERED' && (
                          <button className="px-4 py-2 bg-white border-2 border-black text-black font-bold text-sm hover:bg-gray-50 transition-colors">
                            [RATE ORDER]
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Summary Footer */}
      {orderHistory.length > 0 && (
        <div className="p-6 border-t-2 border-black bg-[#F5F5F5]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <span className="font-bold text-black text-lg block">
                {orderHistory.length}
              </span>
              <span className="text-gray-600 font-normal text-sm">Total Orders</span>
            </div>
            <div>
              <span className="font-bold text-black text-lg block">
                {orderHistory.filter(o => o.status === 'DELIVERED').length}
              </span>
              <span className="text-gray-600 font-normal text-sm">Completed</span>
            </div>
            <div>
              <span className="font-bold text-black text-lg block">
                {formatCurrency(orderHistory.reduce((sum, order) => sum + order.totalAmount, 0))}
              </span>
              <span className="text-gray-600 font-normal text-sm">Total Spent</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
