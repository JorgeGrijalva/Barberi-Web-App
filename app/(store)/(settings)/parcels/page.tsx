"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { activeOrderStatuses, finishedOrderStatuses } from "@/config/global";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { Empty } from "@/components/empty";
import { parcelService } from "@/services/parcel";
import { useTranslation } from "react-i18next";
import { ParcelCard } from "./components/parcel-card";

const Parcels = () => {
  const { t } = useTranslation();
  const {
    data: activeParcels,
    hasNextPage: activeParcelHasNextPage,
    isFetchingNextPage: isActiveParcelFetchingNextPage,
    fetchNextPage: fetchNextActiveParcels,
  } = useInfiniteQuery(
    ["activeParcels"],
    ({ pageParam }) => parcelService.getAll({ statuses: activeOrderStatuses, page: pageParam }),
    {
      suspense: true,
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      refetchOnWindowFocus: true,
    }
  );
  const {
    data: orderHistory,
    hasNextPage: orderHistoryHasNextPage,
    isFetchingNextPage: isParcelHistoryFetchingNextPage,
    fetchNextPage: fetchNextParcelHistories,
  } = useInfiniteQuery(
    ["parcelHistory"],
    ({ pageParam }) => parcelService.getAll({ statuses: finishedOrderStatuses, page: pageParam }),
    {
      suspense: true,
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      refetchOnWindowFocus: true,
    }
  );
  const activeParcelList = extractDataFromPagination(activeParcels?.pages);
  const parcelHistoryList = extractDataFromPagination(orderHistory?.pages);
  return (
    <div className="flex flex-col gap-7 w-full">
      <div className="border border-gray-inputBorder rounded-2xl overflow-x-hidden max-h-screen overflow-y-auto relative">
        <div className="p-5 sticky top-0 bg-white z-[2] dark:bg-dark">
          <h6 className="text-lg font-semibold">{t("active.parcels")}</h6>
        </div>
        <InfiniteLoader
          loadMore={fetchNextActiveParcels}
          hasMore={activeParcelHasNextPage}
          loading={isActiveParcelFetchingNextPage}
        >
          {activeParcelList && activeParcelList.length > 0 ? (
            activeParcelList?.map((order) => <ParcelCard key={order.id} data={order} active />)
          ) : (
            <Empty text="no.active.parcels" smallText />
          )}
        </InfiniteLoader>
      </div>
      <div className="border border-gray-inputBorder rounded-2xl overflow-x-hidden max-h-screen overflow-y-auto relative">
        <div className="p-5 sticky top-0 bg-white dark:bg-dark z-[2]">
          <h6 className="text-lg font-semibold">{t("completed.parcels")}</h6>
        </div>
        <InfiniteLoader
          loadMore={fetchNextParcelHistories}
          hasMore={orderHistoryHasNextPage}
          loading={isParcelHistoryFetchingNextPage}
        >
          {parcelHistoryList && parcelHistoryList.length > 0 ? (
            parcelHistoryList?.map((order) => <ParcelCard data={order} key={order.id} />)
          ) : (
            <Empty text="no.parcel.history" smallText />
          )}
        </InfiniteLoader>
      </div>
    </div>
  );
};

export default Parcels;
