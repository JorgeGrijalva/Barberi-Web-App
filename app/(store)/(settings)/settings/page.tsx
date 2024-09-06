import fetcher from "@/lib/fetcher";
import { Currency, DefaultResponse, Language } from "@/types/global";
import React from "react";
import SettingsForm from "./settings-form";

const Settings = async () => {
  const languages = await fetcher<DefaultResponse<Language[]>>("v1/rest/languages/active", {
    cache: "no-cache",
  });
  const currencies = await fetcher<DefaultResponse<Currency[]>>("v1/rest/currencies/active", {
    cache: "no-cache",
  });
  return (
    <div className="flex-1">
      <div className="w-full">
        <div className="grid xl:grid-cols-2 gap-24">
          <div className="flex flex-col gap-4">
            <SettingsForm languages={languages?.data} currencies={currencies?.data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
