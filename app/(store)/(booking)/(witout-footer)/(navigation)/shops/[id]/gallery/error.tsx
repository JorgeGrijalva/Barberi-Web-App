"use client";

import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";

const GlobalError = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4">
      <section className="py-8 px-4 text-center">
        <div className="max-w-auto mx-auto">
          <h2 className="mt-8  text-xl lg:text-5xl font-black">{t("error.message")}</h2>
          <p className="my-2  text-sm lg:text-base text-gray-900">{t("error.descriptoin")}</p>
          <Button onClick={() => window.location.reload()}>{t("reset")}</Button>
        </div>
      </section>
    </div>
  );
};

export default GlobalError;
