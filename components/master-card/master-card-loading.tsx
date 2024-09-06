import React from "react";

export const MasterCardLoading = () => (
  <div className="relative rounded-button overflow-hidden group border border-gray-link justify-start animate-pulse">
    <div className="relative aspect-[198/182] bg-gray-300" />
    <div className="xl:pb-5 lg:pb-3 lg:px-3 pb-2 px-1">
      <div className="h-[18px] mt-5 rounded-button bg-gray-300 w-3/4" />
      <div className="h-3 rounded-full mt-2 bg-gray-300 w-1/3" />
      <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-gray-link">
        <div className="h-4 rounded-button bg-gray-300 w-1/2" />
      </div>
    </div>
  </div>
);
