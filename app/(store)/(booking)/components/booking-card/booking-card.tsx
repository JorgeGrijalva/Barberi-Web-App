import { Booking } from "@/types/booking";
import clsx from "clsx";
import { ImageWithFallBack } from "@/components/image";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/hook/use-settings";
import { Menu, Transition } from "@headlessui/react";
import ThreeDotIcon from "@/assets/icons/three-dot";
import { Fragment } from "react";
import CalendarCheckIcon from "@/assets/icons/calendar-check";
import { IconButton } from "@/components/icon-button";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import { useModal } from "@/hook/use-modal";
import { Modal } from "@/components/modal";
import { ConfirmModal } from "@/components/confirm-modal";
import CrossOutlinedIcon from "@/assets/icons/cross-outlined";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/booking";
import { error, success } from "@/components/alert";
import NetworkError from "@/utils/network-error";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import VerifiedIcon from "@/assets/icons/verified";

dayjs.extend(utc);

const AddtoCalendar = dynamic(
  () => import("../add-to-calendar").then((component) => ({ default: component.AddToCalendar })),
  {
    loading: () => <LoadingCard />,
  }
);

interface BookingCardProps {
  data: Booking;
  isPast?: boolean;
  onClick: () => void;
  onCancelSuccessful: () => void;
  showOptions?: boolean;
}

export const BookingCard = ({
  data,
  isPast,
  onClick,
  onCancelSuccessful,
  showOptions = true,
}: BookingCardProps) => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const [addtoCalendarModalOpen, openAddtoCalendarModal, closeAddtoCalendarModal] = useModal();
  const [isCancelModalOpen, openCancelModal, closeCancelModal] = useModal();
  const queryClint = useQueryClient();
  const { mutate: cancel, isLoading: isCancelling } = useMutation({
    mutationFn: () => bookingService.cancel(data.id),
    onSuccess: () => {
      closeCancelModal();
      success(t("successfully.canceled"));
      onCancelSuccessful();
      queryClint.invalidateQueries(["appointment", data.id, language?.locale]);
      queryClint.invalidateQueries(["appointments", language?.locale]);
    },
    onError: (err: NetworkError) => {
      error(err?.message);
    },
  });

  const handleCancelBooking = () => {
    cancel();
  };
  return (
    <button
      onClick={onClick}
      className={clsx(
        "p-2.5 rounded-button border flex justify-between",
        isPast ? "border-gray-link" : "border-dark"
      )}
    >
      <div className="flex items-center md:gap-4 gap-2.5 md:py-5 py-2.5 md:px-2.5 px-0.5">
        <div className="relative xl:w-20 xl:h-20 w-14 h-14 aspect-square">
          <ImageWithFallBack
            src={data.shop?.logo_img || ""}
            alt={data.shop?.translation?.title || "shop"}
            fill
            className="object-cover rounded-full"
          />
        </div>
        <div className="text-start">
          <div className="flex items-center gap-2">
            <p
              className={clsx(
                "xl:text-3xl font-semibold md:text-2xl text-xl",
                data?.shop?.verify && "line-clamp-1"
              )}
            >
              {data.shop?.translation?.title}
            </p>
            {data?.shop?.verify && (
              <span>
                <VerifiedIcon />
              </span>
            )}
          </div>
          <span className="xl:text-base md:text-sm text-xs font-medium text-gray-field">
            {dayjs.utc(data.start_date).format("DD MMM, YYYY")} {t("at")}{" "}
            {dayjs.utc(data.start_date).format("HH:mm")}
          </span>
        </div>
      </div>
      {showOptions && (
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button as={Fragment}>
              <IconButton onClick={(e) => e.stopPropagation()}>
                <ThreeDotIcon />
              </IconButton>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white drop-shadow-lg  focus:outline-none z-10">
              <div className="px-1 py-1 ">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddtoCalendarModal();
                      }}
                      className={`${
                        active ? "bg-primary text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm gap-3`}
                    >
                      <CalendarCheckIcon />
                      {t("add.to.calendar")}
                    </button>
                  )}
                </Menu.Item>
                {!data.canceled_all && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openCancelModal();
                        }}
                        className={`${
                          active ? "bg-primary text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm gap-3`}
                      >
                        <CrossOutlinedIcon size={24} />
                        {t("cancel")}
                      </button>
                    )}
                  </Menu.Item>
                )}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
      <Modal isOpen={addtoCalendarModalOpen} onClose={closeAddtoCalendarModal} withCloseButton>
        <AddtoCalendar data={data} />
      </Modal>
      <ConfirmModal
        text="are.you.sure.want.to.cancel"
        onConfirm={handleCancelBooking}
        onCancel={closeCancelModal}
        isOpen={isCancelModalOpen}
        loading={isCancelling}
      />
    </button>
  );
};
