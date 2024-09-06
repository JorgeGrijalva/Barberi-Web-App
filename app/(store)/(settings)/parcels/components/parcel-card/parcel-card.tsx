import AnchorLeft from "@/assets/icons/anchor-left";
import clsx from "clsx";
import React from "react";
import { Price } from "@/components/price";
import Link from "next/link";
import { Parcel } from "@/types/parcel";

interface ParcelCardProps {
  active?: boolean;
  data: Parcel;
}

export const ParcelCard = ({ active, data }: ParcelCardProps) => (
  <Link className="w-full" scroll={false} href={`/parcels/${data.id}`}>
    <div
      className={clsx(
        "relative border-t border-gray-orderCard py-5 md:pr-5 pr-1 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-inputBorder dark:border-gray-bold",
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
            {data.delivery_date} {data.delivery_time}
          </span>
        </div>
      </div>
      <div className="rotate-180">
        <AnchorLeft />
      </div>
    </div>
  </Link>
);
