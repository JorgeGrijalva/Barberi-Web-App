"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/checkbox";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { useQueryParams } from "@/hook/use-query-params";
import { Button } from "@/components/button";
import { FilterWrapper } from "./filter-wrapper";

interface CheckboxFilterProps<T> {
  title: string;
  values?: T[];
  initialItemsShown?: number;
  keyExtractor: (item: T) => string | number;
  valueExtractor: (item: T) => string | number;
  labelExtractor: (item: T) => string;
  queryKey?: string;
}

export const CheckboxFilter = <T,>({
  title,
  values,
  initialItemsShown = 4,
  keyExtractor,
  valueExtractor,
  labelExtractor,
  queryKey,
}: CheckboxFilterProps<T>) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { setQueryParams } = useQueryParams();
  const allSelectedItems = searchParams.has(queryKey || title)
    ? searchParams.getAll(queryKey || title)
    : [];
  const totalLength = values?.length || 0;
  const [visibleItems, setVisibleItems] = useState(initialItemsShown);

  const showMoreItems = () => {
    setVisibleItems((prev) => Math.min(prev + 4, totalLength));
  };

  return (
    <FilterWrapper
      title={title || ""}
      subTitle={`${searchParams.getAll(queryKey || title).length} ${t("selected")}`}
    >
      {values?.slice(0, visibleItems)?.map((item) => (
        <div key={keyExtractor(item)} className="py-4">
          <Checkbox
            onChange={(e) => setQueryParams({ [queryKey || title]: e.target.value })}
            value={valueExtractor(item)}
            label={labelExtractor(item)}
            checked={allSelectedItems.includes(valueExtractor(item).toString())}
          />
        </div>
      ))}
      <Button
        fullWidth
        size="small"
        color="gray"
        onClick={showMoreItems}
        disabled={totalLength <= visibleItems}
      >
        {t("see.more")}
      </Button>
    </FilterWrapper>
  );
};
