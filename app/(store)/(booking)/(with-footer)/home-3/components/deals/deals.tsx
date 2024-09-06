"use client";

import { ListHeader } from "@/components/list-header";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { extractDataFromPagination } from "@/utils/extract-data";
import { useSettings } from "@/hook/use-settings";
import { Paginate } from "@/types/global";
import { Shop } from "@/types/shop";
import { Swiper, SwiperSlide } from "swiper/react";
import { DealCard } from "@/components/deal-card/deal-card";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import useAddressStore from "@/global-store/address";

interface DealsProps {
  data?: Paginate<Shop>;
}

export const Deals = ({ data }: DealsProps) => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const { data: shops } = useInfiniteQuery(
    ["shops", language?.locale, "b_count", "desc", country?.region_id, country?.id, city?.id],
    () =>
      shopService.getAll({
        lang: language?.locale,
        perPage: 8,
        column: "b_count",
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
    <>
      <ListHeader
        title={t("deals")}
        link={buildUrlQueryParams("/shops", { column: "b_count", sort: "desc" })}
        container
      />
      <div className="xl:container">
        <Swiper
          className="!px-4 xl:!px-0"
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
          {shopList?.map((shop) => (
            <SwiperSlide key={shop.id}>
              <DealCard data={shop} />{" "}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};
