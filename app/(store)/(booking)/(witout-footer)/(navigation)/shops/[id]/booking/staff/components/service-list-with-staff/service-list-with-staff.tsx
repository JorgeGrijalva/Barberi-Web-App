"use client";

import { useBooking } from "@/context/booking";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StaffSelectCard } from "../staff-select-card";

interface ServiceListWithStaffProps {
  shopSlug?: string;
}

export const ServiceListWithStaff = ({ shopSlug }: ServiceListWithStaffProps) => {
  const { state } = useBooking();
  const router = useRouter();
  useEffect(() => {
    if (state.services.length === 0) {
      router.replace(`/shops/${shopSlug}/booking`);
    }
  }, [state.services.length]);
  return (
    <div className="flex flex-col gap-2 mt-7">
      {state.services.map((service) => (
        <StaffSelectCard data={service} key={service.id} />
      ))}
    </div>
  );
};
