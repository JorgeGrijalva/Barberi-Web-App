import React from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import clsx from "clsx";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import AnchorDownIcon from "@/assets/icons/anchor-down";

interface DateSelectProps {
  label?: string;
  value?: Date;
  onChange: (value: Date) => void;
  showPastTime?: boolean;
}

const filterPassedTime = (time: Date) => {
  const currentDate = new Date();
  const selectedDate = new Date(time);

  return currentDate.getTime() < selectedDate.getTime();
};

export const TimeSelect = ({ label, showPastTime, value, onChange }: DateSelectProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex-1">
      <DatePicker
        selected={value}
        customInput={
          <button
            className={clsx(
              "py-4 px-3 rounded-button text-base border border-gray-link flex items-center justify-between min-w-[130px] w-full",
              !value && "text-gray-field"
            )}
          >
            {value ? dayjs(value).format("HH:mm") : t(label || "")}
            <AnchorDownIcon />
          </button>
        }
        showPopperArrow={false}
        closeOnScroll
        showTimeSelect
        showTimeSelectOnly
        filterTime={
          showPastTime || typeof showPastTime === "undefined" ? filterPassedTime : undefined
        }
        timeCaption="Time"
        timeFormat="HH:mm"
        dateFormat="HH:mm"
        // eslint-disable-next-line react/no-unstable-nested-components
        calendarContainer={({ children }) => (
          <div
            className={clsx(
              "border-none relative bg-white rounded-button p-2.5 inline-block shadow-storeCard w-full"
            )}
          >
            {children}
          </div>
        )}
        onChange={(date) => {
          if (date) {
            onChange(date);
          }
        }}
        onSelect={(date) => onChange(date)}
      />
    </div>
  );
};
