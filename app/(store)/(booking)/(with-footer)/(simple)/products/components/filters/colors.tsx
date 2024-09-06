"use client";

import React, { startTransition } from "react";
import DoubleCheckIcon from "@/assets/icons/double-check";
import { FilterExtraItem } from "@/types/product";
import { useQueryParams } from "@/hook/use-query-params";
import { useTranslation } from "react-i18next";
import { ExpandableFilterWrapper } from "./expandable-fileter-wrapper";

interface ColorFilterProps {
  extras: FilterExtraItem[];
}

export const ColorFilters = ({ extras }: ColorFilterProps) => {
  const { setQueryParams, urlSearchParams } = useQueryParams();
  const selectedColors = urlSearchParams.getAll("extras") || [];
  const { t } = useTranslation();

  const handleSelectColor = (color: FilterExtraItem) => {
    startTransition(() => {
      setQueryParams({ extras: color.id });
    });
  };
  let selectedColorsLength = 0;
  extras.forEach((extra) => {
    if (selectedColors.some((selectedColor) => Number(selectedColor) === extra.id)) {
      selectedColorsLength += 1;
    }
  });
  return (
    <ExpandableFilterWrapper
      defaultOpen
      title="colors"
      subTitle={`${selectedColorsLength} ${t("selected")}`}
    >
      <div className="flex items-center gap-4 flex-wrap">
        {extras.map((color) => (
          <button onClick={() => handleSelectColor(color)} key={color.id}>
            <div
              style={{
                backgroundColor: color.value,
                width: "50px",
                height: "50px",
                color: color.value === "#fff" || color.value === "#ffffff" ? "#000" : "#fff",
              }}
              className="rounded-2xl flex items-center justify-center border border-gray-border dark:border-gray-bold"
            >
              {selectedColors.some((selectedColor) => Number(selectedColor) === color.id) ? (
                <DoubleCheckIcon />
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </ExpandableFilterWrapper>
  );
};
