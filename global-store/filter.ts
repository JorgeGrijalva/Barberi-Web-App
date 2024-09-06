import { create } from "zustand";

interface FilterStoreState {
  productVariant: string;
  updateProductVariant: (value: string) => void;
}

const useFilterStore = create<FilterStoreState>((set) => ({
  productVariant: "4",
  updateProductVariant: (value) => set({ productVariant: value }),
}));

export default useFilterStore;
