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
import useAddressStore from "@/global-store/address";

export const Salons = () => {
  const { language } = useSettings();
  const { t } = useTranslation();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const { data: shops } = useInfiniteQuery(
    ["shops", language?.locale, "id", "desc", country?.region_id, country?.id, city?.id],
    () =>
      shopService.getAll({
        lang: language?.locale,
        perPage: 7,
        column: "id",
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
      <ListHeader title={t("new.salons")} />
      <div className="grid lg:grid-cols-6 sm:grid-cols-4 grid-cols-2 lg:grid-rows-5 grid-rows-2 lg:gap-7 md:gap-4 gap-2.5">
        {shopList?.map((shop, i) => (
          <div
            className={clsx(
              "relative rounded-button overflow-hidden",
              i === 0 && "col-span-2 lg:row-span-5 row-span-2 aspect-[427/517]",
              i === 1 && " col-span-2 lg:row-span-2 row-span-1 aspect-[345/174] md:aspect-auto",
              (i === 2 || i === 3) && "lg:row-span-2 row-span-1 aspect-[169/192] md:aspect-auto",
              (i === 4 || i === 5) &&
                "lg:row-span-3 row-span-1 col-span-2 sm:col-span-1 aspect-[345/174] md:aspect-auto",
              i === 6 && "lg:row-span-3 sm:col-span-2 col-span-2"
            )}
            key={shop.id}
          >
            <Link href={`/shops/${shop.slug}`}>
              <Image
                src={shop.background_img || ""}
                alt={shop.translation?.title || "shop"}
                fill
                className="object-cover"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
