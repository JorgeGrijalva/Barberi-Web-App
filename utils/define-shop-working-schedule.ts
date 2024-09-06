import dayjs from "dayjs";
import { Shop, WorkingDay } from "@/types/shop";
import { weekDays } from "@/config/global";

export const defineShopWorkingSchedule = (data?: Shop) => {
  const today = dayjs().format("YYYY-MM-DD");
  const weekDay = weekDays[dayjs().day()];
  const foundedSchedule = data?.shop_working_days.find((item) => item.day === weekDay);
  const isHoliday = data?.shop_closed_date?.some((item) => dayjs(item.day).isSame(dayjs()));
  const isClosed = !data?.open || isHoliday;
  let schedule = {} as WorkingDay;
  let isTimePassed = false;

  try {
    if (foundedSchedule) {
      schedule = { ...foundedSchedule };
      schedule.from = schedule.from.replace("-", ":");
      schedule.to = schedule.to.replace("-", ":");
      isTimePassed = dayjs().isAfter(`${today} ${schedule.to}`);
    }
  } catch (err) {
    console.log("err => ", err);
  }

  return {
    workingSchedule: schedule,
    isShopClosed: schedule.disabled || isClosed || isTimePassed,
    isOpen: Boolean(data?.open),
  };
};
