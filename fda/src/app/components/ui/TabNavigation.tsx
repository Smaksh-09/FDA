"use client"

import { TabType } from '../../account/types'

interface TabNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'PROFILE', label: 'PROFILE' },
    { id: 'ORDER_HISTORY', label: 'ORDER HISTORY' },
    { id: 'ADDRESSES', label: 'ADDRESSES' }
  ]

  return (
    <div className="mb-8">
      {/* Main Heading */}
      <h1 className="text-4xl md:text-5xl font-black text-black mb-8">
        YOUR ACCOUNT
      </h1>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-6 py-3 border-2 border-black font-bold text-sm transition-all duration-100 ${
              activeTab === tab.id
                ? 'bg-[#39FF14] text-black neobrutalist-shadow'
                : 'bg-white text-black hover:bg-gray-50'
            }`}
          >
            [ {tab.label} ]
          </button>
        ))}
      </div>
    </div>
  )
}
