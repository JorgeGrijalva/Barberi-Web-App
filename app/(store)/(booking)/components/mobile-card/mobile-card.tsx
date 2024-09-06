"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import Image from "next/image";

interface MobileCardProps {
  img: string;
  title: string;
  description?: string;
}

export const MobileCard = ({ img, description, title }: MobileCardProps) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-button overflow-hidden aspect-[345/410] md:aspect-[2/1] relative">
      <Image src={img} alt={title} fill className="object-cover" />
      <div className="flex flex-col relative z-[1] h-full md:p-10 p-5 bg-dark bg-opacity-50">
        <div className="flex-1">
          <div className="text-white text-[38px] font-semibold">{t(title)}</div>
          <span className="text-white md:text-lg text-sm">{t(description || "")}</span>
        </div>
        <div>
          <Button
            onClick={() => {
              console.log("Próximamente");
            }}
            color="white"
            className="bg-zinc-400 cursor-default"
            size="medium"
          >
            {/* {t("download")} */}
            {t("coming.soon")}...
          </Button>
        </div>
      </div>
    </div>
  );
};
