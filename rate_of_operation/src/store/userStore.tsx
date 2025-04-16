import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string;
  email: string;
}

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  logout: () => void;
  setUser: (userData: User) => void;
  setIsLoggedIn: (val: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setUser: (userData) => set({ user: userData }),
      setIsLoggedIn: (val) => set({ isLoggedIn: !!val }),
      logout: () => set({ user: null })
    }),
    {
      name: 'user-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);