"use client";

import { Translate } from "@/components/translate";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { MasterCard } from "@/components/master-card";
import { useSettings } from "@/hook/use-settings";
import { useInfiniteQuery } from "@tanstack/react-query";
import { masterService } from "@/services/master";
import { extractDataFromPagination } from "@/utils/extract-data";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { InfiniteLoader } from "@/components/infinite-loader";
import useAddressStore from "@/global-store/address";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

const MastersPage = () => {
  const router = useRouter();
  const { language } = useSettings();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const {
    data: masters,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["masters", language?.locale, country?.region_id, country?.id, city?.id],
    ({ pageParam }) =>
      masterService.list({
        lang: language?.locale,
        page: pageParam,
        region_id: country?.region_id,
        country_id: country?.id,
        city_id: city?.id,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const masterList = extractDataFromPagination(masters?.pages);
  return (
    <section className="xl:container px-4 my-7">
      <h1 className="text-head font-semibold">
        <Translate value="the.best.masters" />
      </h1>
      {masterList?.length !== 0 ? (
        <InfiniteLoader hasMore={hasNextPage} loadMore={fetchNextPage} loading={isFetchingNextPage}>
          <div className="grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4 mt-6">
            {isLoading
              ? Array.from(Array(12).keys()).map((item) => (
                  <div className="rounded-button bg-gray-300 aspect-[1/1.5]" key={item} />
                ))
              : masterList?.map((master) => (
                  <button
                    key={master.id}
                    onClick={() =>
                      router.push(
                        buildUrlQueryParams(
                          `/shops/${master.invite?.shop?.slug}/booking/staff/${master.id}`,
                          {
                            serviceId: master.service_master?.service_id,
                            serviceMasterId: master.service_master?.id,
                          }
                        )
                      )
                    }
                  >
                    <MasterCard data={master} key={master.id} />
                  </button>
                ))}
          </div>
        </InfiniteLoader>
      ) : (
        <Empty animated={false} />
      )}
    </section>
  );
};

export default MastersPage;
