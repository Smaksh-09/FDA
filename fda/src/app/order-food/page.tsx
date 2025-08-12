"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, ShoppingCart, Star, Clock, Percent, Menu, X } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'
import { useRouter } from 'next/navigation'

interface Restaurant {
  id: string
  name: string
  description: string
  address: string
  imageUrl?: string
  isOpen: boolean
  createdAt: string
  _count: {
    menuItems: number
  }
}

interface FilterState {
  search: string
  pureVeg: boolean
  highRating: boolean
  offers: boolean
}

export default function OrderFoodPage() {
  const { user } = useUserStore()
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    pureVeg: false,
    highRating: false,
    offers: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  const [isFilteringAnimation, setIsFilteringAnimation] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Default closed on mobile

  // Fetch restaurants data
  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants')
      if (response.ok) {
        const data = await response.json()
        setRestaurants(data)
        setFilteredRestaurants(data)
      }
    } catch (error) {
      console.error('Failed to fetch restaurants:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load cart count from localStorage
  const loadCartCount = () => {
    try {
      const savedCart = localStorage.getItem('reelbites-cart')
      if (savedCart) {
        const cartItems = JSON.parse(savedCart)
        const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
        setCartCount(totalItems)
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    }
  }

  useEffect(() => {
    fetchRestaurants()
    loadCartCount()
    
    // Listen for cart updates
    const handleStorageChange = () => {
      loadCartCount()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Filter logic
  useEffect(() => {
    let filtered = [...restaurants]

    if (filters.search) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Trigger glitch animation when filtering
    if (JSON.stringify(filteredRestaurants) !== JSON.stringify(filtered)) {
      setIsFilteringAnimation(true)
      setTimeout(() => {
        setFilteredRestaurants(filtered)
        setIsFilteringAnimation(false)
      }, 150) // Glitch duration
    } else {
      setFilteredRestaurants(filtered)
    }
  }, [filters, restaurants])

  const toggleFilter = (filterName: keyof Omit<FilterState, 'search'>) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }

  const getRestaurantInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  const getRandomETA = () => {
    return `${Math.floor(Math.random() * 20) + 20}-${Math.floor(Math.random() * 20) + 30} MIN`
  }

  const getRandomRating = () => {
    return (3.5 + Math.random() * 1.5).toFixed(1)
  }

  const hasOffer = () => {
    return Math.random() > 0.6 // 40% chance of having an offer
  }

  const handleRestaurantClick = (restaurantId: string) => {
    router.push(`/order-food/menu?id=${restaurantId}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-3 bg-lime-400 border-2 border-black"
        style={{ boxShadow: '2px 2px 0px #000' }}
      >
        {isSidebarOpen ? <X className="w-5 h-5 text-black" /> : <Menu className="w-5 h-5 text-black" />}
      </button>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Fixed Filter Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-lime-400 border-r-2 border-black z-40 overflow-y-auto transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6">
          {/* Sidebar Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-extrabold text-black">
                FILTER & SEARCH
              </h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-black hover:text-lime-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full h-1 bg-black"></div>
          </div>

          {/* Cart Button */}
          <div className="mb-8">
            <motion.div
              whileHover={{ x: 2, y: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (cartCount > 0) {
                  router.push('/order-food/cart')
                }
              }}
              className={`w-full p-4 border-2 border-black flex items-center justify-between transition-all ${
                cartCount > 0 
                  ? 'bg-black cursor-pointer hover:bg-gray-800' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
              style={{ boxShadow: '4px 4px 0px #000' }}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className={`w-6 h-6 ${cartCount > 0 ? 'text-lime-400' : 'text-gray-500'}`} />
                <span className={`font-bold ${cartCount > 0 ? 'text-lime-400' : 'text-gray-500'}`}>
                  {cartCount > 0 ? 'VIEW CART' : 'YOUR CART'}
                </span>
              </div>
              {cartCount > 0 && (
                <div className="w-8 h-8 bg-lime-400 border-2 border-lime-400 flex items-center justify-center">
                  <span className="text-sm font-bold text-black">{cartCount}</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <label className="block text-black font-bold mb-3 text-sm">
              [ SEARCH RESTAURANTS ]
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="TYPE HERE..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full p-4 border-2 border-black text-black font-bold bg-white focus:outline-none focus:border-black transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="space-y-4">
            <div className="text-black font-bold mb-3 text-sm">
              [ QUICK FILTERS ]
            </div>
            {[
              { key: 'pureVeg' as const, label: 'PURE VEG', icon: '🌱' },
              { key: 'highRating' as const, label: 'RATINGS 4.0+', icon: '⭐' },
              { key: 'offers' as const, label: 'OFFERS', icon: '🏷️' }
            ].map((filter) => (
              <motion.button
                key={filter.key}
                onClick={() => toggleFilter(filter.key)}
                whileHover={{ x: 2, y: 2 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full p-4 border-2 border-black font-bold text-sm text-left transition-all ${
                  filters[filter.key] 
                    ? 'bg-black text-lime-400' 
                    : 'bg-white text-black hover:bg-black hover:text-lime-400'
                }`}
                style={{ boxShadow: '2px 2px 0px #000' }}
              >
                <span className="mr-3">{filter.icon}</span>
                {filter.label}
              </motion.button>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-8 p-4 bg-black border-2 border-black">
            <div className="text-lime-400 font-bold text-sm mb-2">
              [ RESULTS ]
            </div>
            <div className="text-lime-400 font-extrabold text-2xl">
              {filteredRestaurants.length}
            </div>
            <div className="text-lime-400 font-bold text-xs">
              RESTAURANTS FOUND
            </div>
          </div>
        </div>
      </div>

      {/* Scrolling Marquee */}
      <div className="fixed top-0 left-0 lg:left-80 right-0 h-12 bg-black border-b-2 border-black z-20 overflow-hidden">
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="flex items-center h-full whitespace-nowrap"
        >
          <span className="text-white font-bold text-lg px-8">
            • ORDER NOW • EAT GOOD • REPEAT • FRESHLY MADE • DELIVERED FAST • TASTE THE DIFFERENCE • ORDER NOW • EAT GOOD • REPEAT • FRESHLY MADE • DELIVERED FAST • TASTE THE DIFFERENCE • ORDER NOW • EAT GOOD • REPEAT • FRESHLY MADE • DELIVERED FAST •
          </span>
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-80 mt-12 relative min-h-screen">
        {/* Massive Background Title */}
        <div className="absolute top-8 left-0 right-0 z-10 pointer-events-none overflow-hidden">
          <h1 className="text-[8rem] lg:text-[10rem] xl:text-[12rem] font-extrabold text-black opacity-5 leading-none select-none whitespace-nowrap">
            RESTAURANTS
          </h1>
        </div>

        {/* Restaurant Grid Container */}
        <div className="relative z-20 p-4 lg:p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-black mb-2">
              DAHMI KALAN
            </h2>
            <div className="text-black font-normal">
              Choose from {restaurants.length} restaurants in your area
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="font-extrabold text-2xl text-black mb-2">LOADING RESTAURANTS...</div>
                <div className="text-black">Finding the best food near you</div>
              </div>
            </div>
          ) : (
            <RestaurantGrid 
              restaurants={filteredRestaurants} 
              isFilteringAnimation={isFilteringAnimation}
              getRestaurantInitials={getRestaurantInitials}
              getRandomETA={getRandomETA}
              getRandomRating={getRandomRating}
              hasOffer={hasOffer}
              onRestaurantClick={handleRestaurantClick}
            />
          )}
        </div>
      </div>
    </div>
  )
}

interface RestaurantGridProps {
  restaurants: Restaurant[]
  isFilteringAnimation: boolean
  getRestaurantInitials: (name: string) => string
  getRandomETA: () => string
  getRandomRating: () => string
  hasOffer: () => boolean
  onRestaurantClick: (restaurantId: string) => void
}

function RestaurantGrid({ 
  restaurants, 
  isFilteringAnimation,
  getRestaurantInitials,
  getRandomETA,
  getRandomRating,
  hasOffer,
  onRestaurantClick
}: RestaurantGridProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -200px 0px" })

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {restaurants.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <div className="p-8 bg-white border-2 border-black" style={{ boxShadow: '4px 4px 0px #000' }}>
            <div className="font-extrabold text-2xl text-black mb-2">NO RESTAURANTS FOUND</div>
            <div className="text-black">Try adjusting your search or filters</div>
          </div>
        </div>
      ) : (
        restaurants.map((restaurant, index) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            index={index}
            isInView={isInView}
            isFilteringAnimation={isFilteringAnimation}
            getRestaurantInitials={getRestaurantInitials}
            getRandomETA={getRandomETA}
            getRandomRating={getRandomRating}
            hasOffer={hasOffer}
            onRestaurantClick={onRestaurantClick}
          />
        ))
      )}
    </div>
  )
}

interface RestaurantCardProps {
  restaurant: Restaurant
  index: number
  isInView: boolean
  isFilteringAnimation: boolean
  getRestaurantInitials: (name: string) => string
  getRandomETA: () => string
  getRandomRating: () => string
  hasOffer: () => boolean
  onRestaurantClick: (restaurantId: string) => void
}

function RestaurantCard({ 
  restaurant, 
  index, 
  isInView, 
  isFilteringAnimation,
  getRestaurantInitials,
  getRandomETA,
  getRandomRating,
  hasOffer,
  onRestaurantClick
}: RestaurantCardProps) {
  const [showOffer] = useState(hasOffer())
  const [eta] = useState(getRandomETA())
  const [rating] = useState(getRandomRating())

  // Grid Assembly Animation
  const gridAssemblyVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      x: -20,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        delay: index * 0.1, // Staggered appearance
        duration: 0.4,
        type: "spring" as const,
        stiffness: 300,
        damping: 20
      }
    }
  }

  // Glitch Animation for filtering
  const glitchVariants = {
    normal: { 
      filter: "none",
      backgroundColor: "#FFFFFF"
    },
    glitch: {
      filter: ["invert(1)", "invert(0)", "invert(1)", "invert(0)"],
      backgroundColor: ["#39FF14", "#FFFFFF", "#39FF14", "#FFFFFF"],
      transition: {
        duration: 0.15,
        ease: "easeInOut" as const
      }
    }
  }

  return (
    <motion.div
      variants={gridAssemblyVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative cursor-pointer"
    >
      <motion.div
        variants={glitchVariants}
        animate={isFilteringAnimation ? "glitch" : "normal"}
        whileHover={{
          x: -3,
          y: -3,
          transition: { duration: 0.1 }
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onRestaurantClick(restaurant.id)}
        className="bg-white border-2 border-black overflow-hidden group"
        style={{ 
          boxShadow: '4px 4px 0px #000',
          transition: 'box-shadow 0.1s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '8px 8px 0px #000'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '4px 4px 0px #000'
        }}
      >
        {/* Image or Initials */}
        <div className="h-48 relative overflow-hidden">
          {restaurant.imageUrl ? (
            <img 
              src={restaurant.imageUrl} 
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-lime-400 flex items-center justify-center">
              <span className="text-6xl font-extrabold text-black">
                {getRestaurantInitials(restaurant.name)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Restaurant Name */}
          <h3 className="text-xl font-extrabold text-black mb-2 truncate">
            {restaurant.name.toUpperCase()}
          </h3>

          {/* Cuisine & ETA */}
          <p className="text-sm text-black font-normal mb-2 truncate">
            {restaurant.description.toUpperCase()} • {eta}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-black fill-current" />
            <span className="font-bold text-black">{rating}</span>
          </div>

          {/* Menu Items Count */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-black" />
            <span className="text-sm font-bold text-black">
              {restaurant._count.menuItems} ITEMS AVAILABLE
            </span>
          </div>
        </div>

        {/* Offer Banner */}
        {showOffer && (
          <div className="absolute bottom-0 left-0 right-0 bg-lime-400 border-t-2 border-black p-2">
            <div className="flex items-center justify-center gap-2">
              <Percent className="w-4 h-4 text-black" />
              <span className="font-bold text-black text-sm">
                {Math.floor(Math.random() * 30) + 20}% OFF
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
