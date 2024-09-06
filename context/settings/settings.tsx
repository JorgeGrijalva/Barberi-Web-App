"use client";

import React, { createContext, useContext, useEffect, useMemo } from "react";
import { Country, Currency, Language } from "@/types/global";
import { defaultLocation } from "@/config/global";
import useSettingsStore from "@/global-store/settings";
import { setCookie } from "cookies-next";
import useAddressStore from "@/global-store/address";

interface SettingsType {
  defaultCurrency?: Currency;
  defaultLanguage?: Language;
  settings?: Record<string, string>;
  languages?: Language[];
  currencies?: Currency[];
  defaultCountry?: Country;
}

interface SettingsProviderProps extends React.PropsWithChildren, SettingsType {}

const SettingsContext = createContext<SettingsType>({});

const SettingsProvider = ({
  defaultCurrency,
  settings,
  defaultLanguage,
  children,
  languages,
  currencies,
  defaultCountry,
}: SettingsProviderProps) => {
  const selectedLanguage = useSettingsStore((state) => state.selectedLanguage);
  const selectedCurrency = useSettingsStore((state) => state.selectedCurrency);
  const selectedCountry = useAddressStore((state) => state.country);
  const updateLanguage = useSettingsStore((state) => state.updateSelectedLanguage);
  const updateCurrency = useSettingsStore((state) => state.updateSelectedCurrency);
  const updateCountry = useAddressStore((state) => state.updateCountry);
  // const openCountrySelectModal = useAddressStore((state) => state.openCountrySelectModal);
  const updateCity = useAddressStore((state) => state.updateCity);
  const tempSelectedLanguage = languages?.find((lang) => lang.id === selectedLanguage?.id);
  const tempSelectedCurrency = currencies?.find((currency) => currency.id === selectedCurrency?.id);
  const tempSettings = { ...settings };
  const coordinate = {
    latitude: defaultLocation.lat.toString(),
    longitude: defaultLocation.lng.toString(),
  };
  if (settings?.location) {
    const tempLocation = settings.location.split(",");
    coordinate.latitude = tempLocation[0].trim();
    coordinate.longitude = tempLocation[1].trim();
  }
  if (settings) {
    tempSettings.latitude = coordinate.latitude;
    tempSettings.longitude = coordinate.longitude;
  }

  if (!selectedCountry?.id && defaultCountry?.id) {
    updateCountry(defaultCountry);
    if (defaultCountry?.city) {
      updateCity(defaultCountry.city);
    }
  }

  const memoizedValues = useMemo(
    () => ({ defaultLanguage, defaultCurrency, settings: tempSettings }),
    []
  );

  useEffect(() => {
    if (tempSelectedLanguage) {
      updateLanguage(tempSelectedLanguage);
    } else {
      updateLanguage(undefined);
    }
    setCookie("lang", tempSelectedLanguage?.locale || defaultLanguage?.locale);
    if (tempSelectedCurrency) {
      updateCurrency(tempSelectedCurrency);
    }
    setCookie("currency_id", tempSelectedCurrency?.id ?? defaultCurrency?.id);
  }, []);

  return <SettingsContext.Provider value={memoizedValues}>{children}</SettingsContext.Provider>;
};

export const useSettingsContext = () => useContext(SettingsContext);

export default SettingsProvider;
