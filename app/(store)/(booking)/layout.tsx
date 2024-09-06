import React from "react";
import SearchProvider from "@/context/search";

const BookingLayout = async ({ children }: { children: React.ReactNode }) => (
  <SearchProvider>{children}</SearchProvider>
);

export default BookingLayout;
