"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Minus, ShoppingCart, Menu, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUserStore } from '@/store/useUserStore'
import { Suspense } from 'react'

interface FoodItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  isAvailable: boolean
  createdAt: string
}

interface Restaurant {
  id: string
  name: string
  description: string
  address: string
  imageUrl?: string
  isOpen: boolean
  menuItems: FoodItem[]
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

function RestaurantMenuContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useUserStore()
  const restaurantId = searchParams.get('id')

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<Record<string, CartItem>>({})
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [cartPulse, setCartPulse] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Refs for scroll detection
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Fetch restaurant data with menu items
  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!restaurantId) {
        setError('Restaurant ID is required')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/restaurants/${restaurantId}`)
        if (response.ok) {
          const data = await response.json()
          setRestaurant(data)
        } else {
          throw new Error('Failed to fetch restaurant')
        }
      } catch (error) {
        console.error('Failed to fetch restaurant:', error)
        setError('Failed to load restaurant menu')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRestaurant()
  }, [restaurantId])

  // Cart functions
  const addToCart = (item: FoodItem) => {
    const newCart = {
      ...cart,
      [item.id]: {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: (cart[item.id]?.quantity || 0) + 1
      }
    }
    setCart(newCart)
    
    // Save to localStorage for cart page
    saveCartToStorage(newCart)
    
    // Trigger cart pulse animation
    setCartPulse(true)
    setTimeout(() => setCartPulse(false), 300)
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[itemId]) {
        if (newCart[itemId].quantity > 1) {
          newCart[itemId].quantity -= 1
        } else {
          delete newCart[itemId]
        }
      }
      // Save to localStorage for cart page
      saveCartToStorage(newCart)
      return newCart
    })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => {
        const newCart = { ...prev }
        delete newCart[itemId]
        // Save to localStorage for cart page
        saveCartToStorage(newCart)
        return newCart
      })
    } else {
      setCart(prev => {
        const newCart = {
          ...prev,
          [prev[itemId].id]: { ...prev[itemId], quantity }
        }
        // Save to localStorage for cart page
        saveCartToStorage(newCart)
        return newCart
      })
    }
  }

  // Save cart to localStorage
  const saveCartToStorage = (cartData: Record<string, CartItem>) => {
    const cartItems = Object.values(cartData).map(item => ({
      ...item,
      restaurantId: restaurant?.id || '',
      restaurantName: restaurant?.name || ''
    }))
    localStorage.setItem('reelbites-cart', JSON.stringify(cartItems))
  }

  // Cart calculations
  const cartItems = Object.values(cart)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Group menu items by category based on food type and price
  const groupedItems = restaurant?.menuItems.reduce((groups, item) => {
    let category = 'MAIN COURSE' // Default category
    
    // Dynamic categorization based on food name and price
    const itemName = item.name.toLowerCase()
    const itemDesc = item.description.toLowerCase()
    
    // Check for specific food types first
    if (itemName.includes('pizza') || itemName.includes('Roasted') || itemName.includes('Chicken') ||itemName.includes('croissant') || itemName.includes('Pancakes') || item.price > 400) {
      category = 'APPETIZERS'
    } else if (itemName.includes('burger') || itemName.includes('sandwich') || itemName.includes('wrap') || (item.price >= 150 && item.price <= 400)) {
      category = 'BURGERS & MAINS'
    } else if (itemName.includes('fries') || itemName.includes('starter') || itemName.includes('appetizer') || itemName.includes('wing') || (item.price >= 80 && item.price < 150)) {
      category = 'STARTERS & SIDES'
    } else if (itemName.includes('dessert') || itemName.includes('ice cream') || itemName.includes('cake') || itemName.includes('sweet') || item.price < 80) {
      category = 'DESSERTS & BEVERAGES'
    } else if (itemName.includes('egg') || itemName.includes('omelet')) {
      category = 'EGG SPECIALS'
    }
    
    if (!groups[category]) groups[category] = []
    groups[category].push(item)
    return groups
  }, {} as Record<string, FoodItem[]>) || {}

  const categories = Object.keys(groupedItems)
  
  // Debug logging
  console.log('Restaurant menuItems:', restaurant?.menuItems)
  console.log('GroupedItems:', groupedItems)
  console.log('Categories:', categories)

  // Scroll detection for active category
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return

      const scrollTop = scrollContainerRef.current.scrollTop
      const containerHeight = scrollContainerRef.current.clientHeight

      for (const category of categories) {
        const element = categoryRefs.current[category]
        if (element) {
          const rect = element.getBoundingClientRect()
          const containerRect = scrollContainerRef.current!.getBoundingClientRect()
          
          // Check if category section is in view
          if (rect.top <= containerRect.top + 100 && rect.bottom >= containerRect.top + 100) {
            setActiveCategory(category)
            break
          }
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      handleScroll() // Set initial active category
      
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [categories])

  // Scroll to category
  const scrollToCategory = (category: string) => {
    const element = categoryRefs.current[category]
    const container = scrollContainerRef.current
    
    if (element && container) {
      const elementTop = element.offsetTop
      container.scrollTo({
        top: elementTop - 20,
        behavior: 'smooth'
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="font-extrabold text-2xl text-black mb-2">LOADING MENU...</div>
          <div className="text-black">Please wait while we fetch the menu</div>
        </div>
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="font-extrabold text-2xl text-black mb-2">ERROR</div>
          <div className="text-black mb-4">{error || 'Restaurant not found'}</div>
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

      {/* Left Panel - The Index */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-black border-r-2 border-black z-40 flex flex-col transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header with Back Button */}
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
            <h1 className="text-2xl font-extrabold text-lime-400">
              {restaurant.name.toUpperCase()}
            </h1>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-800 rounded transition-colors"
            >
              <X className="w-5 h-5 text-lime-400" />
            </button>
          </div>
          <div className="text-lime-400 text-sm">
            ⭐ 4.2 • {restaurant.description}
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex-1 p-6">
          <div className="text-lime-400 font-bold text-sm mb-4">[ MENU CATEGORIES ]</div>
          <div className="space-y-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => scrollToCategory(category)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`block w-full text-left py-3 px-4 font-extrabold text-lg transition-all ${
                  activeCategory === category
                    ? 'text-black bg-lime-400 border-2 border-lime-400'
                    : 'text-lime-400 border-2 border-transparent hover:border-lime-400'
                }`}
                style={{ 
                  boxShadow: activeCategory === category ? '2px 2px 0px #39FF14' : 'none' 
                }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="p-6 border-t-2 border-lime-400">
          <div className="text-lime-400 text-xs">
            📍 {restaurant.address}
          </div>
        </div>
      </div>

      {/* Right Panel - The Content */}
      <div className="flex-1 lg:ml-80">
        <div 
          ref={scrollContainerRef}
          className="h-screen overflow-y-auto bg-gray-100 pt-16 lg:pt-0"
        >
          {categories.map((category) => (
            <div key={category} className="relative">
              {/* Giant Background Header */}
              <div className="absolute top-8 left-0 right-0 z-10 pointer-events-none overflow-hidden">
                <h2 className="text-[8rem] lg:text-[10rem] font-extrabold text-black opacity-5 leading-none select-none whitespace-nowrap px-8">
                  {category}
                </h2>
              </div>

              {/* Category Section */}
              <div 
                ref={(el) => { categoryRefs.current[category] = el }}
                className="relative z-20 p-8 min-h-screen"
              >
                <div className="mb-8">
                  <h3 className="text-3xl font-extrabold text-black mb-2">
                    {category}
                  </h3>
                  <div className="w-20 h-1 bg-lime-400"></div>
                </div>

                {/* Menu Items */}
                <div className="space-y-6 max-w-2xl">
                  {groupedItems[category]?.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      cartQuantity={cart[item.id]?.quantity || 0}
                      onAdd={() => addToCart(item)}
                      onRemove={() => removeFromCart(item.id)}
                      onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart Block */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: cartPulse ? [1, 1.2, 1] : 1, 
              rotate: 0,
              x: cartPulse ? [0, -4, 4, 0] : 0
            }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              scale: { duration: 0.3 },
              x: { duration: 0.3 }
            }}
            whileHover={{ scale: 1.05, x: -2, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/order-food/cart')}
            className="fixed bottom-6 right-6 bg-black border-2 border-black p-6 cursor-pointer z-50"
            style={{ boxShadow: '4px 4px 0px #39FF14' }}
          >
            <div className="text-lime-400 font-bold text-center">
              <div className="text-xs mb-1">[ CART ]</div>
              <div className="text-lg">
                {totalItems} ITEM{totalItems > 1 ? 'S' : ''}
              </div>
              <div className="text-2xl font-extrabold">
                ₹{totalPrice.toLocaleString('en-IN')}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface MenuItemCardProps {
  item: FoodItem
  cartQuantity: number
  onAdd: () => void
  onRemove: () => void
  onUpdateQuantity: (quantity: number) => void
}

function MenuItemCard({ item, cartQuantity, onAdd, onRemove, onUpdateQuantity }: MenuItemCardProps) {
  // Determine if item is veg (simplified logic - could be based on a field in the schema)
  const isVeg = Math.random() > 0.5 // This should come from your data
  const [isJolting, setIsJolting] = useState(false)

  const handleAdd = () => {
    // Trigger jolt animation
    setIsJolting(true)
    setTimeout(() => setIsJolting(false), 200)
    onAdd()
  }

  return (
    <motion.div
      animate={isJolting ? { x: [-2, 2, -1, 1, 0], y: [-1, 1, -1, 0] } : {}}
      transition={{ duration: 0.2 }}
      whileHover={{ x: -3, y: -3 }}
      className="bg-white border-2 border-black p-6 transition-all hover:shadow-[6px_6px_0px_#000]"
      style={{ boxShadow: '3px 3px 0px #000' }}
    >
      <div className="flex items-start justify-between">
        {/* Left Side - Item Info */}
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-3 mb-3">
            {/* Veg/Non-veg indicator */}
            <div className={`w-5 h-5 ${isVeg ? 'bg-green-500' : 'bg-red-500'} border-2 border-black`}></div>
            <h3 className="text-xl font-extrabold text-black">{item.name}</h3>
          </div>
          
          <p className="text-black font-normal text-sm mb-4 leading-relaxed">
            {item.description}
          </p>
          
          <div className="text-2xl font-extrabold text-black">
            ₹{item.price.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Right Side - Add Button / Quantity Selector */}
        <div className="flex-shrink-0">
          <AnimatePresence mode="wait">
            {cartQuantity === 0 ? (
              <motion.button
                key="add-button"
                initial={{ rotateY: 0 }}
                exit={{ rotateY: 90 }}
                onClick={handleAdd}
                whileHover={{ x: 3, y: 3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-lime-400 border-2 border-black text-black font-extrabold text-sm hover:bg-white transition-all"
                style={{ boxShadow: '3px 3px 0px #000' }}
              >
                [ ADD ]
              </motion.button>
            ) : (
              <motion.div
                key="quantity-selector"
                initial={{ rotateY: -90 }}
                animate={{ rotateY: 0 }}
                className="flex items-center gap-2"
              >
                <motion.button
                  onClick={onRemove}
                  whileHover={{ scale: 1.1, x: -1, y: -1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-white border-2 border-black text-black font-extrabold flex items-center justify-center hover:bg-lime-400 transition-colors"
                  style={{ boxShadow: '2px 2px 0px #000' }}
                >
                  <Minus className="w-5 h-5" />
                </motion.button>
                
                <div className="w-16 h-12 bg-black border-2 border-black text-lime-400 font-extrabold text-lg flex items-center justify-center">
                  {cartQuantity}
                </div>
                
                <motion.button
                  onClick={handleAdd}
                  whileHover={{ scale: 1.1, x: 1, y: -1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-lime-400 border-2 border-black text-black font-extrabold flex items-center justify-center hover:bg-white transition-colors"
                  style={{ boxShadow: '2px 2px 0px #000' }}
                >
                  <Plus className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default function RestaurantMenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="font-extrabold text-2xl text-black mb-2">LOADING MENU...</div>
          <div className="text-black">Please wait while we fetch the menu</div>
        </div>
      </div>
    }>
      <RestaurantMenuContent />
    </Suspense>
  )
}
