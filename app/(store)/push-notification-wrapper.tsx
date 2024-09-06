"use client";

import dynamic from "next/dynamic";
import useUserStore from "@/global-store/user";

const PushNotification = dynamic(() =>
  import("@/components/push-notification").then((component) => ({
    default: component.PushNotification,
  }))
);
export const PushNotificationWrapper = () => {
  const user = useUserStore((state) => state.user);
  if (!user) return null;
  return <PushNotification />;
};
