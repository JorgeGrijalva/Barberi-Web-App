import { useEffect, useState } from "react";
import firebaseApp from "@/lib/firebase";

export const useFcmToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState("");

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          const { getToken, getMessaging } = await import("firebase/messaging");
          const messaging = getMessaging(firebaseApp);

          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          if (permission === "granted") {
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
            });
            if (currentToken) {
              setToken(currentToken);
            } else {
              console.log("No registration token available. Request permission to generate one.");
            }
          }
        }
      } catch (error) {
        console.log("An error occurred while retrieving token:", error);
      }
    };

    retrieveToken();
  }, []);

  return { fcmToken: token, notificationPermissionStatus };
};
