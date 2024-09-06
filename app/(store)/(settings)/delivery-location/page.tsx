"use client";

import React from "react";

import { useTranslation } from "react-i18next";
import { success } from "@/components/alert";
import { CountrySelectForm } from "@/components/country-select/country-select-form";

const DeliveryLocation = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 relative">
      <h1 className="font-semibold text-xl mb-5">{t("delivery.location")}</h1>
      <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1">
        <CountrySelectForm onSelect={() => success(t("successfully.updated"))} />
      </div>
    </div>
  );
};

export default DeliveryLocation;
