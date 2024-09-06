import { globalService } from "@/services/global";
import { parseSettings } from "@/utils/parse-settings";
import React from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

const BusinessPagesLayout = async ({ children }: { children: React.ReactNode }) => {
  const settings = await globalService.settings();
  const parsedSettings = parseSettings(settings?.data);
  return (
    <div className="overflow-x-hidden">
      <Header settings={parsedSettings} showLinks showBusinessButton={false} />
      {children}
      <Footer settings={parsedSettings} />
    </div>
  );
};

export default BusinessPagesLayout;
