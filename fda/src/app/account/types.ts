// Types for the user account page

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED'

export interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderHistoryItem {
  id: string
  orderNumber: string
  restaurantName: string
  restaurantId: string
  items: {
    id: string
    name: string
    quantity: number
    price: number
  }[]
  totalAmount: number
  status: OrderStatus
  placedAt: Date
  deliveredAt?: Date
  estimatedDeliveryTime?: string
}

export interface SavedAddress {
  id: string
  title: string
  fullAddress: string
  street: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
  createdAt: Date
}

export interface AccountData {
  profile: UserProfile
  orderHistory: OrderHistoryItem[]
  addresses: SavedAddress[]
}

export type TabType = 'PROFILE' | 'ORDER_HISTORY' | 'ADDRESSES'
