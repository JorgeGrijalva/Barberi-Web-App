"use client";

import { useQueryParams } from "@/hook/use-query-params";
import { RadioGroup } from "@headlessui/react";
import { Fragment } from "react";
import clsx from "clsx";
import { FilterWrapper } from "./filter-wrapper";

interface FilterRadioProps {
  options: {
    title: string;
    value: string | number;
    children?: { title: string; value: string | number }[];
  }[];
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
              <div key={item} className="flex justify-between">
                <div key={item} className="bg-gray-300 h-6 w-4/5 rounded-full" />
                <div key={`${item}_circle`} className="bg-gray-300 h-6 w-[24px] rounded-full" />
              </div>
            ))
          : options?.map((option) => (
              <Fragment key={option.value}>
                <RadioGroup.Option value={option.value.toString()} key={option.value}>
                  {({ checked }) => (
                    <div className="flex items-center justify-between cursor-pointer">
                      <span>{option.title}</span>
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
                {!!option.children?.length &&
                  option.children.map((child, idx) => (
                    <RadioGroup.Option value={child.value.toString()} key={child.value}>
                      {({ checked }) => (
                        <div className="flex items-center justify-between cursor-pointer relative">
                          <div
                            className={clsx(
                              "absolute left-0 bottom-[10px] w-4 border-l-2 border-b-2",
                              idx === 0 ? "h-5" : "h-10"
                            )}
                          />
                          <span className="ml-5 line-clamp-1">{child.title}</span>
                          {checked ? (
                            <div className="flex flex-shrink-0 w-5 h-5 rounded-full items-center justify-center bg-dark">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          ) : (
                            <div className="h-5 w-5 flex-shrink-0 rounded-full border border-gray-field" />
                          )}
                        </div>
                      )}
                    </RadioGroup.Option>
                  ))}
              </Fragment>
            ))}
      </RadioGroup>
    </FilterWrapper>
  );
};
