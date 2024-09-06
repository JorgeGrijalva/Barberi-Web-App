import React from "react";
import BookingProvider from "@/context/booking";

const ShopDetailLayout = ({ children }: { children: React.ReactNode }) => (
  <BookingProvider>{children}</BookingProvider>
);

export default ShopDetailLayout;
