import React from "react";

export const ParcelDetailLoading = () => (
  <div className="p-5">
    <div className="h-5 rounded-full bg-gray-300 w-40" />
    <div className="flex items-center justify-between px-5 py-[18px] bg-white bg-opacity-30 rounded-2xl mt-7 mb-2.5">
      <div className="bg-gray-300 w-4/5 rounded-full h-4" />
    </div>
    <div className="px-4 pt-[22px] pb-4 bg-white bg-opacity-30 rounded-2xl">
      <div className="bg-gray-300 rounded-full w-60" />
      <div className="bg-white rounded-2xl p-2.5 flex items-center gap-3">
        <div className="flex items-center justify-center rounded-full bg-gray-300 aspect-square h-12 w-12" />
        <div className="flex flex-col flex-1 gap-2">
          <div className="h-3 rounded-full w-3/5 bg-gray-300" />
          <div className="flex items-center justify-between gap-2">
            {Array.from(Array(4).keys()).map((progressItem) => (
              <div
                key={progressItem}
                className="bg-gray-progress
                flex-1 rounded-full h-3"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="h-4 rounded-full w-12 bg-gray-300 mt-10" />
    <div className="my-5 flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <div className="w-14 h-14 rounded-2xl bg-gray-300" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="w-4/5 h-4 bg-gray-300 rounded-full" />
          <div className="w-2/5 h-3 bg-gray-300 rounded-full" />
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="w-14 h-14 rounded-2xl bg-gray-300" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="w-4/5 h-4 bg-gray-300 rounded-full" />
          <div className="w-2/5 h-3 bg-gray-300 rounded-full" />
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="w-14 h-14 rounded-2xl bg-gray-300" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="w-4/5 h-4 bg-gray-300 rounded-full" />
          <div className="w-2/5 h-3 bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);
