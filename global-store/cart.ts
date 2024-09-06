import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartProduct {
  stockId: number;
  quantity: number;
  image?: string;
  cartDetailId?: number;
}

interface CartState {
  list: CartProduct[];
  addProduct: (stockId: number, quantity?: number, image?: string) => void;
  increment: (stockId: number, quantity?: number) => void;
  decrement: (stockId: number) => void;
  delete: (stockId: number) => void;
  clear: () => void;
  updateList: (list: CartProduct[]) => void;
  updateCount: (stockId: number, quantity: number) => void;
  memberCartId: number | null;
  userCartUuid: string | null;
  updateMemberData: (cartId: number, userUuid: string) => void;
  deleteMemberData: () => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      list: [],
      memberCartId: null,
      userCartUuid: null,
      addProduct: (stockId, quantity = 1, image = undefined) =>
        set((oldState) => ({ list: [...oldState.list, { stockId, quantity, image }] })),
      increment: (stockId, quantity = 1) =>
        set((oldState) => ({
          list: oldState.list.map((cartProduct) => {
            if (cartProduct.stockId === stockId) {
              return { stockId: cartProduct.stockId, quantity: cartProduct.quantity + quantity };
            }
            return cartProduct;
          }),
        })),
      decrement: (stockId, quantity = 1) =>
        set((oldState) => ({
          list: oldState.list.map((cartProduct) => {
            if (cartProduct.stockId === stockId) {
              return { stockId: cartProduct.stockId, quantity: cartProduct.quantity - quantity };
            }
            return cartProduct;
          }),
        })),
      delete: (stockId) =>
        set((oldState) => ({
          list: oldState.list.filter((cartProduct) => cartProduct.stockId !== stockId),
        })),
      updateCount: (stockId, quantity) =>
        set((oldState) => ({
          list: oldState.list.map((product) => {
            if (product.stockId === stockId) {
              return { ...product, quantity };
            }
            return product;
          }),
        })),
      clear: () => set({ list: [] }),
      updateList: (products) => set({ list: products }),
      updateMemberData: (cartId, userUuid) => set({ memberCartId: cartId, userCartUuid: userUuid }),
      deleteMemberData: () => set({ memberCartId: null, userCartUuid: null }),
    }),
    { name: "cart" }
  )
);

export default useCartStore;
