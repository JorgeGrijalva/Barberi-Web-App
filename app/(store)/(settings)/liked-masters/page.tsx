"use client";

import useLikeStore from "@/global-store/like";
import React from "react";
import { ProductCardUi1Loading } from "@/components/product-card/product-card-ui-1";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { likeService } from "@/services/like";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { LoadingCard } from "@/components/loading";
import { Empty } from "@/components/empty";
import useUserStore from "@/global-store/user";
import useAddressStore from "@/global-store/address";
import { MasterCard } from "@/components/master-card";
import { masterService } from "@/services/master";
import { useSettings } from "@/hook/use-settings";
import { useTranslation } from "react-i18next";

const LikedMasters = () => {
  const user = useUserStore((state) => state.user);
  const { currency, language } = useSettings();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const { list } = useLikeStore();
  const setLikedMasters = useLikeStore((state) => state.setMany);
  const { t } = useTranslation();

  const {
    data: masterListByIds,
    isLoading: masterListByIdsLoading,
    isError: listError,
    isFetching: isFetchingMasterListByIds,
  } = useQuery(
    ["masterByIds", list.master, user],
    () =>
      masterService.getByIds({
        ids: list.master.map((listItem) => listItem.itemId),
        lang: language?.locale,
        currency_id: currency?.id,
      }),
    {
      enabled: !user && list.master.length > 0,
      retry: false,
      keepPreviousData: true,
    }
  );
  const {
    data: likedMastersList,
    isLoading: likedMastersLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery(
    ["likedMasters", user, country?.id, city?.id],
    ({ pageParam }) =>
      likeService.getMasterAll({
        type: "master",
        lang: language?.locale,
        currency_id: currency?.id,
        city_id: city?.id,
        country_id: country?.id,
        page: pageParam,
      }),
    {
      enabled: !!user,
      staleTime: 0,
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        setLikedMasters(
          "master",
          res.pages
            .flatMap((page) => page.data)
            .map((product) => ({ itemId: product.id, sent: true }))
        );
      },
    }
  );
  const likedMasters = extractDataFromPagination(likedMastersList?.pages);

  const actualList = user ? likedMasters : masterListByIds?.data;

  if ((actualList && actualList.length === 0) || listError) {
    return (
      <div className="h-full">
        <h1 className="tmd:text-head text-base font-semibold mb-6">{t("favorite.salons")}</h1>
        <div className="flex justify-center relative h-full items-center">
          {isFetching && <LoadingCard centered />}
          <Empty
            animated={false}
            text="empty.favorites"
            imagePath="/img/empty_master.png"
            description="add.your.favorite.masters"
          />
        </div>
      </div>
    );
  }
  if (user ? likedMastersLoading : masterListByIdsLoading) {
    return (
      <div>
        <h1 className="md:text-head text-base font-semibold mb-6">{t("favorite.masters")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-7 sm:gap-4 gap-2">
          {Array.from(Array(6).keys()).map((item) => (
            <ProductCardUi1Loading key={item} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1 className="md:text-head text-base font-semibold mb-6">{t("favorite.masters")}</h1>
      <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
        <div className="relative grid grid-cols-2 lg:grid-cols-3 md:gap-7 sm:gap-4 gap-2">
          {(isFetching || isFetchingMasterListByIds) && <LoadingCard centered />}
          {actualList?.map((master) => (
            <MasterCard data={master} key={master.id} />
          ))}
        </div>
      </InfiniteLoader>
    </div>
  );
};

export default LikedMasters;
