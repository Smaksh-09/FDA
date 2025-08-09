import { Order, OrderItem, RestaurantStats, Restaurant, MenuItem, Analytics, Transaction, Reel } from './types'

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

// Dummy menu items
export const dummyMenuItems: MenuItem[] = [
  {
    id: 'menu-1',
    name: 'Classic Cheeseburger',
    description: 'Juicy beef patty with melted cheese, lettuce, tomato, and special sauce',
    price: 249,
    category: 'Burgers',
    isAvailable: true,
    preparationTime: 8,
    ingredients: ['Beef Patty', 'Cheese', 'Lettuce', 'Tomato', 'Burger Bun', 'Special Sauce'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'menu-2',
    name: 'BBQ Burger',
    description: 'Smoky BBQ beef burger with crispy onions and BBQ sauce',
    price: 299,
    category: 'Burgers',
    isAvailable: true,
    preparationTime: 10,
    ingredients: ['Beef Patty', 'BBQ Sauce', 'Crispy Onions', 'Lettuce', 'Burger Bun'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'menu-3',
    name: 'Veggie Burger',
    description: 'Plant-based patty with fresh vegetables and herb mayo',
    price: 229,
    category: 'Burgers',
    isAvailable: false,
    preparationTime: 7,
    ingredients: ['Veggie Patty', 'Herb Mayo', 'Lettuce', 'Tomato', 'Onion', 'Burger Bun'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'menu-4',
    name: 'Chicken Wings (6pc)',
    description: 'Crispy chicken wings with choice of sauce',
    price: 199,
    category: 'Appetizers',
    isAvailable: true,
    preparationTime: 12,
    ingredients: ['Chicken Wings', 'Spice Mix', 'Sauce'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: 'menu-5',
    name: 'French Fries',
    description: 'Golden crispy potato fries with sea salt',
    price: 99,
    category: 'Sides',
    isAvailable: true,
    preparationTime: 5,
    ingredients: ['Potatoes', 'Sea Salt', 'Oil'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: 'menu-6',
    name: 'Onion Rings',
    description: 'Crispy battered onion rings with ranch dip',
    price: 129,
    category: 'Sides',
    isAvailable: true,
    preparationTime: 6,
    ingredients: ['Onions', 'Batter', 'Ranch Dip'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: 'menu-7',
    name: 'Chicken Wrap',
    description: 'Grilled chicken with fresh vegetables in a tortilla',
    price: 179,
    category: 'Wraps',
    isAvailable: true,
    preparationTime: 7,
    ingredients: ['Grilled Chicken', 'Tortilla', 'Lettuce', 'Tomato', 'Cucumber', 'Sauce'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'menu-8',
    name: 'Cola (500ml)',
    description: 'Refreshing cola drink',
    price: 45,
    category: 'Beverages',
    isAvailable: true,
    preparationTime: 1,
    ingredients: ['Cola'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: 'menu-9',
    name: 'Chocolate Milkshake',
    description: 'Rich and creamy chocolate milkshake',
    price: 149,
    category: 'Beverages',
    isAvailable: false,
    preparationTime: 4,
    ingredients: ['Milk', 'Chocolate Syrup', 'Ice Cream', 'Whipped Cream'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: 'menu-10',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing and croutons',
    price: 189,
    category: 'Salads',
    isAvailable: true,
    preparationTime: 5,
    ingredients: ['Romaine Lettuce', 'Caesar Dressing', 'Croutons', 'Parmesan Cheese'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-16')
  }
]

// Dummy analytics data
export const dummyAnalytics: Analytics = {
  totalRevenue: 124500,
  totalOrders: 487,
  averageOrderValue: 256,
  topSellingItem: 'Classic Cheeseburger',
  dailySales: [
    { date: '2024-01-15', revenue: 4250, orders: 18 },
    { date: '2024-01-16', revenue: 3890, orders: 16 },
    { date: '2024-01-17', revenue: 5200, orders: 22 },
    { date: '2024-01-18', revenue: 4650, orders: 19 },
    { date: '2024-01-19', revenue: 5800, orders: 24 },
    { date: '2024-01-20', revenue: 6100, orders: 26 },
    { date: '2024-01-21', revenue: 4950, orders: 21 },
    { date: '2024-01-22', revenue: 5300, orders: 23 },
    { date: '2024-01-23', revenue: 4700, orders: 20 },
    { date: '2024-01-24', revenue: 5500, orders: 24 },
    { date: '2024-01-25', revenue: 4800, orders: 19 },
    { date: '2024-01-26', revenue: 5900, orders: 25 },
    { date: '2024-01-27', revenue: 6200, orders: 27 },
    { date: '2024-01-28', revenue: 5400, orders: 23 },
    { date: '2024-01-29', revenue: 4900, orders: 21 }
  ],
  topItems: [
    { name: 'Classic Cheeseburger', unitsSold: 89, revenue: 22161 },
    { name: 'French Fries', unitsSold: 156, revenue: 15444 },
    { name: 'BBQ Burger', unitsSold: 67, revenue: 20033 },
    { name: 'Chicken Wings (6pc)', unitsSold: 78, revenue: 15522 },
    { name: 'Chicken Wrap', unitsSold: 54, revenue: 9666 },
    { name: 'Onion Rings', unitsSold: 89, revenue: 11481 },
    { name: 'Caesar Salad', unitsSold: 45, revenue: 8505 },
    { name: 'Cola (500ml)', unitsSold: 234, revenue: 10530 },
    { name: 'Veggie Burger', unitsSold: 23, revenue: 5267 },
    { name: 'Chocolate Milkshake', unitsSold: 34, revenue: 5066 }
  ]
}

// Dummy transaction data
export const dummyTransactions: Transaction[] = [
  {
    id: 'txn-1',
    transactionId: 'TXN-240125-001',
    amount: 15500,
    date: new Date('2024-01-25T09:30:00'),
    status: 'COMPLETED',
    type: 'WITHDRAWAL'
  },
  {
    id: 'txn-2',
    transactionId: 'TXN-240124-002',
    amount: 587,
    date: new Date('2024-01-24T16:45:00'),
    status: 'COMPLETED',
    type: 'SALE'
  },
  {
    id: 'txn-3',
    transactionId: 'TXN-240124-001',
    amount: 249,
    date: new Date('2024-01-24T14:20:00'),
    status: 'COMPLETED',
    type: 'SALE'
  },
  {
    id: 'txn-4',
    transactionId: 'TXN-240123-003',
    amount: 12000,
    date: new Date('2024-01-23T11:15:00'),
    status: 'PENDING',
    type: 'WITHDRAWAL'
  },
  {
    id: 'txn-5',
    transactionId: 'TXN-240123-002',
    amount: 149,
    date: new Date('2024-01-23T10:30:00'),
    status: 'FAILED',
    type: 'REFUND'
  },
  {
    id: 'txn-6',
    transactionId: 'TXN-240122-001',
    amount: 8750,
    date: new Date('2024-01-22T13:45:00'),
    status: 'COMPLETED',
    type: 'WITHDRAWAL'
  }
]

// Dummy reels data
export const dummyReels: Reel[] = [
  {
    id: 'reel-1',
    videoUrl: '/videos/burger-making.mp4',
    thumbnailUrl: '/thumbnails/burger-making.jpg',
    caption: 'Watch our chef craft the perfect Classic Cheeseburger! 🍔',
    linkedMenuItem: dummyMenuItems[0], // Classic Cheeseburger
    linkedMenuItemId: 'menu-1',
    restaurantId: '1',
    views: 2847,
    likes: 234,
    createdAt: new Date('2024-01-20T10:30:00'),
    updatedAt: new Date('2024-01-20T10:30:00'),
    isActive: true
  },
  {
    id: 'reel-2',
    videoUrl: '/videos/wings-prep.mp4',
    thumbnailUrl: '/thumbnails/wings-prep.jpg',
    caption: 'Crispy chicken wings being prepared to perfection! 🔥',
    linkedMenuItem: dummyMenuItems[3], // Chicken Wings
    linkedMenuItemId: 'menu-4',
    restaurantId: '1',
    views: 1923,
    likes: 187,
    createdAt: new Date('2024-01-18T15:45:00'),
    updatedAt: new Date('2024-01-18T15:45:00'),
    isActive: true
  },
  {
    id: 'reel-3',
    videoUrl: '/videos/fries-golden.mp4',
    thumbnailUrl: '/thumbnails/fries-golden.jpg',
    caption: 'Golden French fries straight from the fryer! 🍟',
    linkedMenuItem: dummyMenuItems[4], // French Fries
    linkedMenuItemId: 'menu-5',
    restaurantId: '1',
    views: 3156,
    likes: 289,
    createdAt: new Date('2024-01-15T12:20:00'),
    updatedAt: new Date('2024-01-15T12:20:00'),
    isActive: true
  },
  {
    id: 'reel-4',
    videoUrl: '/videos/bbq-burger.mp4',
    thumbnailUrl: '/thumbnails/bbq-burger.jpg',
    caption: 'Smoky BBQ burger with all the fixings! 🔥🍔',
    linkedMenuItem: dummyMenuItems[1], // BBQ Burger
    linkedMenuItemId: 'menu-2',
    restaurantId: '1',
    views: 1654,
    likes: 156,
    createdAt: new Date('2024-01-12T16:10:00'),
    updatedAt: new Date('2024-01-12T16:10:00'),
    isActive: false // This one is inactive
  },
  {
    id: 'reel-5',
    videoUrl: '/videos/wrap-making.mp4',
    thumbnailUrl: '/thumbnails/wrap-making.jpg',
    caption: 'Fresh chicken wrap assembly process! 🌯',
    linkedMenuItem: dummyMenuItems[6], // Chicken Wrap
    linkedMenuItemId: 'menu-7',
    restaurantId: '1',
    views: 987,
    likes: 78,
    createdAt: new Date('2024-01-10T14:30:00'),
    updatedAt: new Date('2024-01-10T14:30:00'),
    isActive: true
  },
  {
    id: 'reel-6',
    videoUrl: '/videos/salad-fresh.mp4',
    thumbnailUrl: '/thumbnails/salad-fresh.jpg',
    caption: 'Fresh Caesar salad preparation with crispy croutons! 🥗',
    linkedMenuItem: dummyMenuItems[9], // Caesar Salad
    linkedMenuItemId: 'menu-10',
    restaurantId: '1',
    views: 1234,
    likes: 102,
    createdAt: new Date('2024-01-08T11:15:00'),
    updatedAt: new Date('2024-01-08T11:15:00'),
    isActive: true
  }
]
