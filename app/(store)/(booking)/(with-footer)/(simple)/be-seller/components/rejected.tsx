"use client";

import React from "react";
import CrossIcon from "@/assets/icons/cross";
import { useTranslation } from "react-i18next";

const StoreRejected = () => {
  const { t } = useTranslation();
  return (
    <section className="flex items-center justify-center flex-col gap-5 h-full flex-1 py-10">
      <div className="rounded-full w-[140px] h-[140px] flex items-center text-white justify-center bg-red bg-opacity-80">
        <CrossIcon size={40} className="text-badge-product" />
      </div>
      <h3 className="text-3xl font-medium ">{t("your.shop.was.canceled")}</h3>
    </section>
  );
};

export default StoreRejected;
