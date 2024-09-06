import { useTranslation } from "react-i18next";
import { RadioGroup } from "@headlessui/react";
import CheckIcon from "@/assets/icons/check";
import EmptyCheckIcon from "@/assets/icons/empty-check";
import React from "react";
import { Payment } from "@/types/global";
import { useServerCart } from "@/hook/use-server-cart";
import { ConfirmModal } from "@/components/confirm-modal";
import { useModal } from "@/hook/use-modal";
import { Types } from "@/context/checkout/checkout.reducer";
import { useCheckout } from "@/context/checkout/checkout.context";

const comparePayments = (a?: Payment, b?: Payment) => a?.id === b?.id;

interface CheckoutPaymentProps {
  onSelect: () => void;
  payments?: {
    data?: Payment[];
  };
  isLoading: boolean;
}

const CheckoutPayment = ({ onSelect, payments, isLoading }: CheckoutPaymentProps) => {
  const { t } = useTranslation();
  const { data } = useServerCart();
  const [isConfirModalOpen, openConfirmModal, closeConfirmModal] = useModal();
  let hasDigitalProduct = false;
  data?.data.user_carts.forEach((userCart) => {
    userCart.cartDetails.forEach((detail) => {
      detail.cartDetailProducts.forEach((cartProduct) => {
        if (cartProduct.stock.product.digital) {
          hasDigitalProduct = true;
        }
      });
    });
  });
  const { state, dispatch } = useCheckout();
  const handleChangePayment = (payment: Payment) => {
    if (hasDigitalProduct && payment.tag === "cash") {
      openConfirmModal();
      return;
    }
    dispatch({ type: Types.UpdatePaymentMethod, payload: { paymentMethod: payment } });
    onSelect();
  };
  if (isLoading) {
    return (
      <div className="mt-7 px-4">
        <h6 className="text-base font-semibold">{t("payment.method")}</h6>
        <div className="flex flex-col gap-3 mt-7">
          <div className="bg-gray-300 w-full rounded-full h-4" />
        </div>
        <div className="flex flex-col gap-3 mt-7">
          <div className="bg-gray-300 w-full rounded-full h-4" />
        </div>
      </div>
    );
  }
  return (
    <div className="mb-12 px-4">
      <h6 className="text-base font-semibold">{t("payment.method")}</h6>
      <RadioGroup by={comparePayments} value={state.paymentMethod} onChange={handleChangePayment}>
        {payments?.data?.map((payment) => (
          <RadioGroup.Option
            key={payment.id}
            value={payment}
            className="cursor-pointer border-b border-gray-layout dark:border-gray-inputBorder last:border-none"
          >
            {({ checked }) => (
              <div className="flex items-center gap-4 py-4 ">
                {checked && !!state.paymentMethod ? (
                  <span className="text-primary dark:text-white">
                    <CheckIcon />
                  </span>
                ) : (
                  <EmptyCheckIcon />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{payment.tag}</span>
                </div>
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
      <ConfirmModal
        text="you.cannot.pay.with.cash.because.there.is.a.digital.product.in.your.cart.please.change.the.payment.type.or.remove.the.digital.product.from.the.cart"
        onConfirm={closeConfirmModal}
        onCancel={closeConfirmModal}
        isOpen={isConfirModalOpen}
        confirmText="ok"
      />
    </div>
  );
};

export default CheckoutPayment;
