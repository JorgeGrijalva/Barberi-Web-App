"use client";

import StarSmileIcon from "@/assets/icons/star-smile";
import clsx from "clsx";
import React from "react";
import ReactSlider from "react-slider";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/review";

interface ReviewSummaryProps {
  type: string;
  typeId?: number;
}

const ReviewSummaryShort = ({ type, typeId }: ReviewSummaryProps) => {
  const { t } = useTranslation();
  const { data } = useQuery(["groupRating", type, typeId], () =>
    reviewService.getGroupRating(type, typeId)
  );
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="flex flex-col gap-4">
        <div className="border border-gray-border dark:border-gray-bold rounded-2xl flex items-center justify-center flex-col flex-1">
          <strong className="text-3xl font-bold">{data?.avg || 0}</strong>
          <span className="text-xs font-medium text-center">{t("total.rating")}</span>
        </div>
        <div className="border border-gray-border dark:border-gray-bold  rounded-2xl flex items-center gap-2 justify-center py-7 flex-wrap">
          <div className="flex items-center gap-0.5">
            <span className="text-yellow">
              <StarSmileIcon />
            </span>

            <span className="text-sm">{data?.count || 0}</span>
          </div>
          <span className="text-xs font-medium">{t("reviews")}</span>
        </div>
      </div>
      <div className="border border-gray-border dark:border-gray-bold  rounded-2xl col-span-3 p-5">
        <div className="flex flex-col gap-6">
          {Array.from(Array(5).keys()).map((index) => {
            let percent = 0;
            if (data && data.count && data.group[index + 1] !== 0) {
              percent = Math.floor((data.group[index + 1] / data.count) * 100);
            }

            return (
              <div className="flex items-center gap-2.5" key={index}>
                <div className="text-sm">
                  {index + 1} {t("star")}
                </div>
                <ReactSlider
                  value={percent}
                  className="flex-1"
                  max={100}
                  disabled
                  renderTrack={(props, state) => {
                    const { key, ...otherProps } = props;
                    return (
                      <div
                        key={key}
                        {...otherProps}
                        className={clsx(
                          state.index === 0 && state.value > 0
                            ? `bg-yellow h-[14px] -translate-y-[5px] rounded-full `
                            : "bg-gray-border dark:border-gray-bold h-1 rounded-r-full"
                        )}
                      />
                    );
                  }}
                />
                <div className="text-sm font-semibold w-4">{percent}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewSummaryShort;
