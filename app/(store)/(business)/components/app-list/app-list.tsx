"use client";

import { useSettings } from "@/hook/use-settings";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import AnchorLeftIcon from "@/assets/icons/anchor-left";

export const AppList = () => {
  const { settings } = useSettings();
  const { t } = useTranslation();

  const list = [
    {
      link: settings?.customer_app,
      title: "client.app",
      disable: false,
    },
    { link: settings?.customer_app, title: "business.app", disable: false },
    { link: settings?.customer_app, title: "pos.system", disable: true },
    { link: settings?.customer_app, title: "driver.app", disable: true },
  ];

  return (
    <div className="flex flex-col md:gap-7 gap-3">
      {list.map((item) =>
        item.disable ? (
          <div
            key={item.title}
            className="select-none cursor-default text-zinc-300 md:grid flex justify-between grid-cols-2 items-center gap-28 bg-gradient-to-r from-white to-transparent rounded-button md:py-7 py-4 md:px-12 px-5"
          >
            <span className="md:text-2xl text-xl font-medium">{t(item.title)}</span>
            <AnchorLeftIcon style={{ rotate: "180deg" }} />
          </div>
        ) : (
          <Link
            href={item.link || ""}
            key={item.title}
            className="md:grid flex justify-between grid-cols-2 items-center gap-28 bg-gradient-to-r from-white to-transparent rounded-button md:py-7 py-4 md:px-12 px-5"
          >
            <span className="md:text-2xl text-xl font-medium">{t(item.title)}</span>
            <AnchorLeftIcon style={{ rotate: "180deg" }} />
          </Link>
        )
      )}
    </div>
  );
};
