import { Membership } from "@/types/membership";
import { useTranslation } from "react-i18next";
import { Price } from "@/components/price";
import useUserStore from "@/global-store/user";
import { Button } from "@/components/button";
import { useModal } from "@/hook/use-modal";
import { Modal } from "@/components/modal";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";

const GiftCartPayment = dynamic(
  () => import("./gift-cart-payment").then((component) => ({ default: component.GiftCartPayment })),
  {
    loading: () => <LoadingCard />,
  }
);

interface MembershipDetailProps {
  data?: Membership;
  showPayButton?: boolean;
  showSendFriendButton?: boolean;
  openSendFriendModal?: () => void;
}

export const GiftCartDetail = ({
  data,
  showPayButton = true,
  showSendFriendButton = false,
  openSendFriendModal,
}: MembershipDetailProps) => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const [isPayModalOpen, openPayModal, closePayModal] = useModal();

  const handleOpenSendFriendModal = () => {
    if (showSendFriendButton && openSendFriendModal) {
      openSendFriendModal();
    }
  };

  if (!data) return null;

  return (
    <div className="pt-16 pb-5 sm:px-12 sm:pt-20 sm:pb-16 px-4">
      <div className="flex items-center justify-between mb-3">
        <strong className="text-2xl font-semibold">{data?.translation?.title}</strong>
        <strong className="text-xl font-semibold">
          <Price number={data?.price} />
        </strong>
      </div>
      <p className="text-sm mb-3">{data?.translation?.description}</p>
      <div className="flex items-center gap-2.5 flex-wrap mb-3">
        <div className="border border-gray-field rounded-full py-2 px-5">
          <span className="text-base text-gray-field">{data?.time}</span>
        </div>
      </div>
      <p className="text-sm ">{data?.translation?.term}</p>
      {user && showPayButton && (
        <div className="mt-6">
          <Button fullWidth onClick={openPayModal}>
            {t("buy.now")}
          </Button>
        </div>
      )}
      {user && showSendFriendButton && (
        <div className="mt-6">
          <Button fullWidth onClick={handleOpenSendFriendModal}>
            {t("send.to.friend")}
          </Button>
        </div>
      )}
      <Modal isOpen={isPayModalOpen} onClose={closePayModal} withCloseButton>
        <GiftCartPayment
          giftCartId={data?.id}
          totalPrice={data?.price}
          onPaymentSuccess={closePayModal}
        />
      </Modal>
    </div>
  );
};
