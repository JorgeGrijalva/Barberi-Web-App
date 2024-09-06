"use client";

import { useTranslation } from "react-i18next";

interface TranslateProps {
  value: string;
}

export const Translate = ({ value }: TranslateProps) => {
  const { t } = useTranslation();
  return <>{t(value)}</>;
};
