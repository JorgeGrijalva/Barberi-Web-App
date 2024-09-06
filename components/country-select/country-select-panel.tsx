"use client";

import { CountrySelectForm } from "@/components/country-select/country-select-form";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const CountrySelectPanel = ({ settings }: { settings: Record<string, string> }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const customUrl = searchParams.get("url");
  return (
    <div className="md:p-8 p-4 rounded-xl bg-white bg-opacity-80 dark:bg-dark dark:bg-opacity-50 backdrop-blur-md grid lg:grid-cols-2 sm:grid-cols-2  gap-2 md:gap-4">
      <div className="relative md:aspect-square aspect-[2/1]">
        <Image
          src={settings?.logo || "/img/cartempty.png"}
          alt={settings?.title || ""}
          className="w-auto h-full object-contain rounded-2xl aspect-square"
          fill
        />
      </div>
      <div className="flex flex-col justify-center">
        <div className="mb-5">
          <span className="text-base font-semibold">
            {t("please.select.your.country.to.shopping")}
          </span>
        </div>
        <CountrySelectForm onSelect={() => router.replace(customUrl || "/")} />
      </div>
    </div>
  );
};

export default CountrySelectPanel;
