// Types for the restaurant dashboard

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED'

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  specialInstructions?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  estimatedTime: number // in minutes
  placedAt: Date
  updatedAt: Date
  deliveryAddress?: string
  paymentMethod: 'CASH' | 'CARD' | 'UPI'
}

export interface RestaurantStats {
  incomingOrders: number
  preparingOrders: number
  totalSalesToday: number
  averagePrepTime: number
  ordersCompletedToday: number
  revenue: {
    today: number
    week: number
    month: number
  }
}

export interface Restaurant {
  id: string
  name: string
  address: string
  phone: string
  email: string
  isOpen: boolean
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  isAvailable: boolean
  preparationTime: number // in minutes
  ingredients?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Analytics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  topSellingItem: string
  dailySales: { date: string; revenue: number; orders: number }[]
  topItems: { name: string; unitsSold: number; revenue: number }[]
}

export interface Transaction {
  id: string
  transactionId: string
  amount: number
  date: Date
  status: 'COMPLETED' | 'PENDING' | 'FAILED'
  type: 'WITHDRAWAL' | 'SALE' | 'REFUND'
}
