"use client";

import ReactSlider from "react-slider";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Price } from "@/components/price";
import { useQueryParams } from "@/hook/use-query-params";
import { Translate } from "@/components/translate";
import { useSearchParams } from "next/navigation";
import { FilterWrapper } from "./filter-wrapper";

interface PriceFilterProps {
  priceFromServer?: number;
  priceToServer?: number;
}

const rangeTypes = {
  fromLow: "min_price",
  fromHigh: "max_price",
};

export const PriceFilter = ({ priceFromServer, priceToServer }: PriceFilterProps) => {
  const searchParams = useSearchParams();
  const [value, setValue] = useState([
    searchParams.has("priceFrom") ? Number(searchParams.get("priceFrom")) : 0,
    searchParams.has("priceTo") ? Number(searchParams.get("priceTo")) : 0,
  ]);
  const [rangeFrom, setRangeFrom] = useState(
    searchParams.has("column") ? searchParams.get("column") : rangeTypes.fromLow
  );
  const { setQueryParams } = useQueryParams();

  useEffect(() => {
    if (!searchParams.has("priceFrom") && !searchParams.has("priceTo")) {
      setValue([priceFromServer || 0, priceToServer || 0]);
    }
  }, [priceFromServer, priceToServer]);

  const handleChangePriceFrom = (priceFromValue: string) => {
    setQueryParams(
      { column: priceFromValue, sort: priceFromValue === rangeTypes.fromLow ? "asc" : "desc" },
      false
    );
    setRangeFrom(priceFromValue);
  };

  return (
    <FilterWrapper title="price.ranges">
      <div className="flex items-center mb-16 bg-gray-button rounded-xl p-1 font-normal">
        <button
          className={clsx(
            "w-1/2 flex items-center justify-center py-2",
            rangeFrom === rangeTypes.fromLow && "shadow-md bg-white rounded-xl"
          )}
          onClick={() => handleChangePriceFrom(rangeTypes.fromLow)}
        >
          <Translate value="by.low.price" />
        </button>
        <button
          className={clsx(
            "w-1/2 flex items-center justify-center py-2",
            rangeFrom === rangeTypes.fromHigh && "shadow-md bg-white rounded-xl"
          )}
          onClick={() => handleChangePriceFrom(rangeTypes.fromHigh)}
        >
          <Translate value="by.high.price" />
        </button>
      </div>
      <div className="flex justify-between mb-3">
        <span>
          <Price number={value[0]} />
        </span>
        <span>
          <Price number={value[1]} />
        </span>
      </div>
      <ReactSlider
        value={value}
        min={priceFromServer}
        max={priceToServer}
        onChange={(values) => {
          setValue(values);
        }}
        onAfterChange={(values) => {
          setQueryParams({ priceFrom: values[0], priceTo: values[1] }, false);
        }}
        className="pb-5"
        renderTrack={(props, state) => {
          const { key, ...otherProps } = props;
          return (
            <div
              key={key}
              {...otherProps}
              className={clsx(
                "h-3 top-[4px] ",
                "rounded-full",
                state.index === 1
                  ? `bg-primary dark:bg-primary top-[16px]`
                  : "bg-sliderTrack dark:bg-gray-darkSegment"
              )}
            />
          );
        }}
        renderThumb={(props) => {
          const { className, key, ...otherProps } = props;
          return (
            <div
              key={key}
              className={clsx(
                "w-10 h-5 rounded-md border-2 border-primary aspect-square bg-gray-100 flex justify-center items-center gap-1 focus-ring outline-none  cursor-grab",
                className
              )}
              {...otherProps}
            >
              <div className="h-2 w-[2px] bg-primary" />
              <div className="h-2 w-[2px] bg-primary" />
              <div className="h-2 w-[2px] bg-primary" />
              {/* <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap"> */}
              {/*  <Price number={state.valueNow} /> */}
              {/* </div> */}
            </div>
          );
        }}
      />
    </FilterWrapper>
  );
};
