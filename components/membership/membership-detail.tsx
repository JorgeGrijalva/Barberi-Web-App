import { MembershipBase } from "@/types/membership";
import { useTranslation } from "react-i18next";
import { Price } from "@/components/price";
import useUserStore from "@/global-store/user";
import { Button } from "@/components/button";
import { useModal } from "@/hook/use-modal";
import { Modal } from "@/components/modal";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";

const MembershipPayment = dynamic(
  () =>
    import("./membership-payment").then((component) => ({ default: component.MembershipPayment })),
  {
    loading: () => <LoadingCard />,
  }
);

interface MembershipDetailProps {
  data?: MembershipBase;
  showPayButton?: boolean;
}

export const MembershipDetail = ({ data, showPayButton = true }: MembershipDetailProps) => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const [isPayModalOpen, openPayModal, closePayModal] = useModal();

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
        <div className="border border-gray-field rounded-full py-2 px-5">
          {data?.sessions === 1 ? (
            <span className="text-base text-gray-field">
              {`${data?.sessions_count} / ${data?.remainderSessions}`} {t("count")}
            </span>
          ) : (
            <span className="text-base text-gray-field">{t("unlimited")}</span>
          )}
        </div>
      </div>
      <p className="text-sm ">{data?.translation?.term}</p>
      <p className="mt-3">
        {t("services")}:{" "}
        {data?.services.map((service) => service.service?.translation?.title || "").join(", ")}
      </p>
      {user && showPayButton && (
        <div className="mt-6">
          <Button fullWidth onClick={openPayModal}>
            {t("buy.now")}
          </Button>
        </div>
      )}
      <Modal isOpen={isPayModalOpen} onClose={closePayModal} withCloseButton>
        <MembershipPayment
          membershipId={data?.id}
          totalPrice={data?.price}
          onPaymentSuccess={closePayModal}
        />
      </Modal>
    </div>
  );
};
