import React from "react";

export const FormLoading = () => (
  <div className="lg:w-4/5 w-full">
    <div className="h-5 rounded-full bg-gray-300 w-40 mb-4" />
    <div className="grid md:grid-cols-2 md:gap-24 gap-4">
      <div className="flex flex-col gap-4">
        <div className="bg-gray-300 w-full rounded-2xl h-[60px]" />
        <div className="bg-gray-300 w-full rounded-2xl h-[60px]" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="bg-gray-300 w-full rounded-2xl h-[60px]" />
        <div className="bg-gray-300 w-full rounded-2xl h-[60px]" />
      </div>
    </div>
  </div>
);
