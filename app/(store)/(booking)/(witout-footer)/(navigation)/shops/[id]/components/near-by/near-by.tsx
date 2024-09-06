"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSettings } from "@/hook/use-settings";
import { shopService } from "@/services/shop";
import { useTranslation } from "react-i18next";
import { Paginate } from "@/types/global";
import { Shop } from "@/types/shop";
import { extractDataFromPagination } from "@/utils/extract-data";
import { ShopCard } from "@/components/shop-card";
import { ListHeader } from "@/components/list-header";
import { Swiper, SwiperSlide } from "swiper/react";

interface NearYouProps {
  data?: Paginate<Shop>;
  shop?: Shop;
}

export const NearBy = ({ data, shop }: NearYouProps) => {
  const { language, currency } = useSettings();
  const { t } = useTranslation();
  const { data: shops } = useInfiniteQuery(
    ["shops", language?.locale, shop?.id],
    () =>
      shopService.getAll({
        lang: language?.locale,
        perPage: 8,
        currency_id: currency?.id,
        "address[latitude]": shop?.lat_long.latitude,
        "address[longitude]": shop?.lat_long.longitude,
      }),
    {
      initialData: data ? { pages: [data], pageParams: [1] } : undefined,
    }
  );

  const shopList = extractDataFromPagination(shops?.pages);

  return (
    <div className="mt-7">
      <ListHeader title={t("venues.nearby")} />
      <Swiper
        breakpoints={{
          0: { slidesPerView: 1.2, spaceBetween: 10 },
          562: {
            slidesPerView: 2.4,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2.8,
            spaceBetween: 20,
          },
          992: { slidesPerView: 3.4, spaceBetween: 30 },
          1200: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
        }}
      >
        {shopList?.map((shopItem) => (
          <SwiperSlide key={shopItem.id}>
            <ShopCard data={shopItem} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
