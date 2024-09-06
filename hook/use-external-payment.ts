import { useMutation } from "@tanstack/react-query";
import { orderService } from "@/services/order";
import NetworkError from "@/utils/network-error";
import { error } from "@/components/alert";
import { OrderCreateBody } from "@/types/order";
import { ParcelPaymentBody } from "@/types/parcel";
import { GiftCartPayBody, MembershipPayBody, WalletTopupBody } from "@/types/user";
import { BookingBookingPay } from "@/types/booking";

export const useExternalPayment = () =>
  useMutation({
    mutationFn: (body: {
      tag?: string;
      data:
        | OrderCreateBody
        | ParcelPaymentBody
        | WalletTopupBody
        | MembershipPayBody
        | GiftCartPayBody
        | BookingBookingPay;
    }) => orderService.externalPayment(body.tag, body.data),
    onSuccess: (res) => {
      window.location.replace(res.data.data.url);
    },
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });
