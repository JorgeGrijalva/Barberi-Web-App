"use client";

import MapPinIcon from "@/assets/icons/map-pin";
import { error } from "@/components/alert";
import { Button } from "@/components/button";
import { ImageWithFallBack } from "@/components/image";
import { LoadingCard } from "@/components/loading";
import { Modal } from "@/components/modal";
import { Price } from "@/components/price";
import { useBooking } from "@/context/booking";
import useUserStore from "@/global-store/user";
import { useModal } from "@/hook/use-modal";
import { MembershipDetail } from "@/types/membership";
import { createMapUrl } from "@/utils/create-map-url";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface MembershipPurchaseProps {
  data?: MembershipDetail;
}

const MembershipPayment = dynamic(
  () =>
    import("@/components/membership/membership-payment").then((component) => ({
      default: component.MembershipPayment,
    })),
  {
    loading: () => <LoadingCard />,
  }
);
export const MembershipPurchase = ({ data }: MembershipPurchaseProps) => {
  const { t } = useTranslation();
  const { state } = useBooking();
  const [isPaymentModalOpen, openPaymentModal, closePaymentModal] = useModal();
  const user = useUserStore((val) => val.user);
  return (
    <div className="fixed lg:static bottom-0 w-screen lg:w-auto left-0 lg:rounded-button rounded-t-button py-5 lg:px-5 px-4 lg:border border-gray-link shadow-fixedBooking lg:shadow-none bg-white">
      <div className="hidden lg:flex items-center gap-4 border-b border-gray-link pb-7">
        <div className="w-20 h-20 relative rounded-full border border-gray-link aspect-square ">
          <ImageWithFallBack
            src={data?.shop?.logo_img || ""}
            alt={data?.shop?.translation?.title || "shop"}
            fill
            className="object-contain rounded-full w-20 h-20"
          />
        </div>
        <div>
          <h2 className="text-[28px] font-semibold">{data?.shop?.translation?.title}</h2>
          <Link
            className="flex items-start gap-1"
            href={createMapUrl(data?.shop?.lat_long.latitude, data?.shop?.lat_long.longitude)}
            target="_blank"
          >
            <MapPinIcon />
            <p className="text-sm line-clamp-2">{data?.shop?.translation?.address}</p>
          </Link>
        </div>
      </div>
      {data && (
        <div className="flex items-center justify-between py-4 border-b border-gray-link">
          <div>
            <p className="text-xl font-semibold">{data?.translation?.title}</p>
            <span className="text-base text-gray-field font-medium">
              {t("valid.for")} {data.time}
            </span>
          </div>
          <p className="text-xl font-semibold whitespace-nowrap">
            <Price number={data?.price} />
          </p>
        </div>
      )}
      <div className="hidden lg:flex items-center justify-between py-7 text-[26px] font-semibold">
        <strong>{t("total")}</strong>
        <strong>
          <Price number={data?.price ?? 0} />
        </strong>
      </div>
      <Button
        onClick={() => (user ? openPaymentModal() : error(t("please.login.first")))}
        disabled={!data}
        color="black"
        fullWidth
        size="medium"
      >
        {t("buy.now")}
      </Button>
      <Modal isOpen={isPaymentModalOpen} onClose={closePaymentModal} withCloseButton>
        <MembershipPayment
          membershipId={data?.id}
          totalPrice={state.giftCardForPurchase?.price}
          onPaymentSuccess={closePaymentModal}
        />
      </Modal>
    </div>
  );
};
