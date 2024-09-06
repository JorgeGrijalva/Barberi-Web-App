"use client";

import React from "react";
import { WorkingDay } from "@/types/shop";
import dayjs from "dayjs";
import StarIcon from "@/assets/icons/star";
import clsx from "clsx";
import TimerIcon from "@/assets/icons/timer";

interface ShopWorkingDayProps {
  workindDays?: WorkingDay[];
  avgRating?: number;
  dark?: boolean;
}

export const ShopWorkingDay = ({ workindDays, avgRating, dark }: ShopWorkingDayProps) => {
  const today = workindDays?.find(
    (workingDay) => workingDay.day === dayjs().format("dddd").toLocaleLowerCase()
  );
  return (
    <div
      className={clsx(
        "flex items-center gap-3 py-2 px-4 ",
        dark
          ? "bg-dark bg-opacity-30 backdrop-blur-lg rounded-md justify-between"
          : "bg-white bg-opacity-20 backdrop-blur-lg  rounded-full"
      )}
    >
      <div className="flex items-center gap-1">
        {dark && (
          <span className="text-primary">
            <TimerIcon />
          </span>
        )}
        <span className="text-base font-medium text-white whitespace-nowrap">
          {today?.from} — {today?.to}
        </span>
      </div>
      {dark && <div className="w-px bg-white h-4 bg-opacity-20" />}
      <div className="flex items-start gap-1">
        <StarIcon />
        <span className="text-xs text-white font-semibold">{avgRating || 0}</span>
      </div>
    </div>
  );
};
