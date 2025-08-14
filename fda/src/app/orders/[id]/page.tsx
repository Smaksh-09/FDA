"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, CheckCircle, Truck, Clock, MapPin, Phone } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { useUserStore } from '@/store/useUserStore'

interface OrderItem {
  id: string
  quantity: number
  priceAtTimeOfOrder: number
  foodItem: {
    id: string
    name: string
    imageUrl?: string
  }
}

interface Order {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'
  totalPrice: number
  createdAt: string
  restaurant: {
    id: string
    name: string
  }
  user: {
    name: string
    email: string
  }
  items: OrderItem[]
}

const statusSteps = [
  { key: 'PENDING', label: 'Order Placed', icon: Package, description: 'Your order has been received' },
  { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle, description: 'Restaurant has confirmed your order' },
  { key: 'PREPARING', label: 'Preparing', icon: Package, description: 'Your food is being prepared' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck, description: 'Your order is on the way' },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle, description: 'Enjoy your meal!' }
]

export default function OrderTrackingPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useUserStore()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId || !user) return

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          credentials: 'include'
        })
        
        if (response.ok) {
          const orderData = await response.json()
          setOrder(orderData)
        } else {
          setError('Order not found')
        }
      } catch (error) {
        console.error('Failed to fetch order:', error)
        setError('Failed to load order details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
    
    // Poll for updates every 15 seconds
    const interval = setInterval(fetchOrder, 15000)
    return () => clearInterval(interval)
  }, [orderId, user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="font-extrabold text-2xl text-black mb-2">LOADING ORDER...</div>
          <div className="text-black">Fetching your order details</div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="font-extrabold text-2xl text-black mb-2">ERROR</div>
          <div className="text-black mb-4">{error || 'Order not found'}</div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-lime-400 border-2 border-black text-black font-bold hover:translate-x-1 hover:translate-y-1 transition-all"
            style={{ boxShadow: '2px 2px 0px #000' }}
          >
            [ GO BACK ]
          </button>
        </div>
      </div>
    )
  }

  const currentStatusIndex = statusSteps.findIndex(step => step.key === order.status)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b-2 border-black p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => router.back()}
              whileHover={{ x: -2, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-lime-400 border-2 border-black hover:bg-white transition-colors"
              style={{ boxShadow: '2px 2px 0px #000' }}
            >
              <ArrowLeft className="w-5 h-5 text-black" />
            </motion.button>
            <div>
              <h1 className="text-2xl font-extrabold text-black">ORDER TRACKING</h1>
              <p className="text-black text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Status Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-black p-6" style={{ boxShadow: '4px 4px 0px #000' }}>
              <h2 className="font-extrabold text-black text-xl mb-6">ORDER STATUS</h2>
              
              <div className="space-y-6">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon
                  const isCompleted = index <= currentStatusIndex
                  const isCurrent = index === currentStatusIndex
                  
                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4"
                    >
                      <div className={`w-12 h-12 border-2 border-black flex items-center justify-center ${
                        isCompleted ? 'bg-lime-400' : 'bg-gray-200'
                      }`}>
                        <Icon className={`w-6 h-6 ${isCompleted ? 'text-black' : 'text-gray-500'}`} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`font-bold ${isCompleted ? 'text-black' : 'text-gray-500'}`}>
                          {step.label}
                          {isCurrent && (
                            <motion.span
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="ml-2 text-lime-400 text-sm"
                            >
                              (CURRENT)
                            </motion.span>
                          )}
                        </h3>
                        <p className={`text-sm ${isCompleted ? 'text-black' : 'text-gray-400'}`}>
                          {step.description}
                        </p>
                      </div>
                      
                      {isCompleted && (
                        <div className="text-xs text-black font-bold bg-lime-400 px-2 py-1 border border-black">
                          ✓ DONE
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white border-2 border-black p-4" style={{ boxShadow: '4px 4px 0px #000' }}>
              <h3 className="font-extrabold text-black mb-4">ORDER SUMMARY</h3>
              
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-black text-sm">{item.foodItem.name}</p>
                      <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-black">
                      ₹{(item.priceAtTimeOfOrder * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
                
                <div className="border-t-2 border-black pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-black">TOTAL</span>
                    <span className="font-extrabold text-black text-lg">
                      ₹{order.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="bg-white border-2 border-black p-4" style={{ boxShadow: '4px 4px 0px #000' }}>
              <h3 className="font-extrabold text-black mb-4">RESTAURANT</h3>
              <div className="space-y-2">
                <p className="font-bold text-black">{order.restaurant.name}</p>
                <div className="flex items-center gap-2 text-sm text-black">
                  <MapPin className="w-4 h-4" />
                  <span>Restaurant Location</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-black">
                  <Phone className="w-4 h-4" />
                  <span>Contact Restaurant</span>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-white border-2 border-black p-4" style={{ boxShadow: '4px 4px 0px #000' }}>
              <h3 className="font-extrabold text-black mb-4">ORDER INFO</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-bold text-black">{order.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Placed At:</span>
                  <span className="font-bold text-black">
                    {new Date(order.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-bold text-black">{order.status.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
