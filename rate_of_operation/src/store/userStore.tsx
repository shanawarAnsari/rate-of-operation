import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string;
  email: string;
}

interface UserStore {
  user: User | null;
  isUserLoading: boolean;
  isLoggedIn: boolean | null;
  authToken: string | null;
  logout: () => void;
  setUser: (userData: User) => void;
  setIsLoggedIn: (val: boolean) => void;
  setIsUserLoading: (val: boolean) => void;
  setAuthToken: (token: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isUserLoading: false,
      authToken: null,
      setUser: (userData) => set({ user: userData }),
      setIsLoggedIn: (val) => set({ isLoggedIn: !!val }),
      setIsUserLoading: (val) => set({ isUserLoading: !!val }),
      logout: () => set({ user: null }),
      setAuthToken: (token) => set({ authToken: token }),
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