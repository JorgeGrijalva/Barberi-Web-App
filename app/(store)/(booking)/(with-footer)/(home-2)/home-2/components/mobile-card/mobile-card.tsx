"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import Image from "next/image";

interface MobileCardProps {
  img?: string;
  title?: string;
  description?: string;
}

export const MobileCard = ({ img = "", description, title }: MobileCardProps) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-button overflow-hidden aspect-[231/180] relative bg-giantsOrange">
      {Boolean(img) && <Image src={img} alt={title || ""} fill className="object-cover" />}
      <div className="flex flex-col h-full relative z-[1] pt-16 pl-11 pr-10 pb-14">
        <div className="flex-1">
          <div className="text-white text-[50px] font-semibold">{t(title || "")}</div>
          <span className="text-white text-lg">{t(description || "")}</span>
        </div>

        <div>
          {title && (
            <Button color="black" size="medium">
              {t("download")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
