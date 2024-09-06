import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LikeTypes } from "@/types/global";

interface LikeItem {
  itemId: number;
  sent: boolean;
}

interface LikeStoreState {
  list: { product: LikeItem[]; shop: LikeItem[]; master: LikeItem[] };
  likeOrDislike: (type: LikeTypes, productId: number, sent?: boolean) => void;
  markEveryItemToSent: (type: LikeTypes) => void;
  clear: (type: LikeTypes) => void;
  setMany: (type: LikeTypes, list: LikeItem[]) => void;
}

const useLikeStore = create<LikeStoreState>()(
  persist(
    (set) => ({
      list: { product: [], master: [], shop: [] },
      likeOrDislike: (type, itemId, sent = false) =>
        set((oldState) => ({
          list: {
            ...oldState.list,
            [type]: oldState.list[type].some((item) => item.itemId === itemId)
              ? oldState.list[type].filter((item) => item.itemId !== itemId)
              : [...oldState.list[type], { itemId, sent }],
          },
        })),
      markEveryItemToSent: (type) =>
        set((oldState) => ({
          list: {
            ...oldState.list,
            [type]: oldState.list[type].map((listItem) => ({ ...listItem, sent: true })),
          },
        })),
      clear: (type) => set((oldState) => ({ ...oldState, list: { ...oldState.list, [type]: [] } })),
      setMany: (type, list) => set((olState) => ({ list: { ...olState.list, [type]: list } })),
    }),
    { name: "like" }
  )
);

export default useLikeStore;
