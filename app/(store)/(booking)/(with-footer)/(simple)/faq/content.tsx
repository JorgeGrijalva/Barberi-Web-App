"use client";

import { Paginate } from "@/types/global";
import { Faq } from "@/types/info";
import { useInfiniteQuery } from "@tanstack/react-query";
import { infoService } from "@/services/info";
import React from "react";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/hook/use-settings";
import { Qa } from "./components/qa";

interface HelpContentProps {
  data: Paginate<Faq>;
}

export const HelpContent = ({ data }: HelpContentProps) => {
  const { language } = useSettings();
  const { t } = useTranslation();
  const {
    data: faqs,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["faq", language?.locale],
    ({ pageParam }) => infoService.faq({ lang: language?.locale, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      initialData: { pages: [data], pageParams: [1] },
    }
  );

  const faqList = extractDataFromPagination(faqs?.pages);

  return (
    <section className="xl:container px-4 h-full relative">
      <h1 className="my-7 md:text-head text-xl font-semibold">{t("faq")}</h1>
      <InfiniteLoader hasMore={hasNextPage} loadMore={fetchNextPage} loading={isFetchingNextPage}>
        <div className="flex flex-col gap-2 w-full">
          {faqList?.map((faq) => (
            <Qa data={faq} key={faq.id} />
          ))}
        </div>
      </InfiniteLoader>
    </section>
  );
};
