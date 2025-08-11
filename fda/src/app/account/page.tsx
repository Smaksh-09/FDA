"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Home, Building2, Star, TrendingUp, Users } from 'lucide-react'
import TabNavigation from '../components/ui/TabNavigation'
import ProfileTab from '../components/ui/ProfileTab'
import OrderHistoryTab from '../components/ui/OrderHistoryTab'
import AddressesTab from '../components/ui/AddressesTab'
import { TabType, UserProfile, SavedAddress, OrderHistoryItem } from './types'
import { useUserStore } from '@/store/useUserStore'

export default function AccountPage() {
  const { user } = useUserStore()
  const [activeTab, setActiveTab] = useState<TabType>('PROFILE')
  const [accountData, setAccountData] = useState({
    profile: {
      id: '',
      name: '',
      email: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    orderHistory: [] as OrderHistoryItem[],
    addresses: [] as SavedAddress[],
  })

  // Load real user data
  useEffect(() => {
    ;(async () => {
      try {
        const [meRes, ordersRes, addrRes] = await Promise.all([
          fetch('/api/auth/me', { cache: 'no-store', credentials: 'include' }),
          fetch('/api/orders', { cache: 'no-store', credentials: 'include' }),
          fetch('/api/addresses', { cache: 'no-store', credentials: 'include' }),
        ])

        const me = meRes.ok ? await meRes.json() : null
        const orders = ordersRes.ok ? await ordersRes.json() : []
        const addresses = addrRes.ok ? (await addrRes.json()).addresses : []

        setAccountData(prev => ({
          ...prev,
          profile: {
            id: me?.id || '',
            name: me?.name || '',
            email: me?.email || '',
            createdAt: me?.createdAt ? new Date(me.createdAt) : new Date(),
            updatedAt: me?.updatedAt ? new Date(me.updatedAt) : new Date(),
          },
          orderHistory: (orders || []).map((o: any) => ({
            id: o.id,
            orderNumber: o.id.slice(0, 8).toUpperCase(),
            restaurantName: o.restaurant?.name || 'Restaurant',
            restaurantId: o.restaurantId,
            items: (o.items || []).map((it: any) => ({
              id: it.id,
              name: it.foodItem?.name || 'Item',
              quantity: it.quantity,
              price: it.priceAtTimeOfOrder,
            })),
            totalAmount: o.totalPrice,
            status: o.status,
            placedAt: new Date(o.createdAt),
            deliveredAt: o.status === 'DELIVERED' ? new Date(o.updatedAt) : undefined,
          })),
          addresses: addresses.map((a: any) => ({
            id: a.id,
            title: a.isDefault ? 'Default' : 'Saved Address',
            fullAddress: `${a.street}, ${a.city}, ${a.state} ${a.zipCode}`,
            street: a.street,
            city: a.city,
            state: a.state,
            pincode: a.zipCode,
            isDefault: a.isDefault,
            createdAt: new Date(),
          })),
        }))
      } catch (e) {
        // Silent fail; leaves empty states
      }
    })()
  }, [])

  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    setAccountData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...updatedProfile
      }
    }))
  }

  const handleAddressUpdate = (updatedAddresses: SavedAddress[]) => {
    setAccountData(prev => ({
      ...prev,
      addresses: updatedAddresses
    }))
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'PROFILE':
        return (
          <ProfileTab 
            profile={accountData.profile}
            onProfileUpdate={handleProfileUpdate}
          />
        )
      case 'ORDER_HISTORY':
        return (
          <OrderHistoryTab 
            orderHistory={accountData.orderHistory}
          />
        )
      case 'ADDRESSES':
        return (
          <AddressesTab 
            addresses={accountData.addresses}
            onAddressUpdate={handleAddressUpdate}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header Navigation */}
      <header className="bg-white border-b-2 border-black p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-black font-bold hover:text-[#39FF14] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <div className="w-px h-6 bg-black"></div>
            <h1 className="text-2xl font-black text-black">ReelBites.</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black text-black font-bold hover:bg-gray-50 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Partner Conversion CTA - Only show for regular users */}
        {user && user.role === 'USER' && (
          <div className="mb-8 bg-gradient-to-r from-[#39FF14] to-[#32E60F] border-4 border-black p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-8 h-8 text-black" />
                  <h2 className="text-2xl lg:text-3xl font-black text-black">
                    Ready to List Your Restaurant?
                  </h2>
                </div>
                <p className="text-black font-normal text-lg mb-4">
                  Join thousands of restaurant partners and start showcasing your delicious food through engaging reels. 
                  Reach more customers and grow your business with ReelBites.
                </p>
                <div className="flex items-center gap-6 text-black font-bold text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    <span>Showcase Your Food</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Increase Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>Reach More Customers</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#39FF14] border-2 border-black text-black font-bold text-lg hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-3px] hover:translate-y-[-3px] active:shadow-none active:translate-x-0 active:translate-y-0 transition-all duration-100"
                >
                  <Building2 className="w-6 h-6" />
                  BECOME A PARTNER
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant Owner Dashboard Link - Only show for restaurant owners */}
        {user && user.role === 'RESTAURANT_OWNER' && (
          <div className="mb-8 bg-black border-4 border-black p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-8 h-8 text-[#39FF14]" />
                  <h2 className="text-2xl lg:text-3xl font-black text-white">
                    Restaurant Dashboard
                  </h2>
                </div>
                <p className="text-gray-300 font-normal text-lg">
                  Manage your restaurant, track orders, upload reels, and monitor your business performance.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href="/restaurant"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#39FF14] border-2 border-black text-black font-bold text-lg hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-3px] hover:translate-y-[-3px] active:shadow-none active:translate-x-0 active:translate-y-0 transition-all duration-100"
                >
                  <Building2 className="w-6 h-6" />
                  GO TO DASHBOARD
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="transition-all duration-200">
          {renderActiveTab()}
        </div>

        {/* Account Summary Footer */}
        <div className="mt-12 bg-black border-2 border-black p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <span className="font-mono font-bold text-[#39FF14] text-2xl block">
                {accountData.profile.name.toUpperCase()}
              </span>
              <span className="text-gray-300 font-normal text-sm">ACCOUNT HOLDER</span>
            </div>
            <div>
              <span className="font-mono font-bold text-[#39FF14] text-2xl block">
                {accountData.orderHistory.length}
              </span>
              <span className="text-gray-300 font-normal text-sm">TOTAL ORDERS</span>
            </div>
            <div>
              <span className="font-mono font-bold text-[#39FF14] text-2xl block">
                {new Date().getFullYear() - new Date(accountData.profile.createdAt).getFullYear()}+
              </span>
              <span className="text-gray-300 font-normal text-sm">YEARS WITH US</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-600 text-center">
            <p className="text-gray-300 font-normal text-sm">
              Member since {accountData.profile.createdAt.toLocaleDateString('en-IN', { 
                month: 'long', 
                year: 'numeric' 
              })} • 
              Last updated {accountData.profile.updatedAt.toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
