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
  isUserAdmin: boolean;
  userAssignedCategories: string[];
  userAssignedInterfaces: string[];
  logout: () => void;
  setUser: (userData: User) => void;
  setIsLoggedIn: (val: boolean) => void;
  setIsUserLoading: (val: boolean) => void;
  setAuthToken: (token: string) => void;
  setIsUserAdmin: (val: boolean) => void;
  setUserAssignedCategories: (categories: string[]) => void;
  setUserAssignedInterfaces: (interfaces: string[]) => void;
  isUserSynced: boolean;
  setIsUserSynced: (val: boolean) => void;
}


export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isUserLoading: false,
      authToken: null,
      isUserAdmin: false,
      userAssignedCategories: [],
      userAssignedInterfaces: [],
      isUserSynced: false,
      setIsUserSynced: (val) => set({ isUserSynced: val }),
      setUser: (userData) => set({ user: userData }),
      setIsLoggedIn: (val) => set({ isLoggedIn: !!val }),
      setIsUserLoading: (val) => set({ isUserLoading: !!val }),
      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
          authToken: null,
          isUserAdmin: false,
          userAssignedCategories: [],
          userAssignedInterfaces: [],
          isUserSynced: false,
        }),
      setAuthToken: (token) => set({ authToken: token }),
      setIsUserAdmin: (val) => set({ isUserAdmin: !!val }),
      setUserAssignedCategories: (categories) => set({ userAssignedCategories: categories }),
      setUserAssignedInterfaces: (interfaces) => set({ userAssignedInterfaces: interfaces }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        isUserAdmin: state.isUserAdmin,
        userAssignedCategories: state.userAssignedCategories,
        userAssignedInterfaces: state.userAssignedInterfaces,
        isUserSynced: state.isUserSynced,
      }),
    }
  )
);
