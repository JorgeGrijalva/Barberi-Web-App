"use client";

import { Button } from "@/components/button";
import React from "react";
import DoubleCheckIcon from "@/assets/icons/double-check";
import { useTranslation } from "react-i18next";

const StoreAccepted = () => {
  const { t } = useTranslation();
  return (
    <section className="flex items-center justify-center flex-col gap-5 h-full flex-1 py-10">
      <div className="rounded-full flex items-center justify-center w-[140px] text-white h-[140px] bg-green bg-opacity-50">
        <DoubleCheckIcon size={40} className="text-badge-category" />
      </div>
      <h3 className="text-3xl font-medium ">{t("shop.accepted")}</h3>
      <Button as="a" href={process.env.NEXT_PUBLIC_ADMIN_PANEL_URL} target="_blank" color="black">
        {t("go.to.admin.panel")}
      </Button>
    </section>
  );
};

export default StoreAccepted;
