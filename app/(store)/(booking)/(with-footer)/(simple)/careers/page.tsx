"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSettings } from "@/hook/use-settings";
import { infoService } from "@/services/info";
import dynamic from "next/dynamic";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { Translate } from "@/components/translate";
import Link from "next/link";
import AnchorLeftIcon from "@/assets/icons/anchor-left";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

const CareersPage = () => {
  const { language } = useSettings();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["careers", language?.locale],
    ({ pageParam }) => infoService.careerList({ lang: language?.locale, page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );

  const careerList = extractDataFromPagination(data?.pages);

  if (careerList && careerList.length === 0) {
    return (
      <section className="xl:container px-4 py-7">
        <h1 className="md:text-head text-xl font-semibold">
          <Translate value="careers" />
        </h1>
        <Empty animated={false} smallText />
      </section>
    );
  }

  return (
    <section className="xl:container px-4 py-7">
      <h1 className="text-head  font-semibold">
        <Translate value="careers" />
      </h1>
      <InfiniteLoader hasMore={hasNextPage} loadMore={fetchNextPage} loading={isFetchingNextPage}>
        <div className="flex flex-col gap-3 my-7">
          {isLoading
            ? Array.from(Array(5).keys()).map((item) => (
                <div key={item} className="h-20 rounded-button bg-gray-300 animate-pulse" />
              ))
            : careerList?.map((career) => (
                <Link
                  href={`/careers/${career.id}`}
                  className="border md:border-none border-gray-link rounded-button md:rounded-none"
                >
                  <div
                    key={career.id}
                    className="flex items-center justify-between flex-wrap gap-5 md:border-b px-3 md:px-0 border-gray-link py-3 ralative"
                  >
                    <div>
                      <p className="text-lg font-semibold">{career.translation?.title}</p>
                      <span className="text-sm text-gray-field">
                        <Translate value="role" />
                      </span>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{career.category?.translation?.title}</p>
                      <span className="text-sm text-gray-field">
                        <Translate value="category" />
                      </span>
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{career.translation?.address}</p>
                      <span className="text-sm text-gray-field">
                        <Translate value="location" />
                      </span>
                    </div>
                    <div className="hidden md:block">
                      <AnchorLeftIcon style={{ rotate: "180deg" }} />
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </InfiniteLoader>
    </section>
  );
};

export default CareersPage;
