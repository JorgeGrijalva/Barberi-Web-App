"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import TimeLineIcon from "remixicon-react/TimeLineIcon";

const StoreWaiting = () => {
  const { t } = useTranslation();
  return (
    <section className="flex items-center justify-center flex-col gap-5 h-full flex-1 py-10">
      <div className="rounded-full w-[140px] h-[140px] flex items-center justify-center text-white bg-yellow bg-opacity-80">
        <TimeLineIcon size={40} />
      </div>
      <h3 className="text-3xl font-medium ">{t("the.shop.is.currently.under.review")}</h3>
    </section>
  );
};

export default StoreWaiting;
