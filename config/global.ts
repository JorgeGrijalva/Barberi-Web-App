export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const envLocation = process.env.NEXT_PUBLIC_DEFAULT_LOCATION?.split(",");
export const defaultLocation = envLocation
  ? { lat: Number(envLocation[0]), lng: Number(envLocation[1]) }
  : {
      lat: 41.349801,
      lng: 69.2519935,
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

export const service1 = "#FFEDD7";
export const service2 = "#D6FFD2";
export const service3 = "#F1D2D2";
export const service4 = "#D8DCFF";
export const service5 = "#F7D8FF";

export const service6 = "#C3F8FF";
export const service7 = "#E8E8E8";
export const service8 = "#FFE6B4";
export const service9 = "#FFD2E8";
export const service10 = "#C6F4E4";
export const service11 = "#C1E8FF";
export const service12 = "#C2B6A4";

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
