import React from "react";
import { globalService } from "@/services/global";
import { parseSettings } from "@/utils/parse-settings";
import { Header } from "@/components/header";

const SimpleLayout = async ({ children }: { children: React.ReactNode }) => {
  const settings = await globalService.settings();
  const parsedSettings = parseSettings(settings?.data);
  return (
    <>
      <Header borderBottom showLinks settings={parsedSettings} />
      <main className="min-h-[70vh] relative">{children}</main>
    </>
  );
};

export default SimpleLayout;
