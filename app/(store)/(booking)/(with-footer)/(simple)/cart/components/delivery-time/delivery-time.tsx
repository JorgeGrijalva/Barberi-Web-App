// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DatePicker from "react-mobile-datepicker";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import dayjs from "dayjs";

const monthMap = {
  "1": "Jan",
  "2": "Feb",
  "3": "Mar",
  "4": "Apr",
  "5": "May",
  "6": "Jun",
  "7": "Jul",
  "8": "Aug",
  "9": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec",
};

const dateConfig = {
  date: {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    format: (value: Date) => `${monthMap[value.getMonth() + 1]} ${value.getDate()}`,
    caption: "Day",
    step: 1,
  },
  hour: {
    format: "hh",
    caption: "Hour",
    step: 1,
  },
  minute: {
    format: "mm",
    caption: "Min",
    step: 1,
  },
};

export const DeliveryTime = ({
  onSelect,
  defaultValue,
}: {
  onSelect: (selectedDate: Date) => void;
  defaultValue: Date;
}) => {
  const { t } = useTranslation();
  const [selectedTime, setSelectedTime] = useState(defaultValue);

  return (
    <div className="">
      <div className="p-5">
        <h5 className="text-[22px] font-semibold ">{t("delivery.date")}</h5>
      </div>
      <DatePicker
        min={new Date(Date.now())}
        max={dayjs().add(1, "month").toDate()}
        dateConfig={dateConfig}
        confirmText=""
        cancelText=""
        theme="ios"
        isOpen
        isPopup={false}
        value={selectedTime}
        onChange={(value: Date) => setSelectedTime(value)}
      />
      <div className="p-5">
        <Button onClick={() => onSelect(selectedTime)} fullWidth>
          {t("delivery.date")} - {dayjs(selectedTime).format("MMM DD, HH:mm")}
        </Button>
      </div>
    </div>
  );
};
