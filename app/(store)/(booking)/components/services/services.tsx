"use client";

import { Paginate } from "@/types/global";
import { ListHeader } from "@/components/list-header/list-header";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/hook/use-settings";
import { categoryService } from "@/services/category";
import { useInfiniteQuery } from "@tanstack/react-query";
import { extractDataFromPagination } from "@/utils/extract-data";
import { Category } from "@/types/category";
import Link from "next/link";
import PlusCircleIcon from "@/assets/icons/plus-circle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid } from "swiper/modules";
import { ServiceCard } from "./service-card";
import "swiper/css/grid";

interface ServicesProps {
  data?: Paginate<Category>;
  showTitle?: boolean;
}

export const Services = ({ data, showTitle = true }: ServicesProps) => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const { data: services, hasNextPage } = useInfiniteQuery(
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
      suspense: true,
    }
  );
  const serviceList = extractDataFromPagination(services?.pages);
  return (
    <div className="mt-20 lg:mt-0 rounded-b-3xl">
      {showTitle && <ListHeader title={t("services")} container />}
      <div className="xl:container">
        <Swiper
          className="!px-4 xl:!px-0"
          modules={[Grid]}
          breakpoints={{
            992: {
              slidesPerView: 6,
              spaceBetween: 30,
              grid: {
                rows: 2,
                fill: "row",
              },
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 30,
              grid: {
                rows: 1,
              },
            },
            562: {
              slidesPerView: 3,
              spaceBetween: 20,
              grid: {
                rows: 1,
              },
            },
            0: {
              slidesPerView: 2.3,
              spaceBetween: 8,
              grid: {
                rows: 1,
              },
            },
          }}
        >
          {serviceList?.map((service, idx) => (
            <SwiperSlide key={service.id} className="md:max-w-[200px]">
              <Link href={`/search?category_id=${service.id}`}>
                <ServiceCard index={idx} data={service} length={serviceList.length} />
              </Link>
            </SwiperSlide>
          ))}
          {hasNextPage && (
            <SwiperSlide>
              <Link
                href="/services"
                className="flex items-center justify-center border border-gray-link rounded-button flex-col gap-1 h-[152px]"
              >
                <PlusCircleIcon />
                <span>{t("more")}</span>
              </Link>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};
