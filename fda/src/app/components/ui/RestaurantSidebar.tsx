"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/useUserStore'
import Link from 'next/link'
import { 
  Home, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  Menu as MenuIcon, 
  Users, 
  Clock,
  DollarSign,
  LogOut,
  Bell,
  Video
} from 'lucide-react'
import { Restaurant } from '../../restaurant/types'

interface RestaurantSidebarProps {
  restaurant: Restaurant
  currentPage?: string
}

export default function RestaurantSidebar({ restaurant, currentPage = 'dashboard' }: RestaurantSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const { logout } = useUserStore()

  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: Home,
      href: '/restaurant',
      badge: null
    },
    {
      id: 'orders',
      name: 'Orders',
      icon: ShoppingBag,
      href: '/restaurant/orders',
    },
    {
      id: 'menu',
      name: 'Menu Items',
      icon: MenuIcon,
      href: '/restaurant/menu',
      badge: null
    },
    {
      id: 'reels',
      name: 'Reels',
      icon: Video,
      href: '/restaurant/reels',
      badge: null
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      href: '/restaurant/analytics',
      badge: null
    },
    {
      id: 'payments',
      name: 'Payments',
      icon: DollarSign,
      href: '/restaurant/payments',
      badge: null
    },
  ]

  return (
    <div className={`h-screen bg-white border-r-2 border-black flex flex-col transition-all duration-200 ${
      isCollapsed ? 'w-20' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-6 border-b-2 border-black">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-black font-black text-xl mb-1">
                {restaurant.name}
              </h1>
              <p className="text-gray-600 font-normal text-sm truncate">
                Restaurant Dashboard
              </p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 bg-white border-2 border-black text-black hover:bg-gray-50 transition-colors"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Restaurant Status */}
      {!isCollapsed && (
        <div className="p-4 border-b-2 border-black bg-[#F5F5F5]">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 ${restaurant.isOpen ? 'bg-[#39FF14]' : 'bg-red-500'} border border-black`}></div>
            <span className="font-bold text-black text-sm">
              {restaurant.isOpen ? 'OPEN' : 'CLOSED'}
            </span>
            <button className="ml-auto text-xs font-bold text-black hover:text-[#39FF14] transition-colors">
              TOGGLE
            </button>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group flex items-center gap-3 p-3 border-2 transition-all font-bold ${
                  isActive
                    ? 'bg-[#39FF14] border-black text-black neobrutalist-shadow'
                    : 'bg-white border-black text-black hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    
                  </>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Notifications (if not collapsed) */}
      {!isCollapsed && (
        <div className="p-4 border-t-2 border-black">
          <div className="bg-black p-3 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-[#39FF14]" />
              <span className="font-bold text-sm text-[#39FF14]">ALERTS</span>
            </div>
            <p className="text-xs font-normal">
              Order #ORD-001 pending for 5 minutes
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t-2 border-black">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="text-xs text-gray-600 font-normal">
              <p>{restaurant.phone}</p>
              <p>{restaurant.email}</p>
            </div>
            <button
              onClick={async () => {
                await logout()
                router.push('/')
              }}
              className="w-full flex items-center gap-2 p-2 bg-white border-2 border-black text-black font-bold hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={async () => {
              await logout()
              router.push('/')
            }}
            className="w-full p-2 bg-white border-2 border-black text-black font-bold hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mx-auto" />
          </button>
        )}
      </div>
    </div>
  )
}
