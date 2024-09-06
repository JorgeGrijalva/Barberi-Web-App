"use client";

import { useBooking } from "@/context/booking";
import { BookingDateTime } from "../../components/date-time";

export const BookingDate = ({ shopSlug }: { shopSlug?: string }) => {
  const { state } = useBooking();
  return <BookingDateTime shopSlug={shopSlug} serviceMasterId={state.master?.service_master?.id} />;
};
