import { Order, OrderItem, RestaurantStats, Restaurant } from './types'

// Dummy restaurant data
export const dummyRestaurant: Restaurant = {
  id: '1',
  name: 'Burger Palace',
  address: '123 Food Street, Mumbai, Maharashtra 400001',
  phone: '+91 98765 43210',
  email: 'owner@burgerpalace.com',
  isOpen: true
}

// Dummy order items
const menuItems: OrderItem[] = [
  { id: '1', name: 'Classic Cheeseburger', quantity: 1, price: 249 },
  { id: '2', name: 'Chicken Wings (6pc)', quantity: 1, price: 199 },
  { id: '3', name: 'French Fries', quantity: 2, price: 99 },
  { id: '4', name: 'Cola (500ml)', quantity: 1, price: 45 },
  { id: '5', name: 'Veggie Burger', quantity: 1, price: 229 },
  { id: '6', name: 'Chicken Wrap', quantity: 1, price: 179 },
  { id: '7', name: 'Onion Rings', quantity: 1, price: 129 },
  { id: '8', name: 'Milkshake (Chocolate)', quantity: 1, price: 149 },
  { id: '9', name: 'BBQ Burger', quantity: 1, price: 299 },
  { id: '10', name: 'Caesar Salad', quantity: 1, price: 189 }
]

// Function to generate random order items
const getRandomOrderItems = (): OrderItem[] => {
  const numItems = Math.floor(Math.random() * 4) + 1 // 1-4 items
  const selectedItems: OrderItem[] = []
  const shuffled = [...menuItems].sort(() => 0.5 - Math.random())
  
  for (let i = 0; i < numItems && i < shuffled.length; i++) {
    const item = { ...shuffled[i] }
    item.quantity = Math.floor(Math.random() * 3) + 1 // 1-3 quantity
    selectedItems.push(item)
  }
  
  return selectedItems
}

// Generate dummy orders
export const dummyOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customerName: 'Arjun Sharma',
    customerPhone: '+91 98765 43210',
    items: [
      { id: '1', name: 'Classic Cheeseburger', quantity: 2, price: 249 },
      { id: '2', name: 'French Fries', quantity: 1, price: 99 },
      { id: '3', name: 'Cola (500ml)', quantity: 2, price: 45 }
    ],
    totalAmount: 687,
    status: 'PENDING',
    estimatedTime: 15,
    placedAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    updatedAt: new Date(Date.now() - 2 * 60 * 1000),
    deliveryAddress: 'Flat 203, Sunrise Apartments, Bandra West, Mumbai',
    paymentMethod: 'UPI'
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customerName: 'Priya Patel',
    customerPhone: '+91 87654 32109',
    items: [
      { id: '4', name: 'Veggie Burger', quantity: 1, price: 229 },
      { id: '5', name: 'Onion Rings', quantity: 1, price: 129 }
    ],
    totalAmount: 358,
    status: 'CONFIRMED',
    estimatedTime: 12,
    placedAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    updatedAt: new Date(Date.now() - 3 * 60 * 1000),
    deliveryAddress: 'Office 401, Business Center, Andheri East, Mumbai',
    paymentMethod: 'CARD'
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customerName: 'Ravi Kumar',
    customerPhone: '+91 76543 21098',
    items: [
      { id: '6', name: 'BBQ Burger', quantity: 1, price: 299 },
      { id: '7', name: 'Chicken Wings (6pc)', quantity: 1, price: 199 },
      { id: '8', name: 'Milkshake (Chocolate)', quantity: 1, price: 149 }
    ],
    totalAmount: 647,
    status: 'PREPARING',
    estimatedTime: 8,
    placedAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    updatedAt: new Date(Date.now() - 1 * 60 * 1000),
    deliveryAddress: 'House 12, Green Valley Society, Powai, Mumbai',
    paymentMethod: 'CASH'
  },
  {
    id: '4',
    orderNumber: 'ORD-004',
    customerName: 'Sneha Joshi',
    customerPhone: '+91 65432 10987',
    items: [
      { id: '9', name: 'Chicken Wrap', quantity: 2, price: 179 },
      { id: '10', name: 'Cola (500ml)', quantity: 1, price: 45 }
    ],
    totalAmount: 403,
    status: 'PENDING',
    estimatedTime: 18,
    placedAt: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
    updatedAt: new Date(Date.now() - 1 * 60 * 1000),
    deliveryAddress: 'Apartment 5B, Ocean View, Juhu, Mumbai',
    paymentMethod: 'UPI'
  },
  {
    id: '5',
    orderNumber: 'ORD-005',
    customerName: 'Amit Singh',
    customerPhone: '+91 54321 09876',
    items: [
      { id: '11', name: 'Caesar Salad', quantity: 1, price: 189 },
      { id: '12', name: 'French Fries', quantity: 1, price: 99 }
    ],
    totalAmount: 288,
    status: 'PREPARING',
    estimatedTime: 5,
    placedAt: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
    updatedAt: new Date(Date.now() - 4 * 60 * 1000),
    deliveryAddress: 'Room 301, Student Hostel, Vile Parle, Mumbai',
    paymentMethod: 'CARD'
  },
  {
    id: '6',
    orderNumber: 'ORD-006',
    customerName: 'Kavya Nair',
    customerPhone: '+91 43210 98765',
    items: [
      { id: '13', name: 'Classic Cheeseburger', quantity: 1, price: 249 },
      { id: '14', name: 'Onion Rings', quantity: 1, price: 129 },
      { id: '15', name: 'Milkshake (Chocolate)', quantity: 1, price: 149 }
    ],
    totalAmount: 527,
    status: 'READY',
    estimatedTime: 0,
    placedAt: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
    updatedAt: new Date(Date.now() - 2 * 60 * 1000),
    deliveryAddress: 'Villa 7, Palm Grove, Versova, Mumbai',
    paymentMethod: 'UPI'
  }
]

// Calculate restaurant stats from orders
export const calculateStats = (orders: Order[]): RestaurantStats => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todaysOrders = orders.filter(order => 
    order.placedAt >= today
  )
  
  const incomingOrders = orders.filter(order => 
    order.status === 'PENDING' || order.status === 'CONFIRMED'
  ).length
  
  const preparingOrders = orders.filter(order => 
    order.status === 'PREPARING'
  ).length
  
  const completedToday = todaysOrders.filter(order => 
    order.status === 'DELIVERED'
  ).length
  
  const totalSalesToday = todaysOrders.reduce((sum, order) => 
    order.status !== 'CANCELLED' ? sum + order.totalAmount : sum, 0
  )
  
  // Calculate average prep time (mock calculation)
  const avgPrepTime = orders.length > 0 ? 
    Math.round(orders.reduce((sum, order) => sum + order.estimatedTime, 0) / orders.length) : 0
  
  return {
    incomingOrders,
    preparingOrders,
    totalSalesToday,
    averagePrepTime: avgPrepTime,
    ordersCompletedToday: completedToday,
    revenue: {
      today: totalSalesToday,
      week: totalSalesToday * 7, // Mock weekly
      month: totalSalesToday * 30 // Mock monthly
    }
  }
}

export const dummyStats = calculateStats(dummyOrders)
