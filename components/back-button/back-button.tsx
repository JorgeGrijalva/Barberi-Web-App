"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import ArrowLeftIcon from "@/assets/icons/arrow-left";

interface BackButtonProps {
  title?: string;
  onClick?: () => void;
}

export const BackButton = ({ title = "back", onClick }: BackButtonProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.back();
        if (onClick) {
          onClick();
        }
      }}
      className="md:text-[22px] text-lg font-semibold flex items-center focus-ring outline-none rtl:flex-row-reverse gap-2.5"
    >
      <ArrowLeftIcon />
      {t(title)}
    </button>
  );
};
