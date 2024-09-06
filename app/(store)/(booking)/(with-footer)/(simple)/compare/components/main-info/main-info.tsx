"use client";

import { Stock } from "@/types/product";
import { useMemo } from "react";
import { groupExtrasToCompare } from "@/utils/group-extras-to-compare";
import { Category } from "@/types/category";
import { Brand } from "@/types/brand";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { CompareExtraValue } from "../extra-value";

interface CompareMainInfoProps {
  stocks?: Stock[];
  productIds?: number[];
  productMainInfo: Record<
    number,
    {
      category: Category | null;
      brand: Brand | null;
    }
  >;
}

export const MainInfo = ({
  stocks,
  productIds,

  productMainInfo,
}: CompareMainInfoProps) => {
  const { t } = useTranslation();
  const groupedExtras = useMemo(() => groupExtrasToCompare(stocks), [stocks]);
  const noInfo = t("no.info");

  return (
    <>
      {groupedExtras?.map((groupedExtra) => (
        <tr className="flex" key={groupedExtra.group.id}>
          {productIds?.map((productId, index) => (
            <td
              className={clsx(
                "flex gap-x-2 border-r border-b border-gray-border py-5",
                index === 0
                  ? "min-w-[220px] w-[220px]  pr-[50px]"
                  : "min-w-[270px] w-[270px]  px-[50px]"
              )}
              key={productId}
            >
              <span className="text-black font-medium">
                {groupedExtra?.group?.translation?.title}
              </span>
              <div className="flex flex-wrap gap-2">
                {groupedExtra.values?.[productId]?.length
                  ? groupedExtra.values?.[productId]?.map((extraValue) => (
                      <CompareExtraValue
                        data={extraValue}
                        group={groupedExtra?.group?.type}
                        key={extraValue.id}
                      />
                    ))
                  : t("no.extra")}
              </div>
            </td>
          ))}
        </tr>
      ))}
      <tr className="flex">
        {productIds?.map((productId, index) => (
          <td
            className={clsx(
              "flex gap-x-2 border-r border-b border-gray-border py-5",
              index === 0
                ? "min-w-[220px] w-[220px]  pr-[50px]"
                : "min-w-[270px] w-[270px]  px-[50px]"
            )}
            key={productId}
          >
            <span className="text-base font-medium">{t("brand")}: </span>
            <span className="text-base font-medium">
              {productMainInfo?.[productId]?.brand?.title || noInfo}
            </span>
          </td>
        ))}
      </tr>
    </>
  );
};
