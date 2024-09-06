"use client";

import { BookingTotal } from "@/app/(store)/(booking)/(witout-footer)/(navigation)/shops/[id]/components/booking-total";
import { DefaultResponse } from "@/types/global";
import { Shop } from "@/types/shop";
import { useCallback, useState } from "react";
import { Booking, BookingCreateBody } from "@/types/booking";
import dayjs from "dayjs";
import { useBooking } from "@/context/booking";
import { useSettings } from "@/hook/use-settings";
import { useMutation } from "@tanstack/react-query";
import { bookingService } from "@/services/booking";
import NetworkError from "@/utils/network-error";
import { error } from "@/components/alert";
import { Modal } from "@/components/modal";
import { BookingDetail } from "@/app/(store)/(booking)/components/booking-detail";
import { useRouter } from "next/navigation";

interface PaymentFinishProps {
  shop: DefaultResponse<Shop>;
}

const PaymentFinish = ({ shop }: PaymentFinishProps) => {
  const router = useRouter();
  const { state } = useBooking();
  const { currency } = useSettings();
  const [orderDetail, setOrderDetail] = useState<Booking[] | undefined>();

  const { mutate: createBooking, isLoading } = useMutation({
    mutationFn: (body: BookingCreateBody) => bookingService.create(body),
    onSuccess: (res) => {
      setOrderDetail(res.data);
    },
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });
  const handleClose = () => {
    setOrderDetail(undefined);
    router.replace("/appointments");
  };

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
  return (
    <>
      <BookingTotal
        onClick={handleCreateBooking}
        data={shop}
        nextPage="/booking/payment"
        runCalculate
        isLoading={isLoading}
        checkNotePageAuth
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

export default PaymentFinish;
