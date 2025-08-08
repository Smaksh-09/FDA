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
