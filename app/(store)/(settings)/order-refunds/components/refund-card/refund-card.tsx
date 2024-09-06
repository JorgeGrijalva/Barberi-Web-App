import AnchorLeft from "@/assets/icons/anchor-left";
import clsx from "clsx";
import React from "react";
import { Order } from "@/types/order";
import { Price } from "@/components/price";
import dayjs from "dayjs";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface RefundCardProps {
  active?: boolean;
  data: Order;
  cause?: string;
  answer?: string;
  createdAt?: string;
  status?: string;
}

export const RefundCard = ({ active, data, cause, answer, createdAt, status }: RefundCardProps) => {
  const { t } = useTranslation();
  return (
    <Link className="w-full overflow-x-auto" scroll={false} href={`/orders/${data.id}`}>
      <div className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-inputBorder border-t border-gray-orderCard dark:border-gray-bold">
        <div
          className={clsx(
            "relative  py-5 md:pr-5 pr-1 grid lg:grid-cols-3 md:grid-cols-2 gap-7 w-full",
            active ? "md:pl-10 pl-5" : "md:pl-5 pl-1"
          )}
        >
          {active && (
            <div className="w-[14px] absolute left-0 top-3 bottom-3 bg-primary rounded-r-2xl" />
          )}
          <div className="flex flex-col ">
            <strong className="text-base text-start font-bold">#{data.id}</strong>
            <div className="flex items-center gap-3">
              <span className="semi-bold text-sm">
                <Price customCurrency={data.currency} number={data.total_price} />
              </span>
              <div className="bg-gray-bold w-1 h-1 rounded-full" />
              <span className="font-medium text-sm">
                {dayjs(createdAt).format("YYYY-MM-DD HH:mm")}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <strong className="text-base text-start font-bold">{t("status")}</strong>
            <span className="text-sm font-medium line-clamp-1">{status}</span>
          </div>
          <div className="flex flex-col">
            <strong className="text-base text-start font-bold">{t("cause")}</strong>
            <span className="text-sm font-medium line-clamp-1">{cause}</span>
          </div>
          <div className="flex flex-col">
            <strong className="text-base text-start font-bold">{t("answer")}</strong>
            <span className="text-sm font-medium line-clamp-1">{answer || t("no.answer")}</span>
          </div>
        </div>
        <div className="rotate-180 rtl:rotate-0">
          <AnchorLeft />
        </div>
      </div>
    </Link>
  );
};
