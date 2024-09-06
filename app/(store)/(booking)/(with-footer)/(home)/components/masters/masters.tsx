"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { masterService } from "@/services/master";
import { extractDataFromPagination } from "@/utils/extract-data";
import { MasterCard } from "@/components/master-card";
import dynamic from "next/dynamic";
import { ListHeader } from "@/components/list-header";
import { useTranslation } from "react-i18next";
import { Grid } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { useSettings } from "@/hook/use-settings";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

export const Masters = () => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const { data: masters, isLoading } = useInfiniteQuery(
    ["masters", language?.locale],
    () =>
      masterService.list({ column: "r_avg", sort: "desc", lang: language?.locale, perPage: 12 }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const masterList = extractDataFromPagination(masters?.pages);
  return (
    <div className="mt-14">
      <ListHeader title={t("the.best.masters")} link="/masters" container />
      {masterList?.length !== 0 ? (
        <div className="xl:container ">
          <Swiper
            className="!px-4 xl:!px-0"
            modules={[Grid]}
            breakpoints={{
              1200: {
                slidesPerView: 6,
                spaceBetween: 30,
                grid: {
                  rows: 2,
                  fill: "row",
                },
              },
              992: {
                slidesPerView: 5,
                spaceBetween: 30,
                grid: {
                  rows: 2,
                  fill: "row",
                },
              },
              768: {
                slidesPerView: 3.8,
                spaceBetween: 30,
                grid: {
                  rows: 1,
                },
              },
              562: {
                slidesPerView: 2.4,
                spaceBetween: 20,
                grid: {
                  rows: 1,
                },
              },
              0: {
                slidesPerView: 1.5,
                spaceBetween: 8,
                grid: {
                  rows: 1,
                },
              },
            }}
          >
            {isLoading
              ? Array.from(Array(12).keys()).map((item) => (
                  <SwiperSlide key={item} className="max-w-[200px]">
                    <div className="rounded-button bg-gray-300 aspect-[1/1.5]" key={item} />
                  </SwiperSlide>
                ))
              : masterList?.map((master) => (
                  <SwiperSlide key={master.id}>
                    <Link
                      href={buildUrlQueryParams(
                        `/shops/${master.invite?.shop?.slug}/booking/staff/${master.id}`,
                        {
                          serviceId: master.service_master?.service_id,
                          serviceMasterId: master.service_master?.id,
                        }
                      )}
                    >
                      <MasterCard data={master} />
                    </Link>
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
      ) : (
        <Empty animated={false} />
      )}
    </div>
  );
};
