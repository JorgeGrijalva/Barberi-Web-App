"use client";

import { useSettings } from "@/hook/use-settings";
import Link from "next/link";
import Image from "next/image";

export const MobileLinks = () => {
  const { settings } = useSettings();
  return (
    <div className="flex items-center gap-2.5  mb-8 md:mb-0 absolute md:static w-full bottom-0 px-4 xl:px-0">
      <Link href={settings?.customer_app_ios || ""} target="_blank">
        <Image src="/img/apple_store.png" alt="applestore" width={147} height={55} />
      </Link>

      <Link href={settings?.customer_app_android || ""} target="_blank">
        <Image src="/img/play_market.png" alt="playmarket" width={147} height={55} />
      </Link>
    </div>
  );
};
