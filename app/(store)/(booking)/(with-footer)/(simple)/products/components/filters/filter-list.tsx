"use client";

import React from "react";
import { Translate } from "@/components/translate";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/hook/use-settings";
import { LayoutType } from "./layout-type";
import FilterProperties from "./properties";
import { ColorFilters } from "./colors";
import { CheckboxFilter } from "./checkboxes";
import { PriceFilter } from "./price";

export const FilterList = ({ onClose }: { onClose?: () => void }) => {
  const { t } = useTranslation();
  const { currency, language } = useSettings();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = {
    brand_ids: searchParams.getAll("brands"),
    shop_ids: searchParams.getAll("shop_id"),
    category_ids: searchParams.getAll("categories"),
    type: "category",
    currency_id: currency?.id,
    lang: language?.locale,
    extras: searchParams.getAll("extras"),
    has_discount: searchParams.get("has_discount"),
    in_stock: searchParams.get("in_stock"),
  };

  const { data, isLoading } = useQuery(["filters", params], () => productService.filters(params));

  const colors = data?.group.find((groupItem) => groupItem.type === "color");

  const handleClearAll = () => {
    router.replace("/products");
    if (onClose) {
      onClose();
    }
  };
  return (
    <>
      {isLoading && (
        <div className="h-full w-full bg-white xl:block hidden dark:bg-darkBg dark:backdrop-blur-sm dark:bg-opacity-20 bg-opacity-20 backdrop-blur-sm absolute top-0 left-0 z-[2]" />
      )}
      <div className="max-h-screen overflow-y-auto xl:sticky top-2 ">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between mb-10">
            <h6 className="text-xl font-medium">
              <Translate value="filters" />
            </h6>
            <button onClick={handleClearAll} className="text-sm font-medium">
              <Translate value="clear.all" />
            </button>
          </div>
          <LayoutType />

          <CheckboxFilter
            title="categories"
            values={data?.categories}
            initialItemsShown={4}
            keyExtractor={(item) => item.id}
            labelExtractor={(item) => item.title}
            valueExtractor={(item) => item.id}
          />
          <CheckboxFilter
            title="brands"
            values={data?.brands}
            initialItemsShown={7}
            keyExtractor={(item) => item.id}
            labelExtractor={(item) => item.title}
            valueExtractor={(item) => item.id}
          />
          <PriceFilter priceFromServer={data?.price.min} priceToServer={data?.price.max} />
          <FilterProperties />
          {colors && colors.extras.length > 0 && <ColorFilters extras={colors.extras} />}
          <CheckboxFilter
            title="shops"
            values={data?.shops}
            keyExtractor={(item) => item.id}
            labelExtractor={(item) => item.title}
            valueExtractor={(item) => item.id}
            queryKey="shop_id"
          />
          {data?.group.map((groupItem) =>
            groupItem.type !== "color" ? (
              <CheckboxFilter
                title={groupItem.title}
                key={groupItem.id}
                queryKey="extras"
                values={groupItem.extras}
                keyExtractor={(item) => item.id}
                labelExtractor={(item) => item.value}
                valueExtractor={(item) => item.id}
              />
            ) : null
          )}
        </div>
        <Button
          className="mt-2 mb-16 xl:hidden inline-flex"
          onClick={onClose}
          loading={isLoading}
          fullWidth
        >
          {t("show")}
        </Button>
      </div>
    </>
  );
};
