import React from "react";

export const ShopCardLoading = () => (
  <div className="relative group border-b border-gray-link pb-4 flex gap-3 flex-col sm:flex-row animate-pulse">
    <div className="relative  sm:h-[140px] aspect-[345/190] sm:aspect-[190/140] rounded-button overflow-hidden bg-gray-300" />
    <div className="flex flex-col  gap-3  flex-1">
      <div className="h-5 rounded-full  w-full bg-gray-300" />
      <div className="h-3 rounded-full bg-gray-300 w-2/5" />
    </div>
  </div>
);
