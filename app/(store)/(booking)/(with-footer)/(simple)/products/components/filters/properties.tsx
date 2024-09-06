"use client";

import React from "react";
import clsx from "clsx";
import { Switch } from "@/components/switch";
import { useQueryParams } from "@/hook/use-query-params";
import { useTranslation } from "react-i18next";
import { FilterWrapper } from "./filter-wrapper";

const properties = [
  { title: "in.stock", queryKey: "in_stock" },
  { title: "on.sale", queryKey: "has_discount" },
  { title: "featured", queryKey: "featured" },
];

const FilterProperties = () => {
  const { setQueryParams, urlSearchParams } = useQueryParams();
  const { t } = useTranslation();
  return (
    <FilterWrapper title="properties">
      {properties.map((prop, i) => (
        <div
          className={clsx(
            "flex items-center justify-between py-3",
            i !== properties.length - 1 &&
              "border-b border-gray-border dark:border-gray-inputBorder"
          )}
          key={prop.queryKey}
        >
          <span className="text-sm font-medium">{t(prop.title)}</span>
          <Switch
            defaultChecked={urlSearchParams.get(prop.queryKey) === "1"}
            onChange={(checked) => setQueryParams({ [prop.queryKey]: checked ? "1" : "0" }, false)}
            size="medium"
          />
        </div>
      ))}
    </FilterWrapper>
  );
};
export default FilterProperties;
