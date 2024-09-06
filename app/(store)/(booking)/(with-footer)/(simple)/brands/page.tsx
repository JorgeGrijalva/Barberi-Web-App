"use client";

import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { brandService } from "@/services/brand";
import { extractDataFromPagination } from "@/utils/extract-data";
import { Empty } from "@/components/empty";
import { InfiniteLoader } from "@/components/infinite-loader";
import { BrandCard } from "@/components/brand-card";
import { Translate } from "@/components/translate";
import Link from "next/link";
import { useSettings } from "@/hook/use-settings";
import { SearchInput } from "./components/search";
import Loading from "./loading";

const Banners = () => {
  const { language } = useSettings();
  const [searchValue, setSearchValue] = useState<string>("");
  const params: { lang?: string; search?: string } = {
    lang: language?.locale,
    search: searchValue,
  };
  if (!params?.search?.trim()?.length) {
    delete params?.search;
  }

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["brands", params],
    queryFn: ({ pageParam }) => brandService.getAll({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
  });
  const brandList = extractDataFromPagination(data?.pages);

  const renderResult = () => {
    if (brandList && brandList.length === 0) {
      return <Empty text="no.brands.found" />;
    }
    if (isLoading) return <Loading />;
    return (
      <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
        <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
          {brandList?.map((brand) => (
            <Link href={`/products?brands=${brand.id}`}>
              <BrandCard data={brand} key={brand.id} />
            </Link>
          ))}
        </div>
      </InfiniteLoader>
    );
  };

  return (
    <div className="px-4 xl:container my-14">
      <SearchInput searchValue={searchValue} setSearchValue={setSearchValue} />
      <h1 className="md:text-[26px] text-xl font-semibold my-7">
        <Translate value="brands" />
      </h1>
      {renderResult()}
    </div>
  );
};

export default Banners;
