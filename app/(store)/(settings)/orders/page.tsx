"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { Empty } from "@/components/empty";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/hook/use-settings";
import { OrderCard } from "./components/order-card";

const Orders = () => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const {
    data: activeOrders,
    hasNextPage: activeOrderHasNextPage,
    isFetchingNextPage: isActiveOrderFetchingNextPage,
    fetchNextPage: fetchNextActiveOrders,
  } = useInfiniteQuery(
    ["activeOrders"],
    ({ pageParam }) => orderService.getAll({ page: pageParam, parent: 1, lang: language?.locale }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      refetchOnWindowFocus: true,
    }
  );

  const activeOrderList = extractDataFromPagination(activeOrders?.pages);
  return (
    <div className="flex flex-col gap-7 w-full">
      <div className="border border-gray-inputBorder rounded-2xl overflow-x-hidden max-h-screen overflow-y-auto relative">
        <div className="p-5 sticky top-0 bg-white dark:bg-darkBg z-[2]">
          <h6 className="text-lg font-semibold">{t("orders")}</h6>
        </div>
        <InfiniteLoader
          loadMore={fetchNextActiveOrders}
          hasMore={activeOrderHasNextPage}
          loading={isActiveOrderFetchingNextPage}
        >
          {activeOrderList && activeOrderList.length > 0 ? (
            activeOrderList?.map((order) => <OrderCard key={order.id} data={order} active />)
          ) : (
            <Empty text="no.active.orders" smallText />
          )}
        </InfiniteLoader>
      </div>
    </div>
  );
};

export default Orders;
