"use client";

import { useEffect } from "react";
import firebaseApp from "@/lib/firebase";
import { toast } from "react-toastify";
import { PushNotificationCard } from "@/components/push-notification/push-notification-card";
import { useQueryClient } from "@tanstack/react-query";
import { IconButton } from "@/components/icon-button";
import CrossIcon from "@/assets/icons/cross";

export const PushNotification = () => {
  const queryClient = useQueryClient();
  const handlePushNotification = async () => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const { getMessaging, onMessage } = await import("firebase/messaging");
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload) => {
        toast(
          <PushNotificationCard
            title={payload.notification?.title}
            body={payload.notification?.body}
            id={payload?.data?.id}
            type={payload?.data?.type}
          />,
          {
            position: "bottom-right",
            className:
              "!bg-white !bg-opacity-60 !rounded-2xl backdrop-blur-lg dark:!bg-dark dark:!bg-opacity-30",
            hideProgressBar: true,
            closeButton: (
              <IconButton>
                <CrossIcon size={20} />
              </IconButton>
            ),
          }
        );
      });

      queryClient.invalidateQueries(["notificationStatistics"]);
      queryClient.invalidateQueries(["notifications"], { exact: false });
      return () => {
        unsubscribe();
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  };
  useEffect(() => {
    handlePushNotification();
  }, []);

  return null;
};
