"use client";

import { Shop } from "@/types/shop";
import { BookingTotal } from "@/app/(store)/(booking)/(witout-footer)/(navigation)/shops/[id]/components/booking-total";
import { DefaultResponse } from "@/types/global";
import { useMutation } from "@tanstack/react-query";
import { Booking, BookingCreateBody } from "@/types/booking";
import { bookingService } from "@/services/booking";
import { useBooking } from "@/context/booking";
import { useSettings } from "@/hook/use-settings";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { Modal } from "@/components/modal";
import { LoadingCard } from "@/components/loading";
import utc from "dayjs/plugin/utc";
import { useRouter } from "next/navigation";
import NetworkError from "@/utils/network-error";
import { error } from "@/components/alert";
import { useExternalPayment } from "@/hook/use-external-payment";

dayjs.extend(utc);

const BookingDetail = dynamic(
  () =>
    import("@/app/(store)/(booking)/components/booking-detail").then((component) => ({
      default: component.BookingDetail,
    })),
  {
    loading: () => <LoadingCard />,
  }
);

interface PaymentFinishProps {
  shop?: DefaultResponse<Shop>;
}

export const PaymentFinish = ({ shop }: PaymentFinishProps) => {
  const router = useRouter();
  const { state } = useBooking();
  const { currency } = useSettings();
  const [orderDetail, setOrderDetail] = useState<Booking[] | undefined>();
  const { mutate: createPaymentProcess } = useExternalPayment();
  const { mutate: createBooking, isLoading } = useMutation({
    mutationFn: (body: BookingCreateBody) => bookingService.create(body),
    onSuccess: (res) => {
      setOrderDetail(res.data);
      if (state?.payment?.tag !== "cash" && state?.payment?.tag !== "wallet") {
        createPaymentProcess({
          tag: state.payment?.tag,
          data: {
            booking_id: res?.data?.[0]?.parent_id || res?.data?.[0]?.id,
          },
        });
      }
    },
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });

  const handleCreateBooking = useCallback(() => {
    const body: BookingCreateBody = {
      data: state.services.map((service) => ({
        service_master_id: service.master?.service_master?.id,
        note: service.note,
        data: service.type === "offline_out" ? state.address : undefined,
        user_member_ship_id: service.userMemberShipId,
        service_extras: service?.selected_extra_ids?.length
          ? service?.selected_extra_ids
          : undefined,
      })),
      currency_id: currency?.id,
      payment_id: state.payment?.id,
      start_date: `${dayjs(state.date).format("YYYY-MM-DD")} ${state.time}`,
      user_gift_cart_id: state.giftCart?.shopGiftCartId,
      coupon: state.coupon,
    };
    createBooking(body);
  }, [state]);

  const handleClose = () => {
    setOrderDetail(undefined);
    router.replace("/appointments");
  };

  return (
    <>
      <BookingTotal
        checkPayment
        isLoading={isLoading}
        data={shop}
        onClick={handleCreateBooking}
        showCoupon
        runCalculate
      />
      <Modal isOpen={!!orderDetail} onClose={handleClose} withCloseButton>
        <BookingDetail
          data={orderDetail}
          id={orderDetail?.[0]?.parent_id || orderDetail?.[0]?.id}
        />
      </Modal>
    </>
  );
};
