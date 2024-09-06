"use client";

import { useSettings } from "@/hook/use-settings";
import { useInfiniteQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category";
import React from "react";
import { useTranslation } from "react-i18next";
import { extractDataFromPagination } from "@/utils/extract-data";
import { ServiceCard } from "@/app/(store)/(booking)/components/services/service-card";
import dynamic from "next/dynamic";
import { InfiniteLoader } from "@/components/infinite-loader";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);
const ErrorFallback = dynamic(() => import("@/components/error-fallback"));

const ServicesPage = () => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const {
    data: services,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
  } = useInfiniteQuery(
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
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      suspense: true,
    }
  );

  const serviceList = extractDataFromPagination(services?.pages);

  const renderResults = () => {
    if (isLoading)
      return (
        <div className="px-4 grid grid-cols-6 lg:gap-7 sm:gap-4 gap-2.5 animate-pulse overflow-x-hidden flex-nowrap">
          {Array.from(Array(12).keys()).map((item) => (
            <div
              className="bg-gray-300 rounded-button min-w-[200px] xl:min-w-full h-40 xl:aspect-[200/152]"
              key={item}
            />
          ))}
        </div>
      );
    if (serviceList && serviceList.length > 0) {
      return (
        <InfiniteLoader hasMore={hasNextPage} loadMore={fetchNextPage} loading={isFetchingNextPage}>
          <div className="grid grid-cols-6 lg:gap-7 sm:gap-4 gap-2.5 overflow-x-hidden flex-nowrap">
            {serviceList.map((service, idx) => (
              <ServiceCard data={service} index={idx} length={serviceList.length} />
            ))}
          </div>
        </InfiniteLoader>
      );
    }
    if (serviceList && serviceList.length === 0) {
      return <Empty animated={false} />;
    }
    return (
      <div className="flex items-center justify-center">
        <ErrorFallback />
      </div>
    );
  };
  return (
    <section className="xl:container px-4 ">
      <h1 className="text-head font-semibold my-7">{t("services")}</h1>
      {renderResults()}
    </section>
  );
};

export default ServicesPage;
