Food Reels Delivery App - Project README
1. Project Vision & Core Concept
This project is a full-stack food delivery application with a modern, engaging twist. The core concept is to create a "TikTok/Instagram Reels for food" experience where users discover food through an endless scroll of short video reels and can instantly purchase the featured item with a single click.

The primary goal is to build a robust, end-to-end, production-ready application that can successfully onboard restaurants, manage users, and process orders seamlessly.

2. Core Features
User Features:
Reels Feed: An infinite scroll feed of short food videos.

One-Click Order: A "Buy Now" button directly on the reel to instantly order the featured food item.

Authentication: Secure user registration and login.

Order History: View past and current order statuses.

Address Management: Add and manage multiple delivery addresses.

Restaurant Owner Features:
Onboarding: Register their restaurant on the platform.

Menu Management: Add, update, and manage food items on their menu.

Reel Management: Upload and manage video reels associated with their food items.

Order Management: View incoming orders and update their status (e.g., Confirmed, Preparing, Out for Delivery).

Restaurant Profile: Manage restaurant details like name, address, and open/closed status.

3. Tech Stack
Framework: Next.js 14+ (with App Router)

Language: TypeScript

Backend: Next.js API Routes (src/app/api)

Database: PostgreSQL

ORM: Prisma

Authentication: JWTs stored in secure, httpOnly cookies.

Validation: Zod for API input validation.

4. Backend Architecture
4.1. Database Schema (prisma/schema.prisma)
The database is the single source of truth for the application. The schema defines all data models, their fields, and their relationships.

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ENUMS for defining roles and statuses
enum Role {
  USER
  RESTAURANT_OWNER
  ADMIN
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PREPARING
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
}

// User model for customers and restaurant owners
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String
  password  String // Will be a hashed password
  role      Role      @default(USER)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  addresses   Address[]
  orders      Order[]
  restaurant  Restaurant? // A user can own one restaurant
}

// Restaurant model
model Restaurant {
  id            String    @id @default(cuid())
  name          String
  description   String
  address       String    // Physical address of the restaurant
  imageUrl      String?   // A banner/profile image for the restaurant
  isOpen        Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  ownerId       String    @unique
  owner         User      @relation(fields: [ownerId], references: [id])

  menuItems     FoodItem[]
  reels         Reel[]
  orders        Order[]

  @@index([ownerId])
}

// Food items available at a restaurant
model FoodItem {
  id            String    @id @default(cuid())
  name          String
  description   String
  price         Float
  imageUrl      String
  isAvailable   Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  restaurantId  String
  restaurant    Restaurant @relation(fields: [restaurantId], references: [id])

  orderItems    OrderItem[]
  reels         Reel[]

  @@index([restaurantId])
}

// The video reels
model Reel {
  id            String    @id @default(cuid())
  videoUrl      String
  caption       String?
  createdAt     DateTime  @default(now())

  restaurantId  String
  restaurant    Restaurant @relation(fields: [restaurantId], references: [id])

  foodItemId    String
  foodItem      FoodItem  @relation(fields: [foodItemId], references: [id])

  @@index([restaurantId])
  @@index([foodItemId])
}

// User's delivery addresses
model Address {
  id        String    @id @default(cuid())
  street    String
  city      String
  state     String
  zipCode   String
  country   String
  isDefault Boolean   @default(false)

  userId    String
  user      User      @relation(fields: [userId], references: [id])

  @@index([userId])
}

// Order model
model Order {
  id            String      @id @default(cuid())
  totalPrice    Float
  status        OrderStatus @default(PENDING)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  userId        String
  user          User        @relation(fields: [userId], references: [id])

  restaurantId  String
  restaurant    Restaurant  @relation(fields: [restaurantId], references: [id])

  items         OrderItem[]

  @@index([userId])
  @@index([restaurantId])
}

// Join table for Order and FoodItem (Many-to-Many)
model OrderItem {
  id        String @id @default(cuid())
  quantity  Int
  priceAtTimeOfOrder Float

  orderId   String
  order     Order  @relation(fields: [orderId], references: [id])

  foodItemId String
  foodItem   FoodItem @relation(fields: [foodItemId], references: [id])

  @@index([orderId])
  @@index([foodItemId])
}

4.2. API Endpoint Structure
All backend logic resides within the src/app/api/ directory, following Next.js App Router conventions.

/api/auth/

register: Handles new user creation.

login: Authenticates users and returns a JWT cookie.

me: A protected route to get the current user's data from their valid cookie.

/api/restaurants/: For creating, fetching, and updating restaurant details.

/api/food-items/: For managing menu items for a restaurant.

/api/reels/: For fetching the main feed and allowing owners to upload new reels.

/api/orders/: For creating new orders and viewing order history.

6. Instructions for AI Assistant (e.g., Cursor)
When generating code, please follow these core principles:

Source of Truth: The prisma/schema.prisma file is the definitive source for all data models. After any change to this file, you must run npx prisma generate to update the Prisma Client.

API Location: All backend API logic must be placed within src/app/api/ using Route Handlers.

Authentication: All protected routes must validate the JWT token from the httpOnly cookie named token. The /api/auth/me route is the template for this logic.

Validation: All API routes that accept a request body must use Zod to validate the input. This is a strict requirement for security and data integrity. Refer to /api/auth/register/route.ts for an example.

Database Access: Use the singleton Prisma instance exported from src/lib/prisma.ts for all database queries.

Security: Never return password hashes or other sensitive data from API endpoints. Always use select or destructuring to exclude sensitive fields.

Consistency: Follow the existing code structure, naming conventions, and patterns established in the authentication module.