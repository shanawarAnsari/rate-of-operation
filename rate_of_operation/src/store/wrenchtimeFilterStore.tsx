import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WrenchtimeFilterSelections {
  [key: string]: string[];
}

interface WrenchtimeFilterStore {
  filterSelections: WrenchtimeFilterSelections;
  selectedCategory: string;
  selectedReviewedStatus: string;
  setFilterSelections: (selections: WrenchtimeFilterSelections) => void;
  updateFilterSelection: (field: string, values: string[]) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedReviewedStatus: (status: string) => void;
  resetFilters: () => void;
}

const defaultFilters: WrenchtimeFilterSelections = {
  SETUP_MATRIX: [],
  LOCATION: [],
  FROM_SETUP_GROUP: [],
  TO_SETUP_GROUP: [],
  FROM_MACHINE: [],
  FROM_PRODUCT_SIZE: [],
  FROM_PRODUCT_VARIANT: [],
  TO_MACHINE: [],
  TO_PRODUCT_SIZE: [],
  TO_PRODUCT_VARIANT: [],
  INTERFACE: [],
  BUSINESS_UNIT: [],
};

export const useWrenchtimeFilterStore = create<WrenchtimeFilterStore>()(
  persist(
    (set) => ({
      filterSelections: defaultFilters,
      selectedCategory: "Personal Care",
      selectedReviewedStatus: "All",
      setFilterSelections: (selections) => set({ filterSelections: selections }),
      updateFilterSelection: (field, values) =>
        set((state) => ({
          filterSelections: {
            ...state.filterSelections,
            [field]: values,
          },
        })),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSelectedReviewedStatus: (status) => set({ selectedReviewedStatus: status }),
      resetFilters: () =>
        set({
          filterSelections: defaultFilters,
          selectedCategory: "",
          selectedReviewedStatus: "All",
        }),
    }),
    {
      name: "wrenchtime-filter-storage",
      partialize: (state) => ({
        filterSelections: state.filterSelections,
        selectedCategory: state.selectedCategory,
        selectedReviewedStatus: state.selectedReviewedStatus,
      }),
    }
  )
);
