import { cookies } from "next/headers";
import { infoService } from "@/services/info";
import { AboutPageContent } from "./content";

const AboutPage = async () => {
  const lang = cookies().get("lang")?.value;
  const data = await infoService.getPages({ type: "all_about", lang });

  return <AboutPageContent initialData={data} />;
};

export default AboutPage;
