import React from "react";
import { cookies } from "next/headers";
import { infoService } from "@/services/info";
import { GeneralChat } from "./components/general-chat";
import { HelpContent } from "./content";

const Help = async () => {
  const lang = cookies().get("lang")?.value;
  const faqs = await infoService.faq({ lang });
  return (
    <>
      <HelpContent data={faqs} />
      <GeneralChat />
    </>
  );
};

export default Help;
