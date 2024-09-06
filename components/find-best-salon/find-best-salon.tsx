"use client";

import { countryService } from "@/services/country";
import { Country } from "@/types/global";
import { useInfiniteQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/hook/use-settings";
import { extractDataFromPagination } from "@/utils/extract-data";
import { Button } from "@/components/button";

export const FindBestSalon = () => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["regions", language?.locale],
    ({ pageParam }) =>
      countryService.getAll({ lang: language?.locale, page: pageParam, perPage: 12 }),
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const regionList = extractDataFromPagination(data?.pages);
  return (
    <div className="mt-14 mb-14">
      <div className="md:text-[26px] text-xl font-semibold mb-10 text-center">
        {t("best.salon.and.master")}
      </div>
      <ul className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3 gap-4">
        {regionList?.map((item: Country, index: number) => (
          <li className={clsx("text-lg cursor-pointer", index < 6 ? "font-bold" : "")}>
            <Link href={`/search?countryId=${item.id}`}>{item.translation?.title}</Link>
          </li>
        ))}
      </ul>
      <div className="flex justify-center items-center mt-5">
        <Button
          size="small"
          color="black"
          className={clsx("text-lg cursor-pointer")}
          disabled={!hasNextPage}
          loading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {t("load.more")}
        </Button>
      </div>
    </div>
  );
};
