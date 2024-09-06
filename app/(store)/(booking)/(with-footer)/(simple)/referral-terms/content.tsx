"use client";

import { DefaultResponse, Referral } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { infoService } from "@/services/info";
import { Translate } from "@/components/translate";
import { useSettings } from "@/hook/use-settings";

interface ReferralContentProps {
  data?: DefaultResponse<Referral>;
}

export const ReferralContent = ({ data }: ReferralContentProps) => {
  const { language } = useSettings();
  const { data: referrals } = useQuery(
    ["referral-terms", language?.locale],
    () => infoService.referrals({ lang: language?.locale }),
    {
      initialData: data,
    }
  );

  return (
    <div className="xl:container px-2 md:px-4">
      <h1 className="md:text-head text-xl font-semibold">
        <Translate value="referral.terms" />
      </h1>
      <div
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: referrals?.data?.translation?.faq || "" }}
      />
    </div>
  );
};
