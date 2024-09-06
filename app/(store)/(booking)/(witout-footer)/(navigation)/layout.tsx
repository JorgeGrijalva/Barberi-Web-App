import React from "react";
import { globalService } from "@/services/global";
import { parseSettings } from "@/utils/parse-settings";
import { NavigationHeader } from "./components/header";

const NavigationLayout = async ({ children }: { children: React.ReactNode }) => {
  const settings = await globalService.settings();
  const parsedSettings = parseSettings(settings?.data);
  return (
    <>
      <NavigationHeader settings={parsedSettings} />
      <main className="min-h-[70vh]">{children}</main>
    </>
  );
};

export default NavigationLayout;
