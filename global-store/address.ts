import { create } from "zustand";
import { persist } from "zustand/middleware";
import { City, Country } from "@/types/global";

interface AddressState {
  country: Country | null;
  city: City | null;
  isCountrySelectModalOpen: boolean;
  updateCountry: (country: Country) => void;
  updateCity: (city: City | null | undefined) => void;
  deleteCountry: () => void;
  openCountrySelectModal: () => void;
  closeCountrySelectModal: () => void;
}

const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      country: null,
      city: null,
      isCountrySelectModalOpen: false,
      updateCountry: (country) => set({ country }),
      updateCity: (city) => set({ city }),
      deleteCountry: () => set({ country: null }),
      openCountrySelectModal: () => set({ isCountrySelectModalOpen: true }),
      closeCountrySelectModal: () => set({ isCountrySelectModalOpen: false }),
    }),
    { name: "address" }
  )
);

export default useAddressStore;
