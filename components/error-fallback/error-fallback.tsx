"use client";

import { useTranslation } from "react-i18next";
import CrossIcon from "@/assets/icons/cross";

interface ErrorFallbackProps {
  text?: string;
}

const ErrorFallback = ({ text }: ErrorFallbackProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center gap-4 flex-col">
      <div className="w-14 h-14 rounded-full border border-gray-link flex items-center justify-center">
        <CrossIcon />
      </div>
      <span className="text-sm">{t(text || "unexpected.error.occured")}</span>
    </div>
  );
};

export default ErrorFallback;
