import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/input";
import { useTranslation } from "react-i18next";
import { orderService } from "@/services/order";
import { RadioGroup } from "@headlessui/react";
import CheckIcon from "@/assets/icons/check";
import EmptyCheckIcon from "@/assets/icons/empty-check";
import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/button";
import { userService } from "@/services/user";
import { useExternalPayment } from "@/hook/use-external-payment";
import { useSettings } from "@/hook/use-settings";

const comparePayments = (a?: string, b?: string) => a === b;

const schema = yup.object({
  amount: yup.number().required().typeError("required"),
  payment: yup.string().required(),
});

type FormData = yup.InferType<typeof schema>;

export const WalletTopUp = () => {
  const { t } = useTranslation();
  const { currency } = useSettings();
  const { data: profile } = useQuery(["profile"], () => userService.profile());
  const { mutate: externalPay, isLoading: externalPayloading } = useExternalPayment();
  const { data: payments } = useQuery({
    queryKey: ["payments"],
    queryFn: () => orderService.paymentList(),
    suspense: true,
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleTopUp = (data: FormData) => {
    externalPay({
      tag: data.payment,
      data: {
        wallet_id: profile?.data.wallet?.id,
        total_price: data.amount,
        currency_id: currency?.id,
      },
    });
  };

  return (
    <div className="p-5">
      <div className="text-xl font-medium mb-4">{t("topup.wallet")}</div>
      <form onSubmit={handleSubmit(handleTopUp)}>
        <Input
          {...register("amount")}
          error={errors.amount?.message}
          type="number"
          label={t("amount")}
          fullWidth
        />

        <RadioGroup
          by={comparePayments}
          value={watch("payment")}
          onChange={(payment) => setValue("payment", payment, { shouldValidate: true })}
        >
          {payments?.data?.map((payment) =>
            payment.tag === "cash" || payment.tag === "wallet" ? null : (
              <RadioGroup.Option
                key={payment.id}
                value={payment.tag}
                className="cursor-pointer border-b border-gray-layout dark:border-gray-inputBorder last:border-none"
              >
                {({ checked }) => (
                  <div className="flex items-center gap-4 py-4 ">
                    {checked ? (
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
            )
          )}
        </RadioGroup>
        {errors.payment && <p className="text-sm mt-1 mb-2 text-red">{errors.payment.message}</p>}
        <Button loading={externalPayloading} fullWidth type="submit">
          {t("add")}
        </Button>
      </form>
    </div>
  );
};
