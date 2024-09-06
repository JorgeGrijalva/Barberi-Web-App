"use client";

import { useSettings } from "@/hook/use-settings";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { extractDataFromPagination } from "@/utils/extract-data";
import { ListHeader } from "@/components/list-header";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import useAddressStore from "@/global-store/address";

const ShopItemWrapper = ({
  index: i,
  children,
}: {
  index: number;
  children: React.ReactElement;
}) => (
  <div
    className={clsx(
      "relative rounded-button overflow-hidde",
      i === 0 && "col-span-4 md:col-span-2 row-span-5 md:aspect-[313/517] aspect-[2/1]",
      i === 1 && "col-span-2 row-span-2 aspect-[169/192] md:aspect-auto",
      i === 2 && "md:col-span-3 col-span-2 row-span-2 aspect-[169/192] md:aspect-auto",
      i === 3 && "col-span-2 md:col-span-3 row-span-3 aspect-[169/192] md:aspect-auto",
      i === 4 && "col-span-2 row-span-2 aspect-[169/192] md:aspect-auto"
    )}
  >
    {children}
  </div>
);
export const Salons = () => {
  const { language } = useSettings();
  const { t } = useTranslation();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const { data: shops, isLoading } = useInfiniteQuery(
    [
      "shops",
      language?.locale,
      { column: "id", sort: "desc" },
      country?.region_id,
      country?.id,
      city?.id,
    ],
    () =>
      shopService.getAll({
        lang: language?.locale,
        perPage: 7,
        column: "b_count",
        sort: "desc",
        region_id: country?.region_id,
        country_id: country?.id,
        city_id: city?.id,
      }),
    {}
  );

  const shopList = extractDataFromPagination(shops?.pages);

  return (
    <div className="mt-14">
      <ListHeader title={t("popular.salons")} />
      <div className="grid grid-cols-4 grid-rows-2 md:grid-cols-7 md:grid-rows-5 lg:gap-6 md:gap-2 gap-2">
        {isLoading
          ? Array.from(Array(5).keys()).map((item) => (
              <ShopItemWrapper index={item} key={item}>
                <div className="bg-gray-300 rounded-button w-full h-full" />
              </ShopItemWrapper>
            ))
          : shopList?.slice(0, 5)?.map((shop, i) => (
              <ShopItemWrapper index={i} key={shop.id}>
                <Link href={`/shops/${shop.slug}`}>
                  <Image
                    src={shop.background_img || ""}
                    alt={shop.translation?.title || "shop"}
                    fill
                    className="object-cover rounded-button"
                  />
                </Link>
              </ShopItemWrapper>
            ))}
      </div>
    </div>
  );
};
