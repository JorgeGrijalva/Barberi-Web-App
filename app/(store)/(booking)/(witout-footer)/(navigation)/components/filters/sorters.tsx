"use client";

import { useEffect, useState } from "react";
import { useQueryParams } from "@/hook/use-query-params";
import { RadioGroup } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { FilterWrapper } from "./filter-wrapper";

interface SorterProps {
  options?: { key: string; value: string; queryKey: string }[];
  title: string;
  loading?: boolean;
  setClearCallback: (callback: () => void) => void;
}

export const Sorters = ({ options, title, loading, setClearCallback }: SorterProps) => {
  const { t } = useTranslation();
  const { setQueryParams, urlSearchParams, deleteParams } = useQueryParams();
  const [selectedOption, setSelectedOption] = useState({
    queryKey: urlSearchParams.has("has_discount") ? "has_discount" : urlSearchParams.get("column"),
    value: urlSearchParams.has("has_discount")
      ? urlSearchParams.get("has_discount")
      : urlSearchParams.get("sort"),
  });

  useEffect(() => {
    setClearCallback(() => {
      setSelectedOption({
        queryKey: urlSearchParams.has("has_discount")
          ? "has_discount"
          : urlSearchParams.get("column"),
        value: urlSearchParams.has("has_discount")
          ? urlSearchParams.get("has_discount")
          : urlSearchParams.get("sort"),
      });
    });
  }, [
    urlSearchParams.get("column"),
    urlSearchParams.get("sort"),
    urlSearchParams.get("has_discount"),
  ]);

  const handleChange = (value: { value: string; queryKey: string }) => {
    const isDiscount = value?.queryKey === "has_discount";
    if (isDiscount || urlSearchParams.has("has_discount")) {
      deleteParams("has_discount");
      deleteParams("column");
      deleteParams("sort");
    }

    setQueryParams(
      isDiscount
        ? { [value.queryKey]: value?.value }
        : { column: value.queryKey, sort: value.value },
      false
    );
  };

  return (
    <FilterWrapper title={title}>
      <RadioGroup value={selectedOption} onChange={handleChange} className="flex flex-col gap-3">
        {loading
          ? Array.from(Array(9).keys()).map((item) => (
              <div className="flex justify-between">
                <div key={item} className="bg-gray-300 h-6 w-4/5 rounded-full" />
                <div key={`${item}_circle`} className="bg-gray-300 h-6 w-[24px] rounded-full" />
              </div>
            ))
          : options?.map((option) => (
              <RadioGroup.Option
                value={{ value: option.value, queryKey: option.queryKey }}
                key={option.key}
              >
                {() => (
                  <div className="flex items-center justify-between gap-x-2 cursor-pointer">
                    <span className="w-4/5 whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {t(option.key)}
                    </span>
                    {option.value === selectedOption.value &&
                    option.queryKey === selectedOption.queryKey ? (
                      <div className="flex w-5 h-5 rounded-full items-center justify-center bg-dark">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 rounded-full border border-gray-field" />
                    )}
                  </div>
                )}
              </RadioGroup.Option>
            ))}
      </RadioGroup>
    </FilterWrapper>
  );
};
