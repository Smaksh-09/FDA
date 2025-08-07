import { Reel, Restaurant, FoodItem, Comment } from './types'

// Dummy restaurants
const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Burger Palace',
    logoUrl: '/placeholder-restaurant.jpg',
    rating: 4.8,
    deliveryTime: '15-25 min'
  },
  {
    id: '2',
    name: 'Pizza Corner',
    logoUrl: '/placeholder-restaurant.jpg',
    rating: 4.6,
    deliveryTime: '20-30 min'
  },
  {
    id: '3',
    name: 'Sushi Master',
    logoUrl: '/placeholder-restaurant.jpg',
    rating: 4.9,
    deliveryTime: '25-35 min'
  },
  {
    id: '4',
    name: 'Taco Express',
    logoUrl: '/placeholder-restaurant.jpg',
    rating: 4.7,
    deliveryTime: '10-20 min'
  },
  {
    id: '5',
    name: 'Pasta Italiano',
    logoUrl: '/placeholder-restaurant.jpg',
    rating: 4.5,
    deliveryTime: '30-40 min'
  }
]

// Dummy food items
const foodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    price: 12.99,
    description: 'Juicy beef patty with melted cheese, lettuce, tomato, and our special sauce on a brioche bun.',
    imageUrl: '/placeholder-food.jpg'
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    price: 16.50,
    description: 'Fresh mozzarella, basil, and tomato sauce on our hand-tossed dough.',
    imageUrl: '/placeholder-food.jpg'
  },
  {
    id: '3',
    name: 'Dragon Roll',
    price: 18.99,
    description: 'Tempura shrimp, avocado, and cucumber topped with eel and spicy mayo.',
    imageUrl: '/placeholder-food.jpg'
  },
  {
    id: '4',
    name: 'Carnitas Tacos',
    price: 9.99,
    description: 'Slow-cooked pork with onions, cilantro, and lime on soft corn tortillas.',
    imageUrl: '/placeholder-food.jpg'
  },
  {
    id: '5',
    name: 'Fettuccine Alfredo',
    price: 14.75,
    description: 'Rich and creamy alfredo sauce with perfectly cooked fettuccine pasta.',
    imageUrl: '/placeholder-food.jpg'
  }
]

// Dummy comments
const comments: Comment[] = [
  {
    id: '1',
    userName: 'FoodLover123',
    userAvatar: '/placeholder-avatar.jpg',
    text: 'This looks absolutely amazing! 🤤',
    timestamp: '2m ago',
    likes: 24
  },
  {
    id: '2',
    userName: 'HungryStudent',
    userAvatar: '/placeholder-avatar.jpg',
    text: 'Where can I get this?!',
    timestamp: '5m ago',
    likes: 12
  },
  {
    id: '3',
    userName: 'ChefMike',
    userAvatar: '/placeholder-avatar.jpg',
    text: 'Perfect presentation 👨‍🍳',
    timestamp: '8m ago',
    likes: 18
  },
  {
    id: '4',
    userName: 'LocalFoodie',
    userAvatar: '/placeholder-avatar.jpg',
    text: 'Just ordered this! Can\'t wait 🔥',
    timestamp: '12m ago',
    likes: 7
  }
]

// Create dummy reels
export const dummyReels: Reel[] = [
  {
    id: '1',
    videoUrl: '/placeholder-video.mp4',
    caption: 'The perfect cheeseburger doesn\'t exi— 🍔',
    restaurant: restaurants[0],
    foodItem: foodItems[0],
    comments: comments.slice(0, 3),
    likes: 1247,
    views: 8432,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    videoUrl: '/placeholder-video.mp4',
    caption: 'Fresh pizza straight from the oven! 🍕',
    restaurant: restaurants[1],
    foodItem: foodItems[1],
    comments: comments.slice(1, 4),
    likes: 892,
    views: 5621,
    createdAt: '2024-01-15T09:45:00Z'
  },
  {
    id: '3',
    videoUrl: '/placeholder-video.mp4',
    caption: 'Sushi artistry at its finest ✨',
    restaurant: restaurants[2],
    foodItem: foodItems[2],
    comments: comments.slice(0, 2),
    likes: 2156,
    views: 12843,
    createdAt: '2024-01-15T08:20:00Z'
  },
  {
    id: '4',
    videoUrl: '/placeholder-video.mp4',
    caption: 'Taco Tuesday vibes! 🌮',
    restaurant: restaurants[3],
    foodItem: foodItems[3],
    comments: comments.slice(2, 4),
    likes: 643,
    views: 3891,
    createdAt: '2024-01-15T07:15:00Z'
  },
  {
    id: '5',
    videoUrl: '/placeholder-video.mp4',
    caption: 'Creamy perfection in every bite 🍝',
    restaurant: restaurants[4],
    foodItem: foodItems[4],
    comments: comments,
    likes: 1098,
    views: 7234,
    createdAt: '2024-01-15T06:30:00Z'
  }
]

// Export the main data structure
export const dummyData = {
  currentReel: dummyReels[0],
  playlist: dummyReels.slice(1)
}
