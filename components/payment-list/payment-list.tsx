"use client";

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order";
import { RadioGroup } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import EmptyCheckIcon from "@/assets/icons/empty-check";
import { RadioFillIcon } from "@/assets/icons/radio-fill";
import { Payment } from "@/types/global";
import { LoadingCard } from "@/components/loading";
import dynamic from "next/dynamic";
import { useSettings } from "@/hook/use-settings";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

interface PaymentListProps {
  value?: Payment;
  onChange: (value: Payment) => void;
  filter?: (value: Payment) => boolean;
}

export const PaymentList = ({ value, onChange, filter }: PaymentListProps) => {
  const { currency } = useSettings();
  const { data, isLoading } = useQuery(["payments"], () =>
    orderService.paymentList({ active: 1, currency_id: currency?.id })
  );
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="py-10">
        <LoadingCard />
      </div>
    );
  }

  if (data?.data && data.data.length === 0) {
    return <Empty animated={false} smallText />;
  }

  return (
    <RadioGroup value={value} onChange={onChange}>
      <RadioGroup.Label className="sr-only">{t("payment.type")}</RadioGroup.Label>
      <div className="space-y-2">
        {data?.data.map(
          (payment) =>
            (filter ? filter(payment) : true) && (
              <RadioGroup.Option
                key={payment.id}
                value={payment}
                className={({ active, checked }) =>
                  `${active ? "ring-2 ring-white/60 ring-offset-2 ring-offset-primary " : ""}
                  ${checked ? "border-dark" : "border-gray-link"}
                    relative flex cursor-pointer rounded-lg px-5 py-3 focus:outline-none border`
                }
              >
                {({ checked }) => (
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-3">
                      {checked ? (
                        <RadioFillIcon />
                      ) : (
                        <span className="text-gray-link">
                          <EmptyCheckIcon size={14} />
                        </span>
                      )}
                      <div className="text-sm">
                        <RadioGroup.Label as="p" className="font-medium">
                          {t(payment.tag)}
                        </RadioGroup.Label>
                      </div>
                    </div>
                  </div>
                )}
              </RadioGroup.Option>
            )
        )}
      </div>
    </RadioGroup>
  );
};
