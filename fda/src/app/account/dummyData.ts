import { AccountData, UserProfile, OrderHistoryItem, SavedAddress } from './types'

// Dummy user profile
export const dummyProfile: UserProfile = {
  id: 'user-123',
  name: 'Arjun Sharma',
  email: 'arjun.sharma@gmail.com',
  phone: '+91 98765 43210',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20')
}

// Dummy order history
export const dummyOrderHistory: OrderHistoryItem[] = [
  {
    id: 'order-001',
    orderNumber: 'ORD-00123',
    restaurantName: 'Burger Palace',
    restaurantId: 'rest-001',
    items: [
      { id: 'item-1', name: 'Classic Cheeseburger', quantity: 2, price: 249 },
      { id: 'item-2', name: 'French Fries', quantity: 1, price: 99 },
      { id: 'item-3', name: 'Cola (500ml)', quantity: 2, price: 45 }
    ],
    totalAmount: 687,
    status: 'DELIVERED',
    placedAt: new Date('2024-01-20T14:30:00'),
    deliveredAt: new Date('2024-01-20T15:15:00'),
    estimatedDeliveryTime: '25-35 mins'
  },
  {
    id: 'order-002',
    orderNumber: 'ORD-00124',
    restaurantName: 'Pizza Corner',
    restaurantId: 'rest-002',
    items: [
      { id: 'item-4', name: 'Margherita Pizza', quantity: 1, price: 399 },
      { id: 'item-5', name: 'Garlic Bread', quantity: 1, price: 149 }
    ],
    totalAmount: 548,
    status: 'PREPARING',
    placedAt: new Date('2024-01-21T13:45:00'),
    estimatedDeliveryTime: '30-40 mins'
  },
  {
    id: 'order-003',
    orderNumber: 'ORD-00125',
    restaurantName: 'Sushi Master',
    restaurantId: 'rest-003',
    items: [
      { id: 'item-6', name: 'Dragon Roll', quantity: 2, price: 599 },
      { id: 'item-7', name: 'Miso Soup', quantity: 1, price: 199 },
      { id: 'item-8', name: 'Green Tea', quantity: 1, price: 99 }
    ],
    totalAmount: 1496,
    status: 'CANCELLED',
    placedAt: new Date('2024-01-19T19:20:00')
  },
  {
    id: 'order-004',
    orderNumber: 'ORD-00126',
    restaurantName: 'Taco Express',
    restaurantId: 'rest-004',
    items: [
      { id: 'item-9', name: 'Chicken Tacos', quantity: 3, price: 149 },
      { id: 'item-10', name: 'Nachos', quantity: 1, price: 199 }
    ],
    totalAmount: 646,
    status: 'DELIVERED',
    placedAt: new Date('2024-01-18T20:10:00'),
    deliveredAt: new Date('2024-01-18T20:55:00'),
    estimatedDeliveryTime: '20-30 mins'
  },
  {
    id: 'order-005',
    orderNumber: 'ORD-00127',
    restaurantName: 'Pasta Italiano',
    restaurantId: 'rest-005',
    items: [
      { id: 'item-11', name: 'Fettuccine Alfredo', quantity: 1, price: 349 },
      { id: 'item-12', name: 'Caesar Salad', quantity: 1, price: 249 },
      { id: 'item-13', name: 'Tiramisu', quantity: 1, price: 199 }
    ],
    totalAmount: 797,
    status: 'OUT_FOR_DELIVERY',
    placedAt: new Date('2024-01-21T18:30:00'),
    estimatedDeliveryTime: '15-25 mins'
  },
  {
    id: 'order-006',
    orderNumber: 'ORD-00128',
    restaurantName: 'Burger Palace',
    restaurantId: 'rest-001',
    items: [
      { id: 'item-14', name: 'BBQ Burger', quantity: 1, price: 299 },
      { id: 'item-15', name: 'Onion Rings', quantity: 1, price: 129 }
    ],
    totalAmount: 428,
    status: 'DELIVERED',
    placedAt: new Date('2024-01-17T16:45:00'),
    deliveredAt: new Date('2024-01-17T17:30:00'),
    estimatedDeliveryTime: '20-30 mins'
  }
]

// Dummy saved addresses
export const dummySavedAddresses: SavedAddress[] = [
  {
    id: 'addr-001',
    title: 'Home',
    fullAddress: 'Flat 203, Sunrise Apartments, Linking Road, Bandra West, Mumbai, Maharashtra 400050',
    street: 'Flat 203, Sunrise Apartments, Linking Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    isDefault: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'addr-002',
    title: 'Office',
    fullAddress: 'Office 401, Business Center, Andheri Kurla Road, Andheri East, Mumbai, Maharashtra 400069',
    street: 'Office 401, Business Center, Andheri Kurla Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400069',
    isDefault: false,
    createdAt: new Date('2024-01-16')
  },
  {
    id: 'addr-003',
    title: 'Parents House',
    fullAddress: 'House 12, Green Valley Society, Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076',
    street: 'House 12, Green Valley Society, Hiranandani Gardens',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400076',
    isDefault: false,
    createdAt: new Date('2024-01-18')
  }
]

// Combined dummy account data
export const dummyAccountData: AccountData = {
  profile: dummyProfile,
  orderHistory: dummyOrderHistory,
  addresses: dummySavedAddresses
}
