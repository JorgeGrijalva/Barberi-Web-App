import { globalService } from "@/services/global";
import { parseSettings } from "@/utils/parse-settings";
import React from "react";
import { Footer } from "@/components/footer";

const WithFooterPagesLayout = async ({ children }: { children: React.ReactNode }) => {
  const settings = await globalService.settings();
  const parsedSettings = parseSettings(settings?.data);
  return (
    <>
      {children}
      <Footer settings={parsedSettings} />
    </>
  );
};

export default WithFooterPagesLayout;
