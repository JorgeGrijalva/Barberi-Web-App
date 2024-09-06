"use client";

import { Translate } from "@/components/translate";
import { useInfiniteQuery } from "@tanstack/react-query";
import { masterService } from "@/services/master";
import { extractDataFromPagination } from "@/utils/extract-data";
import { MasterCard } from "@/components/master-card";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { useSettings } from "@/hook/use-settings";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

interface MastersProps {
  shopId?: number;
  shopSlug?: string;
}

export const Masters = ({ shopId, shopSlug }: MastersProps) => {
  const router = useRouter();
  const { language, currency } = useSettings();
  const { data: masters, isLoading } = useInfiniteQuery(
    ["masters", shopId, language?.locale],
    () =>
      masterService.list({ shop_id: shopId, lang: language?.locale, currency_id: currency?.id }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const masterList = extractDataFromPagination(masters?.pages);
  return (
    <div className="border border-gray-link rounded-button col-span-2 py-6 px-5">
      <h2 className="text-xl font-semibold">
        <Translate value="our.specialists" />
      </h2>
      {masterList?.length !== 0 ? (
        <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 md:gap-4 gap-2.5 mt-6">
          {isLoading
            ? Array.from(Array(12).keys()).map((item) => (
                <div className="rounded-button bg-gray-300 aspect-[1/1.5]" key={item} />
              ))
            : masterList?.map((master) => (
                <button
                  key={master.id}
                  onClick={() =>
                    router.push(
                      buildUrlQueryParams(`/shops/${shopSlug}/booking/staff/${master.id}`, {
                        serviceId: master.service_master?.service_id,
                        serviceMasterId: master.service_master?.id,
                      })
                    )
                  }
                >
                  <MasterCard data={master} key={master.id} />
                </button>
              ))}
        </div>
      ) : (
        <Empty animated={false} smallText />
      )}
    </div>
  );
};
