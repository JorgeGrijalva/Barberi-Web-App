import { Shop } from "@/types/shop";
import React from "react";
import Link from "next/link";
import { ImageWithFallBack } from "@/components/image";
import clsx from "clsx";
import VerifiedIcon from "@/assets/icons/verified";

interface ShopCardProps {
  data: Shop;
  openOnNewPage?: boolean;
}

export const ShopCard = ({ data, openOnNewPage }: ShopCardProps) => (
  <div className="relative rounded-button overflow-hidden group shadow-storeCard justify-start bg-white lg:w-[230px] border lg:border-none border-gray-link my-7 mx-4 lg:my-0 lg:mx-0 p-2 lg:p-0">
    <div className="absolute top-3 right-3 rounded-button border lg:border-white border-gray-link w-7 h-7 flex items-center justify-center z-[1] bg-white bg-opacity-60">
      <span className="text-sm font-semibold">{data.r_avg || 0}</span>
    </div>
    <Link
      href={`/shops/${data.slug}`}
      target={openOnNewPage ? "_blank" : undefined}
      className="flex flex-row lg:flex-col items-center lg:items-start gap-3 lg:gap-0"
    >
      <div className="relative lg:aspect-[230/140] aspect-[134/98] w-36 lg:w-auto lg:h-36">
        <ImageWithFallBack
          src={data.background_img}
          alt={data.translation?.title || ""}
          fill
          className="object-cover rounded-button lg:rounded-none"
        />
      </div>
      <div className="flex flex-col gap-3 z-[2] xl:pb-4 xl:px-4 lg:pb-2 lg:px-2 pb-1 px-1">
        <div className="flex flex-col ">
          <div className="flex items-center gap-2 mt-2">
            <strong className={clsx("text-sm font-semibold", data?.verify && "line-clamp-1")}>
              {data.translation?.title}
            </strong>
            {data?.verify && <VerifiedIcon />}
          </div>
          <span className="text-xs text-gray-field line-clamp-2">
            {data.translation?.description}
          </span>
        </div>
      </div>
    </Link>
  </div>
);
