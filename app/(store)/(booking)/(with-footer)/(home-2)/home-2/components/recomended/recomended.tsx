"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSettings } from "@/hook/use-settings";
import { shopService } from "@/services/shop";
import { useTranslation } from "react-i18next";
import { Paginate } from "@/types/global";
import { Shop } from "@/types/shop";
import { extractDataFromPagination } from "@/utils/extract-data";
import { ListHeader } from "@/components/list-header";
import { ShopCardUi2 } from "@/components/shop-card/shop-card-ui-2";
import { Swiper, SwiperSlide } from "swiper/react";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import useAddressStore from "@/global-store/address";

interface RecommendedProps {
  data?: Paginate<Shop>;
}

export const Recommended = ({ data }: RecommendedProps) => {
  const { language } = useSettings();
  const { t } = useTranslation();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const { data: shops } = useInfiniteQuery(
    [
      "shops",
      language?.locale,
      { column: "r_avg", sort: "desc" },
      country?.region_id,
      country?.id,
      city?.id,
    ],
    () =>
      shopService.getAll({
        lang: language?.locale,
        perPage: 8,
        column: "r_avg",
        sort: "desc",
        region_id: country?.region_id || undefined,
        country_id: country?.id || undefined,
        city_id: city?.id || undefined,
      }),
    {
      initialData: data ? { pages: [data], pageParams: [1] } : undefined,
    }
  );

  const shopList = extractDataFromPagination(shops?.pages);

  return (
    <div className="mb-14">
      <ListHeader
        title={t("recommended")}
        link={buildUrlQueryParams("/shops", { column: "r_avg", sort: "desc" })}
      />
      <Swiper
        breakpoints={{
          992: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          562: {
            slidesPerView: 2.4,
            spaceBetween: 20,
          },
          0: {
            slidesPerView: 1.4,
            spaceBetween: 8,
          },
        }}
        className="!z-0"
      >
        {shopList?.map((shop) => (
          <SwiperSlide key={shop.id}>
            <ShopCardUi2 data={shop} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
