import { Shop } from "@/types/shop";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import MapPinIcon from "@/assets/icons/map-pin";
import { ImageWithFallBack } from "@/components/image";

interface DealCardProps {
  data: Shop;
}

export const DealCard = ({ data }: DealCardProps) => (
  <Link href={`/shops/${data.slug}`}>
    <div className="relative rounded-button overflow-hidden aspect-[313/300] hover:shadow-2xl duration-300 transition w-full">
      <ImageWithFallBack
        src={data.background_img || ""}
        alt="shopBackground"
        fill
        className="object-cover"
      />
      <div className="absolute z-[1] bottom-2 left-2 right-2 text-white flex justify-between rounded-button bg-white/20 backdrop-blur-md h-[30%] p-2.5">
        <div className="w-3/4">
          <strong className="text-lg font-semibold line-clamp-1">{data.translation?.title}</strong>
          <div className="flex items-center gap-1 pt-2">
            <MapPinIcon />
            <span className="text-sm text-opacity-50 line-clamp-1">
              {data?.translation?.address}
            </span>
          </div>
        </div>
        <div className="w-1/4 relative overflow-hidden rounded-full p-2 flex items-center justify-center  aspect-square ">
          <Image
            src={data?.logo_img}
            alt={data.translation?.title || "shop"}
            fill
            className="object-cover aspect-square"
          />
        </div>
      </div>
    </div>
  </Link>
);
