"use client";

import { Paginate } from "@/types/global";
import { ListHeader } from "@/components/list-header/list-header";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/hook/use-settings";
import { categoryService } from "@/services/category";
import { useInfiniteQuery } from "@tanstack/react-query";
import { extractDataFromPagination } from "@/utils/extract-data";
import { Category } from "@/types/category";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { FreeMode } from "swiper/modules";
import { ServiceCardUi2 } from "./service-card";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

interface ServicesProps {
  data?: Paginate<Category>;
}

export const Services = ({ data }: ServicesProps) => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const { data: services } = useInfiniteQuery(
    ["services", language?.locale],
    ({ pageParam }) =>
      categoryService.getAll({
        lang: language?.locale,
        perPage: 11,
        type: "service",
        page: pageParam,
        column: "input",
        sort: "asc",
      }),
    {
      initialData: data ? { pages: [data], pageParams: [1] } : undefined,
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const serviceList = extractDataFromPagination(services?.pages);
  return (
    <div>
      <ListHeader title={t("services")} />
      <Swiper slidesPerView="auto" spaceBetween={20} freeMode modules={[FreeMode]}>
        {serviceList?.map((service) => (
          <SwiperSlide key={service.id} className="max-w-max">
            <Link href={`/search?category_id=${service.id}`}>
              <ServiceCardUi2 data={service} key={service.id} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
