import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterSelections {
  [key: string]: string[];
}

interface FilterStore {
  filterSelections: FilterSelections;
  selectedCategory: string;
  selectedReviewedStatus: string;
  setFilterSelections: (selections: FilterSelections) => void;
  updateFilterSelection: (field: string, values: string[]) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedReviewedStatus: (status: string) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterSelections = {
  RECIPE_TYPE: [],
  MAKER_RESOURCE: [],
  PACKER_RESOURCE: [],
  PRODUCT_CODE: [],
  PROD_DESC: [],
  PRODUCT_VARIANT: [],
  PRODUCT_SIZE: [],
  SETUP_GROUP: [],
  tro_change: [],
};

export const useFilterStore = create<FilterStore>()(
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
      name: "filter-storage",
      partialize: (state) => ({
        filterSelections: state.filterSelections,
        selectedCategory: state.selectedCategory,
        selectedReviewedStatus: state.selectedReviewedStatus,
      }),
    }
  )
);