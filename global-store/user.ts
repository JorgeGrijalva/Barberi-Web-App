import { UserDetail } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStoreState {
  user: UserDetail | null;
  signIn: (user: UserDetail) => void;
  signOut: () => void;
}

const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      user: null,
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
    }),
    { name: "user" }
  )
);

export const userActionOutsideOfComponent = useUserStore.setState;

export default useUserStore;
