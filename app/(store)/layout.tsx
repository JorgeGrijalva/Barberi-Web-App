import React from "react";
import { PushNotificationWrapper } from "./push-notification-wrapper";

const StoreLayout = async ({
  children,
  detail,
}: {
  children: React.ReactNode;
  detail: React.ReactNode;
}) => (
  <>
    {detail}
    {children}
    <PushNotificationWrapper />
  </>
);
export default StoreLayout;
