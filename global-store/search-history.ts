import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchHistoryState {
  list: string[];
  addToList: (query: string) => void;
  deleteFromList: (query: string) => void;
  clear: () => void;
}

const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      list: [],
      addToList: (query) =>
        set((oldState) => ({
          list: oldState.list.includes(query) ? oldState.list : [...oldState.list, query],
        })),
      deleteFromList: (query) =>
        set((oldState) => ({
          list: oldState.list.filter((oldStateQuery) => oldStateQuery !== query),
        })),
      clear: () => set((oldState) => ({ ...oldState, list: [] })),
    }),
    { name: "searchHistory" }
  )
);

export default useSearchHistoryStore;
