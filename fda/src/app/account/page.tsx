"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'
import TabNavigation from '../components/ui/TabNavigation'
import ProfileTab from '../components/ui/ProfileTab'
import OrderHistoryTab from '../components/ui/OrderHistoryTab'
import AddressesTab from '../components/ui/AddressesTab'
import { dummyAccountData } from './dummyData'
import { TabType, UserProfile, SavedAddress } from './types'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabType>('PROFILE')
  const [accountData, setAccountData] = useState(dummyAccountData)

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
