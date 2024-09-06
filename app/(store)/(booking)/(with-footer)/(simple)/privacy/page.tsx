import { cookies } from "next/headers";
import { infoService } from "@/services/info";
import { PrivacyContent } from "./content";

export const dynamic = "force-dynamic";

const PrivacyPolicy = async () => {
  const lang = cookies().get("lang")?.value;
  const terms = await infoService.privacy({ lang });
  return <PrivacyContent data={terms} />;
};

export default PrivacyPolicy;
