"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { Empty } from "@/components/empty";
import { useTranslation } from "react-i18next";
import refundService from "@/services/refund";
import { useSettings } from "@/hook/use-settings";
import { RefundCard } from "./components/refund-card";

const Orders = () => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const {
    data: refunds,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    ["refunds"],
    ({ pageParam }) => refundService.getAll({ page: pageParam, lang: language?.locale }),
    {
      suspense: true,
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );

  const refundList = extractDataFromPagination(refunds?.pages);
  return (
    <div className="flex flex-col gap-7 w-full">
      <div className="border border-gray-inputBorder rounded-2xl overflow-x-hidden max-h-screen overflow-y-auto relative">
        <div className="p-5 sticky top-0 bg-white dark:bg-darkBg z-[2]">
          <h6 className="text-lg font-semibold">{t("order.refunds")}</h6>
        </div>
        <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
          {refundList && refundList.length > 0 ? (
            refundList?.map((refund) => (
              <RefundCard
                cause={refund.cause}
                answer={refund.answer}
                key={refund.id}
                data={refund.order}
                createdAt={refund.created_at}
                active
                status={refund.status}
              />
            ))
          ) : (
            <Empty text="no.order.refunds" smallText />
          )}
        </InfiniteLoader>
      </div>
    </div>
  );
};

export default Orders;
