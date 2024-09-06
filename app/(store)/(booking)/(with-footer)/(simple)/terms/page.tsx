import { cookies } from "next/headers";
import { infoService } from "@/services/info";
import { Metadata } from "next";
import { TermsContent } from "./content";

export const generateMetadata = async (): Promise<Metadata> => {
  const lang = cookies().get("lang")?.value;
  const terms = await infoService.terms({ lang });
  return {
    title: terms?.data.translation?.title,
  };
};

const TermsPage = async () => {
  const lang = cookies().get("lang")?.value;
  const terms = await infoService.terms({ lang });
  return <TermsContent data={terms} />;
};

export default TermsPage;
