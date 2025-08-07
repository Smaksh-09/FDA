// Types for the ReelBytes page components

export interface Restaurant {
  id: string
  name: string
  logoUrl: string
  rating: number
  deliveryTime: string
}

export interface FoodItem {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
}

export interface Comment {
  id: string
  userName: string
  userAvatar: string
  text: string
  timestamp: string
  likes: number
}

export interface Reel {
  id: string
  videoUrl: string
  caption: string
  restaurant: Restaurant
  foodItem: FoodItem
  comments: Comment[]
  likes: number
  views: number
  createdAt: string
}

export interface ReelData {
  currentReel: Reel
  playlist: Reel[]
}
