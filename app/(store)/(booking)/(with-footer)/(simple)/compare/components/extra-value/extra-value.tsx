"use client";

import { ExtraValue as ExtraValueType } from "@/types/product";
import clsx from "clsx";
import React from "react";
import Image from "next/image";

interface ExtraValueProps {
  data: ExtraValueType;
  group: string;
}

export const CompareExtraValue = ({ data, group }: ExtraValueProps) => {
  if (group === "color") {
    if (!data.img) {
      return (
        <div
          style={{ backgroundColor: data.value }}
          className={clsx(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            data.value === "#ffffff" ? "text-dark  border border-gray-layout" : "text-white"
          )}
        />
      );
    }
    return (
      <div className={clsx("rounded-md")}>
        <Image
          src={data.img}
          alt={data.value}
          width={40}
          height={80}
          className="rounded-md object-contain "
        />
      </div>
    );
  }
  return (
    <div
      className={clsx(
        "py-1.5 px-3 rounded-lg flex items-center justify-center border border-gray-layout text-gray-field"
      )}
    >
      {data?.value}
    </div>
  );
};
