"use client";

import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import useAddressStore from "@/global-store/address";
import { Modal } from "@/components/modal";

const CountrySelectPanel = dynamic(() => import("./country-select-panel"), {
  loading: () => <LoadingCard />,
});
export const CountrySelect = ({ settings }: { settings: Record<string, string> }) => {
  const isCountrySelectModalOpen = useAddressStore((state) => state.isCountrySelectModalOpen);
  const closeCountrySelectModal = useAddressStore((state) => state.closeCountrySelectModal);
  const country = useAddressStore((state) => state.country);
  const isModalOpen = isCountrySelectModalOpen || !country?.id;
  return (
    <Modal
      size="large"
      isOpen={isModalOpen}
      onClose={closeCountrySelectModal}
      withCloseButton={false}
      overflowHidden={false}
    >
      <CountrySelectPanel settings={settings} />
    </Modal>
  );
};
