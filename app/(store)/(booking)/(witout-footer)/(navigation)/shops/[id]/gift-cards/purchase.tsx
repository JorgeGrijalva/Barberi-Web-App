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
import { Shop } from "@/types/shop";
import { createMapUrl } from "@/utils/create-map-url";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

interface GiftCardPurchaseProps {
  data?: Shop;
}

const GiftCartPayment = dynamic(
  () =>
    import("@/components/gift-cart/gift-cart-payment").then((component) => ({
      default: component.GiftCartPayment,
    })),
  {
    loading: () => <LoadingCard />,
  }
);
export const GiftCardPurchase = ({ data }: GiftCardPurchaseProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { state } = useBooking();
  const [isPaymentModalOpen, openPaymentModal, closePaymentModal] = useModal();
  const user = useUserStore((val) => val.user);
  const handleBuyNow = () => {
    if (user) {
      openPaymentModal();
    } else {
      error(t("please.login.first"));
      router.push("/login");
    }
  };
  return (
    <div className="fixed lg:static bottom-0 w-screen lg:w-auto left-0 lg:rounded-button rounded-t-button py-5 lg:px-5 px-4 lg:border border-gray-link shadow-fixedBooking lg:shadow-none bg-white">
      <div className="hidden lg:flex items-center gap-4 border-b border-gray-link pb-7">
        <div className="w-20 h-20 relative rounded-full border border-gray-link aspect-square ">
          <ImageWithFallBack
            src={data?.logo_img || ""}
            alt={data?.translation?.title || "shop"}
            fill
            className="object-contain rounded-full w-20 h-20"
          />
        </div>
        <div>
          <h2 className="text-[28px] font-semibold">{data?.translation?.title}</h2>
          <Link
            className="flex items-start gap-1"
            href={createMapUrl(data?.lat_long.latitude, data?.lat_long.longitude)}
            target="_blank"
          >
            <MapPinIcon />
            <p className="text-sm line-clamp-2">{data?.translation?.address}</p>
          </Link>
        </div>
      </div>
      {state.giftCardForPurchase && (
        <div className="flex items-center justify-between py-4 border-b border-gray-link">
          <div>
            <p className="text-xl font-semibold">{state.giftCardForPurchase.translation?.title}</p>
            <span className="text-base text-gray-field font-medium">
              {t("valid.for")} {state.giftCardForPurchase.time}
            </span>
          </div>
          <p className="text-xl font-semibold whitespace-nowrap">
            <Price number={state.giftCardForPurchase?.price} />
          </p>
        </div>
      )}
      <div className="hidden lg:flex items-center justify-between py-7 text-[26px] font-semibold">
        <strong>{t("total")}</strong>
        <strong>
          <Price number={state.giftCardForPurchase?.price ?? 0} />
        </strong>
      </div>
      <Button
        onClick={handleBuyNow}
        disabled={!state.giftCardForPurchase}
        color="black"
        fullWidth
        size="medium"
      >
        {t("buy.now")}
      </Button>
      <Modal isOpen={isPaymentModalOpen} onClose={closePaymentModal} withCloseButton>
        <GiftCartPayment
          giftCartId={state.giftCardForPurchase?.id}
          totalPrice={state.giftCardForPurchase?.price}
          onPaymentSuccess={closePaymentModal}
        />
      </Modal>
    </div>
  );
};
