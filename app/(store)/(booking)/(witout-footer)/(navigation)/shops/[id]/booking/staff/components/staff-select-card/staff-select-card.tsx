import { BookingService, Types } from "@/context/booking/booking.reducer";
import { useModal } from "@/hook/use-modal";
import { useTranslation } from "react-i18next";
import UserLineIcon from "remixicon-react/UserLineIcon";
import AnchorDownIcon from "@/assets/icons/anchor-down";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import { Modal } from "@/components/modal";
import { useBooking } from "@/context/booking";
import { useCallback } from "react";
import { Master } from "@/types/master";
import Image from "next/image";

const StaffSelect = dynamic(
  () => import("../staff-select").then((component) => ({ default: component.StaffSelect })),
  {
    loading: () => <LoadingCard />,
  }
);

interface StaffSelectCardProps {
  data: BookingService;
}

export const StaffSelectCard = ({ data }: StaffSelectCardProps) => {
  const [isSelectModalOpen, openSelectModal, closeSelectModal] = useModal();
  const { dispatch } = useBooking();
  const { t } = useTranslation();

  const handleSelectStaff = useCallback(
    (master: Master) => {
      dispatch({ type: Types.SelectMasterForService, payload: { serviceId: data.id, master } });
      closeSelectModal();
    },
    [dispatch, data.id, closeSelectModal]
  );
  return (
    <div className="rounded-button border border-gray-link p-4">
      <p className="text-xl font-semibold">{data.translation?.title}</p>
      <span className="text-gray-field font-medium text-base">
        {data.interval}
        {t("min")}
      </span>

      <button
        onClick={openSelectModal}
        className="py-1 pl-1 pr-3 rtl:pr-1 rtl:pl-3 rounded-full flex items-center justify-between border border-gray-link gap-4 mt-4 hover:bg-gray-link active:bg-gray-border outline-none focus-ring"
      >
        <div className="flex items-center gap-2">
          {data.master ? (
            <div className="w-10 h-10 relative ">
              <Image
                src={data.master.img}
                className="object-cover rounded-full"
                alt={data.master.firstname || "master"}
                fill
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center ">
              <UserLineIcon />
            </div>
          )}
          <span className="text-base font-medium">
            {data.master ? data.master?.firstname : t("select.master")}
          </span>
        </div>
        <AnchorDownIcon />
      </button>
      <Modal withCloseButton size="large" isOpen={isSelectModalOpen} onClose={closeSelectModal}>
        <StaffSelect
          selectedMasterId={data.master?.id}
          serviceTitle={data.translation?.title}
          shopId={data.shop_id}
          onSelect={handleSelectStaff}
          serviceId={data.id}
        />
      </Modal>
    </div>
  );
};
