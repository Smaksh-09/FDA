"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, CreditCard, Check, Plus, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/useUserStore'
import PaymentModal from '../components/PaymentModal'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  restaurantId: string
  restaurantName: string
}

interface Address {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export default function CartPage() {
  const router = useRouter()
  const { user } = useUserStore()
  
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Load cart from localStorage and fetch addresses
  useEffect(() => {
    // Load cart data from localStorage (assuming it's stored from menu page)
    const savedCart = localStorage.getItem('reelbites-cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCartItems(parsedCart)
      } catch (error) {
        console.error('Failed to parse cart data:', error)
      }
    }

    // Fetch user addresses
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/addresses', {
        headers: {
          'x-user-id': user.id,
          'x-user-role': user.role,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAddresses(data.addresses || [])
        
        // Auto-select default address
        const defaultAddress = data.addresses?.find((addr: Address) => addr.isDefault)
        if (defaultAddress) {
          setSelectedAddress(defaultAddress)
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate totals
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Check if order can be placed
  const canPlaceOrder = cartItems.length > 0 && selectedAddress && !isPlacingOrder

  // Handle order placement - Show payment modal first
  const handlePlaceOrder = async () => {
    if (!canPlaceOrder || !user) return
    // Just show the payment modal - actual order creation happens in payment completion
    setShowPaymentModal(true)
  }

  // Handle payment completion - Create orders with integrated payment
  const handlePaymentComplete = async () => {
    if (!user) return

    setIsPlacingOrder(true)

    try {
      // Group items by restaurant (in case there are multiple restaurants)
      const restaurantGroups = cartItems.reduce((groups, item) => {
        if (!groups[item.restaurantId]) {
          groups[item.restaurantId] = []
        }
        groups[item.restaurantId].push(item)
        return groups
      }, {} as Record<string, CartItem[]>)

      const results = []

      // Create orders with integrated payments for each restaurant
      for (const [restaurantId, items] of Object.entries(restaurantGroups)) {
        const orderData = {
          restaurantId,
          items: items.map(item => ({
            foodItemId: item.id,
            quantity: item.quantity,
            priceAtTimeOfOrder: item.price
          })),
          totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        }

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user.id,
            'x-user-role': user.role,
          },
          body: JSON.stringify(orderData)
        })

        if (!response.ok) {
          throw new Error('Failed to create order')
        }

        const result = await response.json()
        results.push(result)
      }

      // Clear cart and show success
      localStorage.removeItem('reelbites-cart')
      setOrderComplete(true)
      
      // Redirect after delay
      setTimeout(() => {
        router.push('/order-food')
      }, 3000)

    } catch (error) {
      console.error('Failed to place order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="font-extrabold text-2xl text-black mb-2">LOADING CART...</div>
          <div className="text-black">Please wait while we fetch your cart</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="font-extrabold text-2xl text-black mb-2">LOGIN REQUIRED</div>
          <div className="text-black mb-4">Please login to view your cart</div>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-3 bg-lime-400 border-2 border-black text-black font-bold hover:translate-x-1 hover:translate-y-1 transition-all"
            style={{ boxShadow: '2px 2px 0px #000' }}
          >
            [ LOGIN ]
          </button>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="font-extrabold text-2xl text-black mb-2">CART EMPTY</div>
          <div className="text-black mb-4">Your cart is empty. Add some items first!</div>
          <button
            onClick={() => router.push('/order-food')}
            className="px-6 py-3 bg-lime-400 border-2 border-black text-black font-bold hover:translate-x-1 hover:translate-y-1 transition-all"
            style={{ boxShadow: '2px 2px 0px #000' }}
          >
            [ BROWSE RESTAURANTS ]
          </button>
        </div>
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="text-center bg-white border-2 border-black p-8"
          style={{ boxShadow: '8px 8px 0px #000' }}
        >
          <div className="text-6xl mb-4">✅</div>
          <div className="font-extrabold text-3xl text-black mb-2">ORDER CONFIRMED!</div>
          <div className="text-black mb-4">Your order has been placed successfully</div>
          <div className="text-sm text-black">Redirecting you back to restaurants...</div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 bg-lime-400 border-2 border-black"
        style={{ boxShadow: '2px 2px 0px #000' }}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5 text-black" /> : <Menu className="w-5 h-5 text-black" />}
      </button>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Panel - Mission Checklist */}
      <div className={`fixed left-0 top-0 h-full w-96 bg-black border-r-2 border-black z-40 flex flex-col transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header */}
        <div className="p-6 border-b-2 border-lime-400">
          <motion.button
            onClick={() => router.back()}
            whileHover={{ x: -2, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 bg-lime-400 border-2 border-lime-400 hover:bg-white hover:text-black transition-colors mb-4"
            style={{ boxShadow: '2px 2px 0px #39FF14' }}
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </motion.button>
          
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-extrabold text-lime-400">
              MISSION CHECKLIST
            </h1>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded transition-colors"
            >
              <X className="w-5 h-5 text-lime-400" />
            </button>
          </div>
          <div className="text-lime-400 text-sm">
            Final confirmation terminal
          </div>
        </div>

        {/* Mission Checklist Blocks */}
        <div className="flex-1 p-6 space-y-6">
          {/* Order Summary Block */}
          <div className="bg-white border-2 border-black p-4" style={{ boxShadow: '3px 3px 0px #000' }}>
            <div className="text-black font-extrabold text-sm mb-3 border-b-2 border-black pb-2">
              [ ORDER SUMMARY ]
            </div>
            <div className="text-black font-bold text-lg mb-2">
              {totalItems} ITEM{totalItems > 1 ? 'S' : ''} | ₹{totalPrice.toLocaleString('en-IN')}
            </div>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="text-xs text-black flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Block */}
          <div className="bg-white border-2 border-black p-4" style={{ boxShadow: '3px 3px 0px #000' }}>
            <div className="text-black font-extrabold text-sm mb-3 border-b-2 border-black pb-2">
              [ DELIVERY TO ]
            </div>
            {selectedAddress ? (
              <div className="text-black">
                <div className="font-bold">{user.name.toUpperCase()}</div>
                <div className="text-sm">
                  {selectedAddress.street}, {selectedAddress.city}
                </div>
                <div className="text-sm">
                  {selectedAddress.state} {selectedAddress.zipCode}
                </div>
                {addresses.length > 1 && (
                  <button
                    onClick={() => {
                      // Cycle through addresses for demo
                      const currentIndex = addresses.findIndex(addr => addr.id === selectedAddress.id)
                      const nextIndex = (currentIndex + 1) % addresses.length
                      setSelectedAddress(addresses[nextIndex])
                    }}
                    className="mt-2 text-xs bg-lime-400 border border-black px-2 py-1 hover:bg-white transition-colors"
                  >
                    [ CHANGE ADDRESS ]
                  </button>
                )}
              </div>
            ) : (
              <div className="text-black">
                <div className="text-red-600 font-bold mb-2">NO ADDRESS SELECTED</div>
                <button
                  onClick={() => router.push('/profile/addresses')}
                  className="text-xs bg-lime-400 border border-black px-2 py-1 hover:bg-white transition-colors"
                >
                  [ ADD ADDRESS ]
                </button>
              </div>
            )}
          </div>

          {/* Payment Block */}
          <div className="bg-white border-2 border-black p-4" style={{ boxShadow: '3px 3px 0px #000' }}>
            <div className="text-black font-extrabold text-sm mb-3 border-b-2 border-black pb-2">
              [ PAYMENT ]
            </div>
            <div className="text-black">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4" />
                <span className="font-bold">MOCK PAYMENT</span>
              </div>
              <div className="text-xs text-black">
                Payment integration coming soon
              </div>
            </div>
          </div>
        </div>

        {/* Execute Button */}
        <div className="p-6 border-t-2 border-lime-400">
          <motion.button
            onClick={handlePlaceOrder}
            disabled={!canPlaceOrder}
            whileHover={canPlaceOrder ? { x: 3, y: 3, scale: 1.02 } : {}}
            whileTap={canPlaceOrder ? { scale: 0.98 } : {}}
            className={`w-full py-4 font-extrabold text-lg border-2 transition-all ${
              canPlaceOrder
                ? 'bg-lime-400 text-black border-black hover:bg-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed'
            }`}
            style={{ 
              boxShadow: canPlaceOrder ? '4px 4px 0px #000' : '2px 2px 0px #999' 
            }}
          >
            {isPlacingOrder ? '[ PROCESSING... ]' : '[ FINALIZE & PAY ]'}
          </motion.button>
        </div>
      </div>

      {/* Right Panel - Cart Items Details */}
      <div className="flex-1 lg:ml-96">
        <div className="h-screen overflow-y-auto bg-gray-100 p-4 lg:p-8 pt-16 lg:pt-8">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-black mb-2">
              CART DETAILS
            </h2>
            <div className="w-32 h-1 bg-lime-400"></div>
          </div>

          {/* Cart Items */}
          <div className="space-y-6 max-w-3xl">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ x: -3, y: -3 }}
                className="bg-white border-2 border-black p-6 transition-all hover:shadow-[6px_6px_0px_#000]"
                style={{ boxShadow: '3px 3px 0px #000' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-extrabold text-black mb-1">
                      {item.name}
                    </h3>
                    <div className="text-sm text-black font-normal mb-2">
                      From: {item.restaurantName}
                    </div>
                    <div className="text-2xl font-extrabold text-black">
                      ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-black">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-black">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Total Summary */}
            <div className="bg-black border-2 border-black p-6 text-lime-400" 
                 style={{ boxShadow: '4px 4px 0px #39FF14' }}>
              <div className="flex justify-between items-center">
                <div className="text-xl font-extrabold">
                  TOTAL ({totalItems} ITEMS)
                </div>
                <div className="text-3xl font-extrabold">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalAmount={totalPrice}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  )
}
