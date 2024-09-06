/* eslint-disable @next/next/no-img-element */

"use client";

import { Translate } from "@/components/translate";
import { DefaultResponse } from "@/types/global";
import { Shop } from "@/types/shop";
import MapPinIcon from "@/assets/icons/map-pin";
import { useSettings } from "@/hook/use-settings";
import Link from "next/link";
import { createMapUrl } from "@/utils/create-map-url";

interface ShopLocationProps {
  data?: DefaultResponse<Shop>;
}

export const ShopLocation = ({ data }: ShopLocationProps) => {
  const { settings } = useSettings();
  return (
    <div className="rounded-button py-5 px-5 border border-gray-link col-span-2">
      <h2 className="text-xl font-semibold">
        <Translate value="location" />
      </h2>
      <Link
        href={createMapUrl(data?.data.lat_long.latitude, data?.data.lat_long.longitude)}
        className="flex items-center gap-1 my-5"
      >
        <MapPinIcon />
        <span className="text-sm">{data?.data.translation?.address}</span>
      </Link>
      <img
        src={`https://maps.googleapis.com/maps/api/staticmap?center=${
          data?.data?.lat_long?.latitude ?? ""
        },${data?.data?.lat_long?.longitude ?? ""}&zoom=10&size=600x270&markers=color:black|label:${
          data?.data?.r_avg ?? 0
        }|${data?.data?.lat_long?.latitude ?? ""},${data?.data?.lat_long?.longitude ?? ""}&key=${
          settings?.google_map_key
        }`}
        alt="location"
        className="w-full md:max-h-[270px] max-h-[390px] object-cover rounded-button"
      />
    </div>
  );
};
