"use client";

import { useTranslation } from "react-i18next";
import { useSettings } from "@/hook/use-settings";
import { useInfiniteQuery } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { extractDataFromPagination } from "@/utils/extract-data";
import { ShopCard } from "@/components/shop-card-horizontal";
import { useSearchParams } from "next/navigation";
import { InfiniteLoader } from "@/components/infinite-loader";
import { IconButton } from "@/components/icon-button";
import FilterLineIcon from "remixicon-react/FilterLineIcon";
import Map2LineIcon from "remixicon-react/Map2LineIcon";
import dynamic from "next/dynamic";
import { ShopCardLoading } from "@/components/shop-card-horizontal/loading";
import SearchIcon from "@/assets/icons/search";
import { useDebounce } from "@/hook/use-debounce";

const ErrorFallback = dynamic(() => import("@/components/error-fallback"));

interface FilterShopProps {
  onFilterButtonClick: () => void;
  onMapButtonClick: () => void;
}

export const Shops = ({ onFilterButtonClick, onMapButtonClick }: FilterShopProps) => {
  const { t } = useTranslation();
  const { language, settings } = useSettings();
  const searchParams = useSearchParams();
  const debouncePriceFrom = useDebounce(searchParams.get("priceFrom") || undefined, 500);
  const debouncePriceTo = useDebounce(searchParams.get("priceTo") || undefined, 500);

  const {
    data: shops,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    [
      "shops",
      language?.locale,
      searchParams.get("longitude"),
      searchParams.get("latitude"),
      searchParams.get("order_by"),
      debouncePriceFrom,
      debouncePriceTo,
      searchParams.get("column"),
      searchParams.get("sort"),
      searchParams.get("category_id"),
      searchParams.getAll("take"),
      searchParams.get("has_discount"),
      searchParams.get("service_type"),
      searchParams.get("gender"),
    ],
    ({ pageParam }) =>
      shopService.getAll({
        lang: language?.locale,
        location_type: "2",
        column: searchParams.has("column") ? searchParams.get("column") : "distance",
        sort: searchParams.has("sort") ? searchParams.get("sort") : "asc",
        "address[latitude]": searchParams.get("latitude") || settings?.latitude,
        "address[longitude]": searchParams.get("longitude") || settings?.longitude,
        page: pageParam,
        order_by: searchParams.get("order_by"),
        "service_prices[0]": debouncePriceFrom,
        "service_prices[1]": debouncePriceTo,
        category_id: searchParams.get("category_id"),
        ...Object.assign(
          {},
          ...searchParams.getAll("take").map((take, index) => ({ [`take[${index}]`]: take }))
        ),
        has_discount: searchParams.has("has_discount") ? searchParams.get("has_discount") : 0,
        service_type: searchParams.get("service_type"),
        gender: searchParams.get("gender"),
      }),
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );

  const shopList = extractDataFromPagination(shops?.pages);
  const renderResult = () => {
    if (shopList && shopList.length !== 0) {
      return (
        <InfiniteLoader hasMore={hasNextPage} loadMore={fetchNextPage} loading={isFetchingNextPage}>
          {shopList?.map((shop) => (
            <ShopCard data={shop} key={shop.id} />
          ))}
        </InfiniteLoader>
      );
    }
    if (isLoading)
      return (
        <>
          {Array.from(Array(12).keys()).map((item) => (
            <ShopCardLoading key={item} />
          ))}
        </>
      );
    if (shopList && shopList.length === 0) {
      return (
        <div className="h-full flex items-center justify-center gap-3">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-primary">
            <SearchIcon />
          </div>
          <span className="text-sm font-medium">{t("no.results")}</span>
        </div>
      );
    }
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorFallback />
      </div>
    );
  };
  return (
    <div className="xl:h-[calc(100vh-100px)] flex flex-col pt-7 xl:mx-7">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">{t("results")}</h2>
        <div className="flex items-center gap-2.5 xl:hidden">
          <IconButton color="grayOutlined" size="medium" onClick={onMapButtonClick}>
            <Map2LineIcon />
          </IconButton>
          <IconButton color="grayOutlined" onClick={onFilterButtonClick} size="medium">
            <FilterLineIcon />
          </IconButton>
        </div>
      </div>
      <div className="overflow-y-auto flex-1 lg:pt-11 pt-4 gap-4 flex flex-col h-full">
        {renderResult()}
      </div>
    </div>
  );
};
