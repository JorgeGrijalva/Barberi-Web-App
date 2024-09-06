"use client";

import { useModal } from "@/hook/use-modal";
import dynamic from "next/dynamic";
import { Drawer } from "@/components/drawer";
import { useSettings } from "@/hook/use-settings";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { ShopCard } from "@/components/shop-card";
import { IconButton } from "@/components/icon-button";
import FilterLineIcon from "remixicon-react/FilterLineIcon";
import { useDebounce } from "@/hook/use-debounce";

const Filters = dynamic(
  () =>
    import("../components/filters/filter-list").then((component) => ({
      default: component.FilterList,
    })),
  {
    loading: () => (
      <div className="py-8">
        <div className="h-5 rounded-full bg-gray-300 w-40" />
        <div className="border border-gray-link rounded-button py-4 px-3">
          <div className="h-6 rounded-full bg-gray-300 w-2/5" />
          <div className="h-5 rounded-full bg-gray-300 w-3/5 mt-2.5" />
          <div className="h-5 rounded-full bg-gray-300 w-full mt-2.5" />
          <div className="h-5 rounded-full bg-gray-300 w-3/5 mt-2.5" />
          <div className="h-5 rounded-full bg-gray-300 w-2/5 mt-2.5" />
        </div>
      </div>
    ),
  }
);
const ErrorFallback = dynamic(() => import("@/components/error-fallback"));
const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

const ShopsPage = () => {
  const [isFilterModalOpen, openFilterModal, closeFilterModal] = useModal();
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
      searchParams.getAll("take"),
      searchParams.get("has_discount"),
      searchParams.get("service_type"),
      searchParams.get("gender"),
      searchParams.get("category_id"),
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
        has_discount: searchParams.has("has_discount") ? searchParams.get("has_discount") : 0,
        service_type: searchParams.get("service_type"),
        gender: searchParams.get("gender"),
        ...Object.assign(
          {},
          ...searchParams.getAll("take").map((take, index) => ({ [`take[${index}]`]: take }))
        ),
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
        <div className="lg:col-span-3">
          <div className="flex items-center gap-2.5 xl:hidden my-7 justify-end">
            <IconButton color="grayOutlined" onClick={openFilterModal} size="medium">
              <FilterLineIcon />
            </IconButton>
          </div>
          <InfiniteLoader
            hasMore={hasNextPage}
            loadMore={fetchNextPage}
            loading={isFetchingNextPage}
          >
            <div className="grid xl:grid-cols-3 sm:grid-cols-2 xl:gap-7 md:gap-4 gap-2.5 xl:pt-8 pt-0 pb-8">
              {shopList?.map((shop) => (
                <ShopCard data={shop} key={shop.id} />
              ))}
            </div>
          </InfiniteLoader>
        </div>
      );
    }
    if (isLoading)
      return (
        <div className="grid xl:grid-cols-3 lg:col-span-3 sm:grid-cols-2 xl:gap-7 md:gap-4 gap-2.5 xl:pt-8 pt-0 pb-8 my-7">
          {Array.from(Array(12).keys()).map((item) => (
            <div key={item} className="bg-gray-300 rounded-button aspect-[315/325]" />
          ))}
        </div>
      );
    if (shopList && shopList.length === 0) {
      return (
        <div className="h-full flex items-center justify-center lg:col-span-3">
          <Empty animated={false} />
        </div>
      );
    }
    return (
      <div className="h-full flex items-center justify-center lg:col-span-3">
        <ErrorFallback />
      </div>
    );
  };

  return (
    <section className="xl:container px-4">
      <div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-7">
        <div className="hidden xl:block">
          <Filters />
        </div>
        {renderResult()}
        <Drawer
          withCloseIcon={false}
          open={isFilterModalOpen}
          onClose={closeFilterModal}
          position="bottom"
        >
          <Filters onClose={closeFilterModal} />
        </Drawer>
      </div>
    </section>
  );
};

export default ShopsPage;
