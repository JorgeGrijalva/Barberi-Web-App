import { cookies } from "next/headers";
import { infoService } from "@/services/info";
import { ReferralContent } from "./content";

const ReferralTerms = async () => {
  const lang = cookies().get("lang")?.value;
  const data = await infoService.referrals({ lang });
  return <ReferralContent data={data} />;
};

export default ReferralTerms;
