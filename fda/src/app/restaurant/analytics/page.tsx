"use client"

import { useState } from 'react'
import { TrendingUp, DollarSign, ShoppingBag, Star } from 'lucide-react'
import RestaurantSidebar from '../../components/ui/RestaurantSidebar'
import { dummyAnalytics, dummyRestaurant } from '../dummyData'
import { Analytics } from '../types'

interface BlockyBarChartProps {
  data: { date: string; revenue: number; orders: number }[]
  title: string
  valueKey: 'revenue' | 'orders'
  color: string
}

function BlockyBarChart({ data, title, valueKey, color }: BlockyBarChartProps) {
  const maxValue = Math.max(...data.map(d => d[valueKey]))
  const chartHeight = 200

  return (
    <div className="bg-white border-2 border-black p-6 neobrutalist-shadow">
      <h3 className="font-bold text-black text-lg mb-4">{title}</h3>
      
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600 font-mono">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-12 flex items-end justify-between" style={{ height: chartHeight }}>
          {data.map((item, index) => {
            const barHeight = (item[valueKey] / maxValue) * chartHeight
            return (
              <div key={index} className="flex flex-col items-center gap-2 group">
                {/* Bar */}
                <div
                  className={`w-8 ${color} border-2 border-black transition-all group-hover:neobrutalist-shadow cursor-pointer relative`}
                  style={{ height: barHeight || 2 }}
                  title={`${item.date}: ${valueKey === 'revenue' ? '₹' : ''}${item[valueKey].toLocaleString('en-IN')}`}
                >
                  {/* Value on hover */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {valueKey === 'revenue' ? '₹' : ''}{item[valueKey].toLocaleString('en-IN')}
                  </div>
                </div>
                
                {/* Date label */}
                <span className="text-xs text-gray-600 font-mono transform -rotate-45 origin-left">
                  {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [analytics] = useState<Analytics>(dummyAnalytics)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week')

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const displayData = analytics.dailySales.slice(selectedPeriod === 'week' ? -7 : -15)

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <RestaurantSidebar 
        restaurant={dummyRestaurant} 
        currentPage="analytics" 
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-black text-black mb-2">
            ANALYTICS
          </h1>
          <p className="text-gray-600 font-normal">
            Raw data and performance metrics for your restaurant
          </p>
        </div>

        {/* Period Selector */}
        <div className="mb-6">
          <div className="flex gap-2">
            {(['week', 'month'] as const).map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 border-2 border-black font-bold text-sm transition-all ${
                  selectedPeriod === period
                    ? 'bg-[#39FF14] text-black neobrutalist-shadow'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                {period.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Key Stats Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <div className="bg-white border-2 border-black p-6 neobrutalist-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 bg-[#39FF14] border border-black"></div>
              <span className="font-bold text-black text-sm">TOTAL REVENUE</span>
            </div>
            <div className="font-black text-black text-4xl font-mono">
              {formatCurrency(analytics.totalRevenue)}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-bold text-sm">+15.3%</span>
              <span className="text-gray-600 font-normal text-sm">vs last month</span>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white border-2 border-black p-6 neobrutalist-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 bg-[#0052FF] border border-black"></div>
              <span className="font-bold text-black text-sm">TOTAL ORDERS</span>
            </div>
            <div className="font-black text-black text-4xl font-mono">
              {analytics.totalOrders.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-bold text-sm">+8.7%</span>
              <span className="text-gray-600 font-normal text-sm">vs last month</span>
            </div>
          </div>

          {/* Avg Order Value */}
          <div className="bg-white border-2 border-black p-6 neobrutalist-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 bg-orange-500 border border-black"></div>
              <span className="font-bold text-black text-sm">AVG ORDER VALUE</span>
            </div>
            <div className="font-black text-black text-4xl font-mono">
              {formatCurrency(analytics.averageOrderValue)}
            </div>
            <div className="flex items-center gap-1 mt-2">
              <DollarSign className="w-4 h-4 text-orange-600" />
              <span className="text-orange-600 font-bold text-sm">+6.1%</span>
              <span className="text-gray-600 font-normal text-sm">vs last month</span>
            </div>
          </div>

          {/* Top Selling Item */}
          <div className="bg-white border-2 border-black p-6 neobrutalist-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 bg-red-500 border border-black"></div>
              <span className="font-bold text-black text-sm">TOP SELLING ITEM</span>
            </div>
            <div className="font-bold text-black text-xl mb-2">
              {analytics.topSellingItem}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-gray-600 font-normal text-sm">
                {analytics.topItems[0]?.unitsSold || 0} units sold
              </span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <BlockyBarChart
            data={displayData}
            title={`DAILY REVENUE (${selectedPeriod.toUpperCase()})`}
            valueKey="revenue"
            color="bg-[#39FF14]"
          />

          {/* Orders Chart */}
          <BlockyBarChart
            data={displayData}
            title={`DAILY ORDERS (${selectedPeriod.toUpperCase()})`}
            valueKey="orders"
            color="bg-[#0052FF]"
          />
        </div>

        {/* Top Selling Items Table */}
        <div className="bg-white border-2 border-black neobrutalist-shadow">
          <div className="p-6 border-b-2 border-black bg-[#F5F5F5]">
            <h3 className="font-bold text-black text-lg">TOP 10 BEST-SELLING ITEMS</h3>
            <p className="text-gray-600 font-normal text-sm">Raw data • Most popular items by units sold</p>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-4 gap-4 p-4 border-b-2 border-black bg-[#F5F5F5] font-bold text-black text-sm">
            <div>RANK</div>
            <div>ITEM NAME</div>
            <div>UNITS SOLD</div>
            <div>REVENUE GENERATED</div>
          </div>

          {/* Table Data */}
          <div className="divide-y-2 divide-black">
            {analytics.topItems.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                {/* Rank */}
                <div>
                  <span className="font-mono font-bold text-black text-lg">
                    #{(index + 1).toString().padStart(2, '0')}
                  </span>
                </div>

                {/* Item Name */}
                <div>
                  <span className="font-bold text-black">{item.name}</span>
                </div>

                {/* Units Sold */}
                <div>
                  <span className="font-mono font-bold text-black text-lg">
                    {item.unitsSold.toLocaleString('en-IN')}
                  </span>
                  <span className="text-gray-600 font-normal text-sm ml-2">units</span>
                </div>

                {/* Revenue */}
                <div>
                  <span className="font-mono font-bold text-black text-lg">
                    {formatCurrency(item.revenue)}
                  </span>
                  <div className="text-gray-600 font-normal text-sm">
                    {formatCurrency(Math.round(item.revenue / item.unitsSold))} per unit
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t-2 border-black bg-[#F5F5F5]">
            <div className="grid grid-cols-4 gap-4 font-bold text-black text-sm">
              <div>TOTAL</div>
              <div>All Items</div>
              <div>{analytics.topItems.reduce((sum, item) => sum + item.unitsSold, 0).toLocaleString('en-IN')} units</div>
              <div>{formatCurrency(analytics.topItems.reduce((sum, item) => sum + item.revenue, 0))}</div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black border-2 border-black p-4 text-white">
            <h4 className="font-bold text-[#39FF14] text-sm mb-2">PEAK HOURS</h4>
            <div className="space-y-1">
              <div className="text-white font-normal text-sm">Lunch: 12:00 - 14:00</div>
              <div className="text-white font-normal text-sm">Dinner: 19:00 - 21:00</div>
              <div className="text-white font-normal text-sm">Weekend: 20:00 - 22:00</div>
            </div>
          </div>

          <div className="bg-black border-2 border-black p-4 text-white">
            <h4 className="font-bold text-[#39FF14] text-sm mb-2">CUSTOMER INSIGHTS</h4>
            <div className="space-y-1">
              <div className="text-white font-normal text-sm">Repeat Customers: 67%</div>
              <div className="text-white font-normal text-sm">New Customers: 33%</div>
              <div className="text-white font-normal text-sm">Avg Visit Frequency: 2.3x/month</div>
            </div>
          </div>

          <div className="bg-black border-2 border-black p-4 text-white">
            <h4 className="font-bold text-[#39FF14] text-sm mb-2">OPERATIONAL METRICS</h4>
            <div className="space-y-1">
              <div className="text-white font-normal text-sm">Avg Prep Time: 12 mins</div>
              <div className="text-white font-normal text-sm">Order Accuracy: 97.8%</div>
              <div className="text-white font-normal text-sm">Customer Rating: 4.6/5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
