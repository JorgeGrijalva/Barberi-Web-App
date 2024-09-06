"use client";

import useUserStore from "@/global-store/user";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/booking";

const PaymentList = dynamic(
  () =>
    import("./components/payment-list").then((component) => ({
      default: component.BookingPaymentList,
    })),
  {
    loading: () => <LoadingCard />,
  }
);
const Auth = dynamic(() => import("@/components/auth"), {
  loading: () => <LoadingCard />,
});

interface ProtectedPaymentProps {
  shopSlug?: string;
}

export const ProtectedPayment = ({ shopSlug }: ProtectedPaymentProps) => {
  const user = useUserStore((state) => state.user);
  const { state } = useBooking();
  const router = useRouter();
  useEffect(() => {
    if (!state.time && shopSlug) {
      router.replace(`/shops/${shopSlug}/booking`);
    }
  }, [state.time, shopSlug]);
  if (user) return <PaymentList />;
  return (
    <div className="grid xl:grid-cols-2 grid-cols-1">
      <div className="lg:border lg:p-5 border-gray-link rounded-button">
        <Auth defaultView="LOGIN" redirectOnSuccess={false} />
      </div>
    </div>
  );
};
