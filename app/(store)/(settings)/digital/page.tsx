"use client";

import { productService } from "@/services/product";
import { extractDataFromPagination } from "@/utils/extract-data";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { InfiniteLoader } from "@/components/infinite-loader";
import { Empty } from "@/components/empty";
import { useSettings } from "@/hook/use-settings";
import { DigitalCard } from "./components/digital-card";

const MyDigitalProducts = () => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ["digital"],
    ({ pageParam }) => productService.myDigitalFiles({ lang: language?.locale, page: pageParam }),
    {
      suspense: true,
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const digitalProductList = extractDataFromPagination(data?.pages);
  return (
    <div className="lg:w-4/5 w-full">
      <h1 className="font-semibold text-xl mb-5">{t("my.digital.products")}</h1>
      {digitalProductList && digitalProductList.length > 0 ? (
        <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
          <div>
            {digitalProductList?.map((digitalProduct) =>
              digitalProduct.digital_file?.product ? (
                <DigitalCard
                  digitalFileId={digitalProduct.id}
                  data={digitalProduct.digital_file?.product}
                />
              ) : null
            )}
          </div>
        </InfiniteLoader>
      ) : (
        <Empty text={t("there.is.no.digital.products")} />
      )}
    </div>
  );
};

export default MyDigitalProducts;
