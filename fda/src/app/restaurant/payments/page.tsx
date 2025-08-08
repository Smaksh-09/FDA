"use client"

import { useState } from 'react'
import { Download, Calendar, CreditCard, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'
import RestaurantSidebar from '../../components/ui/RestaurantSidebar'
import { dummyTransactions, dummyRestaurant } from '../dummyData'
import { Transaction } from '../types'

export default function PaymentsPage() {
  const [transactions] = useState<Transaction[]>(dummyTransactions)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month')

  // Calculate current balance (total sales minus withdrawals)
  const currentBalance = transactions.reduce((balance, txn) => {
    if (txn.status === 'COMPLETED') {
      switch (txn.type) {
        case 'SALE':
          return balance + txn.amount
        case 'WITHDRAWAL':
          return balance - txn.amount
        case 'REFUND':
          return balance - txn.amount
        default:
          return balance
      }
    }
    return balance
  }, 0)

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'PENDING':
        return <Clock className="w-4 h-4 text-orange-600" />
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: Transaction['status']): string => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-600 text-white'
      case 'PENDING':
        return 'bg-orange-600 text-white'
      case 'FAILED':
        return 'bg-red-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  const getTypeColor = (type: Transaction['type']): string => {
    switch (type) {
      case 'SALE':
        return 'bg-[#39FF14] text-black'
      case 'WITHDRAWAL':
        return 'bg-[#0052FF] text-white'
      case 'REFUND':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const handleWithdrawFunds = () => {
    if (currentBalance <= 0) {
      alert('No funds available for withdrawal')
      return
    }
    
    const amount = prompt(`Enter withdrawal amount (Available: ${formatCurrency(currentBalance)}):`)
    if (amount && parseFloat(amount) > 0) {
      const withdrawAmount = parseFloat(amount)
      if (withdrawAmount <= currentBalance) {
        alert(`Withdrawal request of ${formatCurrency(withdrawAmount)} has been submitted for processing.`)
      } else {
        alert('Withdrawal amount cannot exceed available balance')
      }
    }
  }

  // Filter transactions based on selected period
  const filterTransactions = () => {
    if (selectedPeriod === 'all') return transactions
    
    const now = new Date()
    const daysToFilter = selectedPeriod === 'week' ? 7 : 30
    const cutoffDate = new Date(now.getTime() - (daysToFilter * 24 * 60 * 60 * 1000))
    
    return transactions.filter(txn => txn.date >= cutoffDate)
  }

  const filteredTransactions = filterTransactions().sort((a, b) => b.date.getTime() - a.date.getTime())

  // Calculate period stats
  const periodStats = {
    totalSales: filteredTransactions
      .filter(t => t.type === 'SALE' && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: filteredTransactions
      .filter(t => t.type === 'WITHDRAWAL' && t.status === 'COMPLETED')
      .reduce((sum, t) => sum + t.amount, 0),
    pendingWithdrawals: filteredTransactions
      .filter(t => t.type === 'WITHDRAWAL' && t.status === 'PENDING')
      .reduce((sum, t) => sum + t.amount, 0),
    refunds: filteredTransactions
      .filter(t => t.type === 'REFUND')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Sidebar */}
      <RestaurantSidebar 
        restaurant={dummyRestaurant} 
        currentPage="payments" 
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-black text-black mb-2">
            PAYMENTS
          </h1>
          <p className="text-gray-600 font-normal">
            Financial tracking and payout management
          </p>
        </div>

        {/* Current Balance Display */}
        <div className="mb-8">
          <div className="bg-white border-4 border-[#39FF14] p-8 neobrutalist-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-black text-lg mb-2">CURRENT BALANCE</h2>
                <div className="font-black text-black text-6xl font-mono">
                  {formatCurrency(currentBalance)}
                </div>
                <p className="text-gray-600 font-normal text-sm mt-2">
                  Available for withdrawal • Updates in real-time
                </p>
              </div>
              
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleWithdrawFunds}
                  disabled={currentBalance <= 0}
                  className={`px-8 py-4 border-2 border-black font-bold text-lg transition-all flex items-center gap-3 ${
                    currentBalance > 0
                      ? 'bg-[#39FF14] text-black hover:neobrutalist-shadow-active active:translate-x-1 active:translate-y-1'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Download className="w-6 h-6" />
                  [WITHDRAW FUNDS]
                </button>
                
                <div className="text-center">
                  <div className="text-xs text-gray-600 font-normal">
                    Processing Time: 1-3 business days
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="mb-6">
          <div className="flex gap-2">
            {(['week', 'month', 'all'] as const).map(period => (
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

        {/* Period Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border-2 border-black p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-[#39FF14] border border-black"></div>
              <span className="font-bold text-black text-sm">SALES</span>
            </div>
            <div className="font-bold text-black text-2xl">
              {formatCurrency(periodStats.totalSales)}
            </div>
          </div>

          <div className="bg-white border-2 border-black p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-[#0052FF] border border-black"></div>
              <span className="font-bold text-black text-sm">WITHDRAWN</span>
            </div>
            <div className="font-bold text-black text-2xl">
              {formatCurrency(periodStats.totalWithdrawals)}
            </div>
          </div>

          <div className="bg-white border-2 border-black p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-orange-500 border border-black"></div>
              <span className="font-bold text-black text-sm">PENDING</span>
            </div>
            <div className="font-bold text-black text-2xl">
              {formatCurrency(periodStats.pendingWithdrawals)}
            </div>
          </div>

          <div className="bg-white border-2 border-black p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-500 border border-black"></div>
              <span className="font-bold text-black text-sm">REFUNDS</span>
            </div>
            <div className="font-bold text-black text-2xl">
              {formatCurrency(periodStats.refunds)}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white border-2 border-black neobrutalist-shadow">
          {/* Table Header */}
          <div className="p-6 border-b-2 border-black bg-[#F5F5F5]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-black text-lg">TRANSACTION HISTORY</h3>
                <p className="text-gray-600 font-normal text-sm">
                  {filteredTransactions.length} transactions • {selectedPeriod === 'all' ? 'All time' : `Last ${selectedPeriod}`}
                </p>
              </div>
              
              <button className="px-4 py-2 bg-white border-2 border-black text-black font-bold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                [EXPORT]
              </button>
            </div>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-6 gap-4 p-4 border-b-2 border-black bg-[#F5F5F5] font-bold text-black text-sm">
            <div>TRANSACTION ID</div>
            <div>DATE</div>
            <div>TYPE</div>
            <div>AMOUNT</div>
            <div>STATUS</div>
            <div>DETAILS</div>
          </div>

          {/* Transaction List */}
          <div className="divide-y-2 divide-black">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-normal text-lg">No transactions found</p>
                <p className="text-gray-500 font-normal text-sm">
                  Transactions will appear here when sales or withdrawals are processed
                </p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="grid grid-cols-6 gap-4 p-4 hover:bg-gray-50 transition-colors">
                  {/* Transaction ID */}
                  <div>
                    <div className="font-mono font-bold text-black">
                      {transaction.transactionId}
                    </div>
                    <div className="text-xs text-gray-600">
                      ID: {transaction.id}
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="font-normal text-black text-sm">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <span className={`px-3 py-1 border-2 border-black font-bold text-xs ${getTypeColor(transaction.type)}`}>
                      {transaction.type}
                    </span>
                  </div>

                  {/* Amount */}
                  <div>
                    <div className={`font-bold text-lg ${
                      transaction.type === 'SALE' ? 'text-green-600' : 'text-black'
                    }`}>
                      {transaction.type === 'SALE' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(transaction.status)}
                      <span className={`px-2 py-1 border border-black font-bold text-xs ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <button className="px-3 py-1 bg-white border border-black text-black font-bold text-xs hover:bg-gray-50 transition-colors">
                      [VIEW]
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary Footer */}
          {filteredTransactions.length > 0 && (
            <div className="p-4 border-t-2 border-black bg-[#F5F5F5]">
              <div className="grid grid-cols-6 gap-4 font-bold text-black text-sm">
                <div>SUMMARY</div>
                <div>{selectedPeriod.toUpperCase()}</div>
                <div>{filteredTransactions.length} txns</div>
                <div>
                  {formatCurrency(
                    filteredTransactions
                      .filter(t => t.status === 'COMPLETED')
                      .reduce((sum, t) => {
                        return t.type === 'SALE' ? sum + t.amount : sum - t.amount
                      }, 0)
                  )}
                </div>
                <div>
                  {filteredTransactions.filter(t => t.status === 'COMPLETED').length} completed
                </div>
                <div></div>
              </div>
            </div>
          )}
        </div>

        {/* Payment Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black border-2 border-black p-6 text-white">
            <h4 className="font-bold text-[#39FF14] text-sm mb-3">PAYOUT INFORMATION</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-bold">Bank Account:</span>
                <span className="font-mono ml-2">****-****-****-1234</span>
              </div>
              <div>
                <span className="font-bold">IFSC Code:</span>
                <span className="font-mono ml-2">HDFC0001234</span>
              </div>
              <div>
                <span className="font-bold">Account Holder:</span>
                <span className="ml-2">{dummyRestaurant.name}</span>
              </div>
              <div>
                <span className="font-bold">Processing Time:</span>
                <span className="ml-2">1-3 business days</span>
              </div>
            </div>
          </div>

          <div className="bg-black border-2 border-black p-6 text-white">
            <h4 className="font-bold text-[#39FF14] text-sm mb-3">TRANSACTION FEES</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-bold">Payment Processing:</span>
                <span className="ml-2">2.9% + ₹3 per transaction</span>
              </div>
              <div>
                <span className="font-bold">Withdrawal Fee:</span>
                <span className="ml-2">₹25 per withdrawal</span>
              </div>
              <div>
                <span className="font-bold">Instant Transfer:</span>
                <span className="ml-2">₹10 additional fee</span>
              </div>
              <div>
                <span className="font-bold">Refund Processing:</span>
                <span className="ml-2">Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
