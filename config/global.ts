export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const envLocation = process.env.NEXT_PUBLIC_DEFAULT_LOCATION?.split(",");
export const defaultLocation = envLocation
  ? { lat: Number(envLocation[0]), lng: Number(envLocation[1]) }
  : {
      lat: 28.6353,
      lng: 106.0889,
    };

export const activeOrderStatuses = ["new", "accepted", "ready", "on_a_way"];
export const finishedOrderStatuses = ["delivered", "canceled"];

export const redirectNotificationTypesMap: Record<string, string> = {
  order: "orders",
  parcelorder: "parcels",
  blog: "news",
  booking: "bookings",
};

export const externalPayments = ["stripe", "razorpay", "paystack", "mollie", "moyasar"];
export const internalPayments = ["cash", "wallet"];
export const storyTiming = 10;

export const cardColors = ["#B9CCDF80", "#E3CDE180"];

export const service1 = "#0033FF30";
export const service2 = "#0033FF30";
export const service3 = "#0033FF30";
export const service4 = "#0033FF30";
export const service5 = "#0033FF30";

export const service6 = "#0033FF30";
export const service7 = "#0033FF30";
export const service8 = "#0033FF30";
export const service9 = "#0033FF30";
export const service10 = "#0033FF30";
export const service11 = "#0033FF30";
export const service12 = "#0033FF30";

export const serviceColors = [
  service1,
  service2,
  service3,
  service4,
  service5,
  service6,
  service7,
  service8,
  service9,
  service10,
  service11,
  service12,
];

export const serviceBgs = [
  "/img/service1.png",
  "/img/service2.png",
  "/img/service3.png",
  "/img/service4.png",
  "/img/service5.png",
  "/img/service6.png",
  "/img/service7.png",
  "/img/service8.png",
  "/img/service9.png",
  "/img/service10.png",
  "/img/service11.png",
  "/img/service12.png",
];

export const weekDays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const googleCalendarEventCreateUrl = "https://calendar.google.com/calendar/u/0/r/eventedit";
