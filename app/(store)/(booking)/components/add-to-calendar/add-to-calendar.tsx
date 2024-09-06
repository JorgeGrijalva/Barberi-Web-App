import { Booking } from "@/types/booking";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { createEvent, EventAttributes } from "ics";
import { saveAs } from "file-saver";
import CalendarIcon from "@/assets/icons/calendar";
import { googleCalendarEventCreateUrl } from "@/config/global";

dayjs.extend(utc);

interface AddToCalendarProps {
  data: Booking;
}

export const AddToCalendar = ({ data }: AddToCalendarProps) => {
  const { t } = useTranslation();
  const interval = data.service_master?.interval || 0;
  const intervalHour = Math.floor(interval / 60);
  const intervalMinute = Math.floor(interval % 60);
  const endTime = dayjs(data.start_date).add(data.service_master?.interval || 0, "minutes");
  const utcDate = dayjs.utc(data.start_date);
  const googleCalendarLink = buildUrlQueryParams(googleCalendarEventCreateUrl, {
    text: data.service_master?.service?.translation?.title,
    dates: `${utcDate.format("YYYYMMDD")}T${utcDate.format("HHmm")}/${dayjs
      .utc(endTime)
      .format("YYYYMMDD")}%${dayjs.utc(endTime).format("HHmm")}`,
    details: data.service_master?.shop?.translation?.title,
    location: data.data
      ? `${data.data.lat},${data.data.long}`
      : `${data.shop?.lat_long.latitude},${data.shop?.lat_long.longitude}`,
  });
  const event: EventAttributes = {
    start: [
      Number(utcDate.format("YYYY")),
      Number(utcDate.format("MM")),
      Number(utcDate.format("DD")),
      Number(utcDate.format("HH")),
      Number(utcDate.format("mm")),
    ],
    duration: { hours: intervalHour, minutes: intervalMinute },
    title: data.service_master?.service?.translation?.title,
    description: data.shop?.translation?.title,
    location:
      data.data && typeof data.data.address === "string"
        ? data.data.address
        : data.shop?.translation?.address || "",
    url: window.location.href,
    geo: {
      lat:
        data.data && typeof data.data.lat === "number"
          ? data.data.lat
          : Number(data.shop?.lat_long.latitude),
      lon:
        data.data && typeof data.data.long === "number"
          ? data.data.long
          : Number(data.shop?.lat_long.longitude),
    },
    categories: ["booking"],
    status: "CONFIRMED",
    busyStatus: "BUSY",
    organizer: { name: data.master?.firstname, email: data.master?.email },
    attendees: [],
  };

  const handleSave = () => {
    createEvent(event, (error, value) => {
      const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "event-schedule.ics");
    });
  };
  return (
    <div className="sm:pt-12 sm:pb-12 sm:px-12 pt-16 pb-6 px-4">
      <div className="text-head font-semibold">{t("add.to.calendar")}</div>
      <div className="grid grid-cols-2 gap-5 mt-10">
        <Link
          href={googleCalendarLink}
          target="_blank"
          className="flex flex-col items-center justify-center gap-2 border border-gray-field rounded-button hover:bg-gray-link  py-7"
        >
          <Image src="/img/calendar.png" alt="calendar" width={60} height={60} />
          <span className="text-lg font-medium">{t("google.calendar")}</span>
        </Link>
        <button
          onClick={handleSave}
          className="flex flex-col items-center justify-center gap-2 border border-gray-field rounded-button hover:bg-gray-link  py-7"
        >
          <CalendarIcon size={60} />
          <span className="text-lg font-medium">{t("other.calendars")}</span>
        </button>
      </div>
    </div>
  );
};
