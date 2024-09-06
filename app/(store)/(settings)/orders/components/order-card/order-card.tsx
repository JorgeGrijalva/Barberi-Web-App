import AnchorLeft from "@/assets/icons/anchor-left";
import clsx from "clsx";
import React from "react";
import { Order } from "@/types/order";
import { Price } from "@/components/price";
import dayjs from "dayjs";
import Link from "next/link";

interface OrderCardProps {
  active?: boolean;
  data: Order;
}

export const OrderCard = ({ active, data }: OrderCardProps) => (
  <Link className="w-full" scroll={false} href={`/orders/${data.id}`}>
    <div
      className={clsx(
        "relative border-t border-gray-orderCard dark:border-gray-bold py-5 md:pr-5 pr-1 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-inputBorder",
        active ? "md:pl-10 pl-5" : "md:pl-5 pl-1"
      )}
    >
      {active && (
        <div className="w-[14px] absolute left-0 top-3 bottom-3 bg-primary rounded-r-2xl" />
      )}
      <div className="flex flex-col">
        <strong className="text-base text-start font-bold">#{data.id}</strong>
        <div className="flex items-center gap-3">
          <span className="semi-bold text-sm">
            <Price customCurrency={data.currency} number={data.total_price} />
          </span>
          <div className="bg-gray-bold w-1 h-1 rounded-full" />
          <span className="font-medium text-sm">
            {dayjs(data.delivery_date).format("YYYY-MM-DD HH:mm")}
          </span>
        </div>
      </div>
      <div className="rotate-180 rtl:rotate-0">
        <AnchorLeft />
      </div>
    </div>
  </Link>
);
