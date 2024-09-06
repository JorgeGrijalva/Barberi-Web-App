import { useState } from "react";
import { Modal } from "@/components/modal";
import { ParcelAddress } from "@/types/parcel";
import clsx from "clsx";
import { AddressSelect } from "../address-select";

interface AddressButtonProps extends ParcelAddress {
  label: string;
  onChange: (value: ParcelAddress) => void;
  required?: boolean;
  error?: string;
}

export const AddressButton = ({
  address,
  location,
  label,
  onChange,
  required,
  error,
}: AddressButtonProps) => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  return (
    <>
      <div className="flex flex-col">
        <span className="text-sm mb-1">
          {label}
          {required && "*"}
        </span>
        <button
          type="button"
          onClick={() => setIsAddressModalOpen(true)}
          className="rounded-2xl border border-gray-inputBorder px-4 py-[11px] text-sm text-start inline-flex items-center justify-between"
        >
          <span className={clsx("line-clamp-1", !address && "text-gray-field")}>
            {address || label}
          </span>
        </button>
        {error && (
          <p role="alert" className="text-sm text-red mt-1">
            {error}
          </p>
        )}
      </div>
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        withCloseButton
      >
        <AddressSelect
          onSave={(value) => {
            onChange(value);
            setIsAddressModalOpen(false);
          }}
          address={address}
          location={location}
        />
      </Modal>
    </>
  );
};
