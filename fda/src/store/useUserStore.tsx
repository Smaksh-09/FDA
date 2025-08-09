// src/store/useUserStore.ts

import { create } from 'zustand';
import { User, Role } from '@prisma/client';

// Define a type for the user object we'll store, excluding the password
export type UserState = Omit<User, 'password'>;

// Define the shape of our store's state and actions
interface UserStore {
  user: UserState | null;
  isLoading: boolean;
  setUser: (user: UserState | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

// Create the Zustand store
export const useUserStore = create<UserStore>((set) => ({
  // Initial state
  user: null,
  isLoading: true, // Start in a loading state until we check for a logged-in user

  // Action to set the user
  setUser: (user) => set({ user }),

  // Action to update the loading status
  setLoading: (loading) => set({ isLoading: loading }),
  
  // Action for logging out
  logout: async () => {
    try {
      // Call logout API to clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // Always clear client-side state regardless of API response
      set({ user: null })
    }
  },
}));