import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompareStoreState {
  ids: number[];
  addOrRemove: (productId: number) => void;
  clear: () => void;
}

const useCompareStore = create<CompareStoreState>()(
  persist(
    (set) => ({
      ids: [],
      addOrRemove: (productId) =>
        set((oldState) => ({
          ids: !oldState.ids.includes(productId)
            ? [...oldState.ids, productId]
            : oldState.ids.filter((oldStateId) => oldStateId !== productId),
        })),
      clear: () => set((oldState) => ({ ...oldState, ids: [] })),
    }),
    { name: "compare" }
  )
);

export default useCompareStore;
