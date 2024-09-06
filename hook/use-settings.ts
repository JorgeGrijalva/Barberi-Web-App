import { useSettingsContext } from "@/context/settings/settings";
import useSettingsStore from "@/global-store/settings";

export const useSettings = () => {
  const { defaultCurrency, defaultLanguage, settings } = useSettingsContext();
  const selectedCurrency = useSettingsStore((state) => state.selectedCurrency);
  const selectedLanguage = useSettingsStore((state) => state.selectedLanguage);

  return {
    language: selectedLanguage || defaultLanguage,
    currency: selectedCurrency || defaultCurrency,
    settings,
  };
};
