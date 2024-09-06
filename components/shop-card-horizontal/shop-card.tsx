import { Shop } from "@/types/shop";
import React, { memo } from "react";
import Link from "next/link";
import { ImageWithFallBack } from "@/components/image";
import Image from "next/image";
import MapPinIcon from "@/assets/icons/map-pin";
import { useTranslation } from "react-i18next";
import { createRatingText } from "@/utils/create-rating-text";
import clsx from "clsx";
import VerifiedIcon from "@/assets/icons/verified";

interface ShopCardProps {
  data: Shop;
}

export const ShopCard = memo(
  ({ data }: ShopCardProps) => {
    const { t } = useTranslation();
    return (
      <div className="relative group border-b border-gray-link pb-4">
        <Link
          href={`/shops/${data.slug}`}
          className="flex gap-3 flex-col sm:flex-row"
          target="_blank"
        >
          <div className="relative  sm:h-[140px] aspect-[345/190] sm:aspect-[190/140] rounded-button overflow-hidden ">
            <ImageWithFallBack
              src={data.background_img}
              alt={data.translation?.title || ""}
              fill
              className="object-cover transition-all group-hover:scale-105 "
            />
            <div className="absolute top-3 right-3 rounded-button border border-white w-7 h-7 flex items-center justify-center z-[1] bg-white bg-opacity-60">
              <span className="text-sm font-semibold">{data.r_avg || 0}</span>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-3  flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mt-7">
                  <strong
                    className={clsx(
                      "md:text-lg text-base font-semibold",
                      data?.verify && "line-clamp-1"
                    )}
                  >
                    {data.translation?.title}
                  </strong>
                  {data?.verify && (
                    <span>
                      <VerifiedIcon />
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-field line-clamp-2">
                  {data.translation?.description}
                </span>
              </div>
              <div className="rounded-full relative w-10 h-10 flex items-center justify-center z-[1] aspect-square flex-shrink-0">
                <Image
                  src={data.logo_img}
                  alt={data.translation?.title || "shoplogo"}
                  fill
                  className="rounded-full object-cover w-9 h-9"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <MapPinIcon />
                <span className="text-xs text-gray-field">
                  {data?.distance} {t("km.away.from.you")}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm font-medium">{createRatingText(data.r_avg)}</span>
                <div className="bg-footerBg rounded-full w-1 h-1" />
                <span className="text-sm font-normal">
                  {data.r_count || 0} {t("reviews")}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  },
  (prev, next) => prev?.data?.id === next?.data?.id
);
