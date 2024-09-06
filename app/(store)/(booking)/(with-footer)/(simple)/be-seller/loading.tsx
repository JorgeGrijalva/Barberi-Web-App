import React from "react";
import { BrandCardLoading } from "@/components/brand-card";

const Loading = () => (
  <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
    {Array.from(Array(10).keys()).map((item) => (
      <BrandCardLoading key={item} />
    ))}
  </div>
);

export default Loading;
