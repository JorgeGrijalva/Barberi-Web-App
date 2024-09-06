"use client";

import clsx from "clsx";
import React from "react";
import ReactSlider from "react-slider";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/review";
import StarMarkIcon from "@/assets/icons/star-mark";
import { createRatingText } from "@/utils/create-rating-text";
import { useSettings } from "@/hook/use-settings";

interface ReviewSummaryProps {
  type: string;
  typeId?: number;
  reviewAvg?: number;
  reviewCount?: number;
}

const ReviewSummary = ({ type, typeId, reviewAvg, reviewCount }: ReviewSummaryProps) => {
  const { t } = useTranslation();
  const { currency } = useSettings();
  const { data } = useQuery(["groupRating", type, typeId], () =>
    reviewService.getRating({
      type: type === "shops" ? "shop" : type,
      type_id: typeId,
      currency_id: currency?.id,
    })
  );
  return (
    <div className="grid md:grid-cols-3 grid-cols-1 md:gap-x-4 gap-y-4">
      <div className="flex flex-col gap-4">
        <div className="border border-gray-border dark:border-gray-bold rounded-button flex items-center justify-center flex-col flex-1 gap-2 bg-gray-card aspect-[1.2/1] md:aspect-auto">
          <strong className="text-[40px] font-bold">{reviewAvg || 0}</strong>
          <StarMarkIcon />
          <span className="text-lg font-semibold">{createRatingText(reviewAvg)}</span>
          <span>
            {t("based.on")} {reviewCount || 0} {t("reviews")}
          </span>
        </div>
      </div>
      <div className="col-span-2">
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-6">
          {Object.entries(data?.data || {}).map(([key, value]) => (
            <div className="" key={key}>
              <div className="text-sm mb-2 font-medium">{t(key)}</div>
              <ReactSlider
                value={value}
                className="flex-1"
                max={10}
                disabled
                renderTrack={(props, state) => {
                  const { key: sliderKey, ...otherProps } = props;
                  return (
                    <div
                      key={sliderKey}
                      {...otherProps}
                      className={clsx(
                        state.index === 0 && state.value > 0
                          ? `bg-yellow  h-1  rounded-full `
                          : "bg-gray-border dark:border-gray-bold h-1 rounded-r-full"
                      )}
                    />
                  );
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSummary;
