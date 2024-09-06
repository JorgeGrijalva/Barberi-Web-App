"use client";

import React, { useState } from "react";
import { Radio } from "@/components/radio";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { useQueryParams } from "@/hook/use-query-params";
import { Button } from "@/components/button";
import { FilterWrapper } from "./filter-wrapper";

interface RadioFilterProps<T> {
  title: string;
  values?: T[];
  initialItemsShown?: number;
  keyExtractor: (item: T) => string | number;
  valueExtractor: (item: T) => string | number;
  labelExtractor: (item: T) => string;
  queryKey?: string;
  showMoreButton?: boolean;
}

export const RadioFilter = <T,>({
  title,
  values,
  initialItemsShown = 4,
  keyExtractor,
  valueExtractor,
  labelExtractor,
  queryKey,
  showMoreButton = true,
}: RadioFilterProps<T>) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const selectedItems = searchParams.getAll(queryKey || title);
  const { setQueryParams } = useQueryParams();
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
      {values?.slice(0, showMoreButton ? visibleItems : values?.length)?.map((item) => (
        <div key={keyExtractor(item)} className="py-4">
          <Radio
            id={valueExtractor(item).toString()}
            onChange={(e) => setQueryParams({ [queryKey || title]: e.target.value }, false)}
            value={valueExtractor(item)}
            label={labelExtractor(item)}
            defaultChecked={selectedItems.includes(valueExtractor(item).toString())}
            checked={selectedItems.includes(valueExtractor(item).toString())}
          />
        </div>
      ))}
      {showMoreButton && (
        <Button
          fullWidth
          size="small"
          color="gray"
          onClick={showMoreItems}
          disabled={totalLength <= visibleItems}
        >
          {t("see.more")}
        </Button>
      )}
    </FilterWrapper>
  );
};
