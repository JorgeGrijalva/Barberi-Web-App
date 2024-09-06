"use client";

import { Translate } from "@/components/translate";
import { useQueryParams } from "@/hook/use-query-params";
import { RadioGroup } from "@headlessui/react";

import { FilterWrapper } from "./filter-wrapper";

interface FilterRadioProps {
  options: { title: string; value: number | string }[];
  queryKey: string;
  title: string;
  loading?: boolean;
}

export const FilterRadios = ({ options, queryKey, title, loading }: FilterRadioProps) => {
  const { setQueryParams, urlSearchParams } = useQueryParams();
  const selectedValue = urlSearchParams.get(queryKey);
  return (
    <FilterWrapper title={title}>
      <RadioGroup
        value={selectedValue}
        onChange={(value) => {
          setQueryParams({ [queryKey]: value }, false);
        }}
        className="flex flex-col gap-3"
      >
        {loading
          ? Array.from(Array(3).keys()).map((item) => (
              <div className="flex justify-between">
                <div key={item} className="bg-gray-300 h-6 w-4/5 rounded-full" />
                <div key={`${item}_circle`} className="bg-gray-300 h-6 w-[24px] rounded-full" />
              </div>
            ))
          : options?.map((option) => (
              <RadioGroup.Option value={option.value.toString()} key={option.value}>
                {({ checked }) => (
                  <div className="flex items-center justify-between cursor-pointer">
                    <span>
                      <Translate value={option.title} />
                    </span>
                    {checked ? (
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
