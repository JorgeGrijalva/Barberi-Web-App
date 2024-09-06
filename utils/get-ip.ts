import { headers } from "next/headers";

export const getIp = () => {
  const forwardedFor = headers().get("x-forwarded-for");
  const realIp = headers().get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  if (realIp) {
    return realIp.split(",")[0].trim();
  }

  return null;
};
