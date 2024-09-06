"use client";

import { useBooking } from "@/context/booking";
import { Payment } from "@/types/global";
import { Types } from "@/context/booking/booking.reducer";
import { PaymentList } from "@/components/payment-list";

export const BookingPaymentList = () => {
  const { state, dispatch } = useBooking();

  const handleChangePayment = (value: Payment) => {
    dispatch({ type: Types.SetPayment, payload: value });
  };

  return <PaymentList onChange={handleChangePayment} value={state.payment} />;
};
