"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronDown, User, LogOut, Building2, Play, ShoppingBag } from 'lucide-react'
import { useUserStore } from '@/store/useUserStore'

export default function Navbar() {
  const { user, isLoading, setUser, setLoading, logout } = useUserStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  // Check if user is logged in by checking for auth token or making API call
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if there's an auth token in cookies
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include'
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    // Only check auth status if we're still loading and don't have user data
    if (isLoading && !user) {
      checkAuthStatus()
    }
  }, [isLoading, user, setUser, setLoading])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu && !(event.target as Element).closest('.relative')) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUserMenu])

  return (
    <nav className="w-full bg-black border-t-4 border-[#39FF14] fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - positioned close to top border */}
          <div className="flex-shrink-0 mt-1">
            <Link href="/" className="font-bold text-white text-xl sm:text-2xl font-inter hover:text-[#39FF14] transition-colors">
              ReelBites
            </Link>
          </div>

          {/* Right side - Conditional rendering */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              // Loading state
              <div className="w-20 h-8 bg-gray-700 border-2 border-gray-600 animate-pulse"></div>
            ) : user ? (
              // Logged in state
              <>
                {/* Action Buttons for logged-in users */}
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    href="/reelBytes"
                    className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-white text-black font-bold text-sm hover:bg-gray-100 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Watch Reels
                  </Link>
                  <Link
                    href="/order-food"
                    className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-white text-black font-bold text-sm hover:bg-gray-100 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Order Food
                  </Link>
                  {/* Show Become a Partner button only for regular users */}
                  {user.role === 'USER' && (
                    <Link
                      href="/onboarding"
                      className="flex items-center gap-2 px-3 py-2 bg-[#39FF14] border-2 border-black text-black font-bold text-sm hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-0 active:translate-y-0 transition-all duration-100"
                    >
                      <Building2 className="w-4 h-4" />
                      Become a Partner
                    </Link>
                  )}
                  {/* Show Dashboard button for restaurant owners */}
                  {user.role === 'RESTAURANT_OWNER' && (
                    <Link
                      href="/restaurant"
                      className="flex items-center gap-2 px-3 py-2 bg-[#39FF14] border-2 border-black text-black font-bold text-sm hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-0 active:translate-y-0 transition-all duration-100"
                    >
                      <Building2 className="w-4 h-4" />
                      Dashboard
                    </Link>
                  )}
                </div>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-white font-bold text-sm sm:text-base hover:text-[#39FF14] transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black shadow-[4px_4px_0px_#000]">
                      <div className="py-2">
                        {/* Mobile action buttons */}
                        <div className="md:hidden border-b-2 border-gray-200 pb-2 mb-2">
                          <Link
                            href="/reelBytes"
                            className="flex items-center gap-2 px-4 py-2 text-black font-bold hover:bg-[#39FF14] transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Play className="w-4 h-4" />
                            Watch Reels
                          </Link>
                          <Link
                            href="/#order-section"
                            className="flex items-center gap-2 px-4 py-2 text-black font-bold hover:bg-[#39FF14] transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Order Food
                          </Link>
                          {user.role === 'USER' && (
                            <Link
                              href="/onboarding"
                              className="flex items-center gap-2 px-4 py-2 text-black font-bold hover:bg-[#39FF14] transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Building2 className="w-4 h-4" />
                              Become a Partner
                            </Link>
                          )}
                          {user.role === 'RESTAURANT_OWNER' && (
                            <Link
                              href="/restaurant"
                              className="flex items-center gap-2 px-4 py-2 text-black font-bold hover:bg-[#39FF14] transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Building2 className="w-4 h-4" />
                              Dashboard
                            </Link>
                          )}
                        </div>
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-black font-bold hover:bg-[#39FF14] transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4 inline mr-2" />
                          Your Account
                        </Link>
                      <button
                        onClick={async () => {
                          await logout()
                          setShowUserMenu(false)
                          router.push('/')
                        }}
                        className="w-full text-left px-4 py-2 text-black font-bold hover:bg-red-100 transition-colors"
                      >
                          <LogOut className="w-4 h-4 inline mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Not logged in state - Sign Up button
              <Link 
                href="/auth/register"
                className="bg-[#39FF14] text-black border-2 border-black px-4 py-2 font-bold text-sm sm:text-base hover:shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] active:shadow-none active:translate-x-0 active:translate-y-0 transition-all duration-100"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
