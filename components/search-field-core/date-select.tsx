import React from "react";

import "react-day-picker/dist/style.css";
import { IconButton } from "@/components/icon-button";
import AnchorLeftIcon from "@/assets/icons/anchor-left";
import dayjs from "dayjs";
import { CaptionProps, DayPicker, useNavigation } from "react-day-picker";

interface DateSelectProps {
  value?: Date;
  onChange: (value?: Date) => void;
}

const CustomCaption = ({ displayMonth }: CaptionProps) => {
  const { goToMonth, nextMonth, previousMonth } = useNavigation();
  return (
    <div className="flex items-center justify-between">
      <IconButton
        disabled={!previousMonth}
        onClick={() => previousMonth && goToMonth(previousMonth)}
      >
        <span className="text-gray-field">
          <AnchorLeftIcon size={16} />
        </span>
      </IconButton>
      <span className="text-sm font-semibold">{dayjs(displayMonth).format("MMMM YYYY")}</span>
      <IconButton disabled={!nextMonth} onClick={() => nextMonth && goToMonth(nextMonth)}>
        <span className="text-gray-field">
          <AnchorLeftIcon size={16} style={{ rotate: "180deg" }} />
        </span>
      </IconButton>
    </div>
  );
};

export const DateSelect = ({ value, onChange }: DateSelectProps) => (
  <div className="w-full">
    <DayPicker
      mode="single"
      selected={value}
      onSelect={onChange}
      components={{ Caption: CustomCaption }}
      classNames={{
        head: "text-gray-field text-xs font-medium tracking-widest",
        day: "text-base p-1 w-full h-full rounded-full !py-3 md:!py-0",
        day_selected: "!bg-dark !text-white hover:!!bg-dark",
        table: "!max-w-none w-full mt-6 md:mt-0",
        month: "flex-1",
      }}
      disabled={{ before: new Date() }}
    />
  </div>
);
