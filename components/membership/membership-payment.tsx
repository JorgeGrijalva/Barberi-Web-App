import { useState } from "react";
import { Payment } from "@/types/global";
import { PaymentList } from "@/components/payment-list";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { orderService } from "@/services/order";
import { useSettings } from "@/hook/use-settings";
import { useExternalPayment } from "@/hook/use-external-payment";
import NetworkError from "@/utils/network-error";
import { error, success } from "@/components/alert";

interface MembershipPaymentProps {
  membershipId?: number;
  totalPrice?: number;
  onPaymentSuccess: () => void;
}

export const MembershipPayment = ({
  membershipId,
  totalPrice,
  onPaymentSuccess,
}: MembershipPaymentProps) => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | undefined>();
  const { currency } = useSettings();
  const { t } = useTranslation();
  const { mutate: createTransaction, isLoading: isTransactionCreating } = useMutation({
    mutationFn: (body: { id: number; paymentId: number }) =>
      orderService.createMembershipTransaction(body.id, { payment_sys_id: body.paymentId }),
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });
  const { mutate: createPaymentProcess, isLoading: isCreatingPaymentProcess } =
    useExternalPayment();
  const handleBuy = () => {
    if (selectedPayment?.tag === "wallet" && !!membershipId) {
      createTransaction(
        { id: membershipId, paymentId: selectedPayment.id },
        {
          onSuccess: () => {
            success(t("successful.transaction"));
            onPaymentSuccess();
          },
        }
      );
    }
    if (!selectedPayment) return;
    if (selectedPayment?.tag !== "wallet" && !!membershipId) {
      createPaymentProcess(
        {
          tag: selectedPayment.tag,
          data: {
            member_ship_id: membershipId,
            currency_id: currency?.id,
            total_price: totalPrice,
          },
        },
        {
          onSuccess: () => {
            onPaymentSuccess();
          },
        }
      );
    }
  };
  return (
    <div className="pt-16 pb-5 sm:pt-20 px-4">
      <div className="text-2xl mb-7 font-semibold">{t("payment")}</div>
      <PaymentList
        filter={(value) => value.tag !== "cash"}
        onChange={(value) => setSelectedPayment(value)}
        value={selectedPayment}
      />
      <div className="mt-7">
        <Button
          onClick={handleBuy}
          loading={isTransactionCreating || isCreatingPaymentProcess}
          fullWidth
          disabled={!selectedPayment}
        >
          {t("buy")}
        </Button>
      </div>
    </div>
  );
};
