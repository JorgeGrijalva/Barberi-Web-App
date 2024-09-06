import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Price } from "@/components/price";
import dayjs from "dayjs";
import clsx from "clsx";
import React from "react";
import { CartTotal } from "@/components/cart-total";
import { parcelService } from "@/services/parcel";
import CheckDoubleFillIcon from "remixicon-react/CheckDoubleFillIcon";
import SurveyFillIcon from "remixicon-react/SurveyFillIcon";
import TruckFillIcon from "remixicon-react/TruckFillIcon";
import FlagFillIcon from "remixicon-react/FlagFillIcon";
import CrossIcon from "@/assets/icons/cross";
import MapPinRangeLineIcon from "remixicon-react/MapPinRangeLineIcon";
import { Modal } from "@/components/modal";
import dynamic from "next/dynamic";
import NetworkError from "@/utils/network-error";
import { error } from "@/components/alert";
import { useModal } from "@/hook/use-modal";
import { Button } from "@/components/button";
import { ConfirmModal } from "@/components/confirm-modal";
import Image from "next/image";
import { IconButton } from "@/components/icon-button";
import PhoneFillIcon from "remixicon-react/PhoneFillIcon";
import Chat1FillIcon from "remixicon-react/Chat1FillIcon";
import { ProfilePlaceholder } from "../profile-placeholder";

const ParcelMap = dynamic(() =>
  import("@/components/parcel-map").then((component) => ({ default: component.ParcelMap }))
);

const parcelProgress: Record<string, { step: number; icon: React.ReactElement }> = {
  new: {
    step: 1,
    icon: <SurveyFillIcon />,
  },
  accepted: {
    step: 1,
    icon: <SurveyFillIcon />,
  },
  ready: {
    step: 2,
    icon: <CheckDoubleFillIcon />,
  },
  on_a_way: {
    step: 3,
    icon: <TruckFillIcon />,
  },
  delivered: {
    step: 4,
    icon: <FlagFillIcon />,
  },
  canceled: {
    step: 0,
    icon: <CrossIcon />,
  },
};

const ParcelDetail = ({ id }: { id?: number | null }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data, refetch } = useQuery(["parcel", id], () => parcelService.get(id), {
    suspense: true,
    enabled: !!id,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });
  const parcelDetail = data?.data;
  const [isAddressModalOpen, openAddressModal, closeAddressModal] = useModal();
  const [confirmModalOpen, openConfirmModal, closeConfirmModal] = useModal();
  const { mutate: cancelParcel, isLoading: isCanceling } = useMutation({
    mutationFn: () => parcelService.cancel(data?.data.id),
    onError: (err: NetworkError) => error(err.message),
    onSuccess: () => {
      refetch();
      closeConfirmModal();
      queryClient.invalidateQueries(["activeParcels"]);
      queryClient.invalidateQueries(["parcelHistory"]);
    },
  });

  const handleCancelParcel = () => {
    cancelParcel();
  };
  return (
    <div className="p-5">
      <div className="flex items-center gap-2.5">
        <div className="text-xl font-bold">#{parcelDetail?.id}</div>
        <div className="bg-primary rounded-full flex items-center">
          <span className="text-white text-xs px-2 py-0.5">{t(parcelDetail?.status || "")}</span>
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-[18px] bg-white bg-opacity-30 rounded-2xl mt-7 mb-2.5">
        <div className="text-sm font-semibold">
          <Price customCurrency={parcelDetail?.currency} number={parcelDetail?.total_price} />
        </div>
        <div className="w-1 h-1 rounded-full bg-gray-field" />
        <span className="text-sm font-medium">{parcelDetail?.type?.type}</span>

        <div className="w-1 h-1 rounded-full bg-gray-field" />
        <span className="text-sm font-medium">{parcelDetail?.delivery_date}</span>
      </div>
      <div className="px-4 pt-[22px] pb-4 bg-white bg-opacity-30 rounded-2xl">
        <span className="text-base font-semibold">{t("process")}</span>
        <div className="bg-white dark:bg-dark rounded-2xl p-2.5 flex items-center gap-3">
          <div
            className={clsx(
              "flex items-center justify-center rounded-full drop-shadow-green  h-full aspect-square p-3 text-white",
              parcelDetail?.status === "canceled" ? "bg-red" : "bg-green"
            )}
          >
            {parcelDetail && parcelProgress[parcelDetail.status].icon}
          </div>
          <div className="flex flex-col flex-1 gap-2">
            <strong className="text-xs font-bold">
              {t(parcelDetail?.status || "")} -{" "}
              {dayjs(parcelDetail?.delivery_date).format("MMM DD, YYYY - HH:mm")}
            </strong>
            <div className="flex items-center justify-between gap-2">
              {Array.from(Array(4).keys()).map((progressItem) => (
                <div
                  key={progressItem}
                  className={clsx(
                    parcelDetail &&
                      parcelDetail.status !== "canceled" &&
                      parcelProgress[parcelDetail.status].step >= progressItem + 1
                      ? "bg-green"
                      : "bg-gray-progress",
                    parcelDetail?.status === "canceled" && "bg-red",
                    "flex-1 rounded-full h-3"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {parcelDetail?.deliveryman && (
        <div className="p-2.5 bg-white bg-opacity-30 rounded-2xl mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {parcelDetail?.deliveryman.img ? (
              <Image
                width={50}
                height={50}
                className="rounded-full aspect-square"
                src={parcelDetail?.deliveryman.img}
                alt={parcelDetail?.deliveryman?.firstname || ""}
              />
            ) : (
              <ProfilePlaceholder size={50} name={parcelDetail?.deliveryman?.firstname} />
            )}
            <div>
              <div className="text-lg font-semibold">
                {parcelDetail?.deliveryman.firstname} {parcelDetail?.deliveryman.lastname}
              </div>
              <span className="text-gray-field">{t("driver")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`tel:${parcelDetail?.deliveryman.phone}`}>
              <IconButton color="black" size="large" rounded>
                <PhoneFillIcon />
              </IconButton>
            </a>
            <a href={`sms:${parcelDetail?.deliveryman.phone}`}>
              <IconButton color="primary" size="large" rounded>
                <Chat1FillIcon />
              </IconButton>
            </a>
          </div>
        </div>
      )}
      <button
        onClick={openAddressModal}
        className="px-2.5 py-4  bg-white bg-opacity-30 rounded-2xl flex items-center gap-2.5 my-4 w-full"
      >
        <div className="w-10 h-10 aspect-square text-white rounded-full bg-dark flex items-center justify-center">
          <MapPinRangeLineIcon />
        </div>
        <div className="text-start">
          <div className="text-sm font-semibold">{t("delivery.location")}</div>
          <span className="text-xs line-clamp-1">{parcelDetail?.address_to?.address}</span>
        </div>
      </button>
      <span className="text-sm italic mt-2.5">{parcelDetail?.note}</span>
      <CartTotal
        couponStyle={false}
        totals={{
          total_price: parcelDetail?.total_price,
        }}
      />
      {parcelDetail?.status === "new" && (
        <Button
          className="mt-2"
          color="black"
          loading={isCanceling}
          onClick={openConfirmModal}
          fullWidth
        >
          {t("cancel")}
        </Button>
      )}
      <ConfirmModal
        text="are.you.sure.want.to.cancel"
        onCancel={closeConfirmModal}
        onConfirm={handleCancelParcel}
        isOpen={confirmModalOpen}
        loading={isCanceling}
      />
      {parcelDetail && (
        <Modal withCloseButton isOpen={isAddressModalOpen} onClose={closeAddressModal}>
          <div className="p-5">
            <div className="text-xl font-semibold mb-4">{t("delivery.location")}</div>
            <div className="w-full" style={{ height: "400px" }}>
              <ParcelMap
                locationFrom={{
                  lat: Number(parcelDetail.address_from?.latitude),
                  lng: Number(parcelDetail.address_from?.longitude),
                }}
                locationTo={{
                  lat: Number(parcelDetail.address_to?.latitude),
                  lng: Number(parcelDetail.address_to?.longitude),
                }}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ParcelDetail;
