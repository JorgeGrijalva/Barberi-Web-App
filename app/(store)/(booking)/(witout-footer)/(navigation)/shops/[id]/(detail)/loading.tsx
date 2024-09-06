import React from "react";

const SingleShopLoading = () => (
  <main className="xl:container px-4 animate-pulse mb-7">
    <div className="relative md:h-[330px] my-7 h-60 rounded-button overflow-hidden bg-gray-300" />
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-7">
      <div className="rounded-button border border-gray-link py-6 px-5 col-span-2">
        <div className="h-5 rounded-full w-[15%] bg-gray-300" />
        <div className="h-3 rounded-full w-[35%] bg-gray-300 mt-4" />
        <div className="w-full h-[270px] rounded-button bg-gray-300 mt-5" />
      </div>
      <div className="rounded-button border border-gray-link py-6 px-5">
        <div className="h-8 rounded-button w-[45%] bg-gray-300" />

        <div className="h-12 rounded-button w-full mt-10 bg-gray-300" />
      </div>
    </div>
  </main>
);

export default SingleShopLoading;
