"use client"

import { useState, useEffect } from 'react'
import { Clock, ArrowRight, Package, Truck, CheckCircle, X } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'
import { useRouter } from 'next/navigation'

interface OrderItem {
  id: string
  name: string
  quantity: number
}

interface Restaurant {
  id: string
  name: string
}

interface Order {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'
  totalPrice: number
  createdAt: string
  restaurant: Restaurant
  items: { foodItem: OrderItem }[]
}

const statusConfig = {
  PENDING: { 
    label: 'ORDER PLACED', 
    progress: 25, 
    icon: Package, 
    color: 'bg-yellow-400',
    eta: '20-25 MIN'
  },
  CONFIRMED: { 
    label: 'CONFIRMED', 
    progress: 50, 
    icon: CheckCircle, 
    color: 'bg-blue-400',
    eta: '15-20 MIN'
  },
  PREPARING: { 
    label: 'PREPARING', 
    progress: 75, 
    icon: Package, 
    color: 'bg-orange-400',
    eta: '10-15 MIN'
  },
  OUT_FOR_DELIVERY: { 
    label: 'OUT FOR DELIVERY', 
    progress: 90, 
    icon: Truck, 
    color: 'bg-purple-400',
    eta: '5-10 MIN'
  },
  DELIVERED: { 
    label: 'DELIVERED', 
    progress: 100, 
    icon: CheckCircle, 
    color: 'bg-green-400',
    eta: 'COMPLETED'
  },
  CANCELLED: { 
    label: 'CANCELLED', 
    progress: 0, 
    icon: Package, 
    color: 'bg-red-400',
    eta: 'CANCELLED'
  }
}

export default function LiveOrderStatus() {
  const { user } = useUserStore()
  const router = useRouter()
  const [latestOrder, setLatestOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'USER') {
      setIsLoading(false)
      return
    }

    const fetchLatestOrder = async () => {
      try {
        const response = await fetch('/api/orders', {
          cache: 'no-store',
          credentials: 'include'
        })
        
        if (response.ok) {
          const orders = await response.json()
          if (orders && orders.length > 0) {
            // Get the latest order that's not delivered or cancelled
            const activeOrder = orders.find((order: Order) => 
              ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(order.status)
            )
            setLatestOrder(activeOrder || null)
            setIsVisible(!!activeOrder)
          }
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestOrder()
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchLatestOrder, 30000)
    return () => clearInterval(interval)
  }, [user])

  if (isLoading || !user || user.role !== 'USER' || !latestOrder || !isVisible || isDismissed) {
    return null
  }

  const status = statusConfig[latestOrder.status]
  const StatusIcon = status.icon
  const primaryItem = latestOrder.items[0]?.foodItem

  const handleClick = () => {
    // Navigate to order tracking page (you can create this later)
    router.push(`/orders/${latestOrder.id}`)
  }

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 mx-auto max-w-md lg:max-w-lg">
      <div
        className="bg-black border-4 border-lime-400 cursor-pointer overflow-hidden relative"
        style={{ boxShadow: '8px 8px 0px #39FF14' }}
      >
        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsDismissed(true)
          }}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-lime-400 border-2 border-black text-black hover:bg-white transition-colors flex items-center justify-center"
          style={{ boxShadow: '2px 2px 0px #000' }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div 
          onClick={handleClick}
          className="bg-lime-400 border-b-4 border-lime-400 p-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center">
              <StatusIcon className="w-5 h-5 text-lime-400" />
            </div>
            <span className="font-extrabold text-black text-lg">
              [ LIVE ORDER ]
            </span>
          </div>
          <ArrowRight className="w-6 h-6 text-black" />
        </div>

        {/* Content */}
        <div 
          onClick={handleClick}
          className="p-4"
        >
            {/* Item Name */}
            <div className="mb-3">
              <h3 className="text-lime-400 font-extrabold text-xl mb-1">
                {primaryItem?.name || 'Your Order'}
                {latestOrder.items.length > 1 && (
                  <span className="text-sm font-normal"> +{latestOrder.items.length - 1} more</span>
                )}
              </h3>
              <p className="text-gray-300 text-sm font-normal">
                From {latestOrder.restaurant.name}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lime-400 font-bold text-sm">
                  {status.label}
                </span>
                <span className="text-gray-300 text-xs font-normal">
                  {Math.round(status.progress)}%
                </span>
              </div>
              
              {/* Chunky Progress Bar */}
              <div className="w-full h-3 bg-gray-700 border-2 border-gray-600">
                <div
                  className={`h-full ${status.color} border-r-2 border-black`}
                  style={{ 
                    width: `${status.progress}%`,
                    boxShadow: status.progress > 0 ? '2px 0px 0px #000' : 'none'
                  }}
                />
              </div>
              
              {/* Progress Steps */}
              <div className="flex justify-between mt-2 text-xs">
                <span className={latestOrder.status === 'PENDING' ? 'text-lime-400 font-bold' : 'text-gray-500'}>
                  PLACED
                </span>
                <span className={['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(latestOrder.status) ? 'text-lime-400 font-bold' : 'text-gray-500'}>
                  PREPARING
                </span>
                <span className={['OUT_FOR_DELIVERY', 'DELIVERED'].includes(latestOrder.status) ? 'text-lime-400 font-bold' : 'text-gray-500'}>
                  DELIVERY
                </span>
                <span className={latestOrder.status === 'DELIVERED' ? 'text-lime-400 font-bold' : 'text-gray-500'}>
                  DONE
                </span>
              </div>
            </div>

            {/* ETA */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-lime-400" />
                <span className="text-white font-bold">ETA:</span>
              </div>
              <div className="bg-lime-400 border-2 border-black px-3 py-1">
                <span className="text-black font-extrabold text-lg">
                  {status.eta}
                </span>
              </div>
            </div>

            {/* Total Price */}
            <div className="mt-3 pt-3 border-t-2 border-gray-600 flex items-center justify-between">
              <span className="text-gray-300 text-sm">Total Amount:</span>
              <span className="text-lime-400 font-extrabold text-lg">
                ₹{latestOrder.totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

        {/* Tap to Track Hint */}
        <div 
          onClick={handleClick}
          className="bg-gray-800 border-t-2 border-gray-600 p-2 text-center"
        >
          <p className="text-gray-300 text-xs font-normal">
            Tap to track your order
          </p>
        </div>
      </div>
    </div>
  )
}
