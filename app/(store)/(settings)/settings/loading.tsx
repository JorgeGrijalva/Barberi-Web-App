import React from "react";

const SettingsLoading = () => (
  <div className="flex-1">
    <div className="lg:w-4/5 w-full">
      <div className="grid md:grid-cols-2 gap-24">
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="bg-gray-300 rounded-2xl h-16" />
          <div className="bg-gray-300 rounded-2xl h-16" />
          <div className="bg-gray-300 rounded-2xl h-16" />
          <div className="bg-gray-300 rounded-2xl h-16" />
        </div>
      </div>
    </div>
  </div>
);

export default SettingsLoading;
