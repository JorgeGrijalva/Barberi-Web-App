"use client";

import { DefaultResponse, Term } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { infoService } from "@/services/info";
import { useSettings } from "@/hook/use-settings";

interface TermsContentProps {
  data?: DefaultResponse<Term>;
}

export const TermsContent = ({ data }: TermsContentProps) => {
  const { language } = useSettings();
  const { data: terms } = useQuery(
    ["terms", language?.locale],
    () => infoService.terms({ lang: language?.locale }),
    {
      initialData: data,
    }
  );

  return (
    <div className="xl:container px-4 py-7">
      <h1 className="md:text-head text-xl font-semibold">{terms?.data?.translation?.title}</h1>
      <div
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: terms?.data?.translation?.description || "" }}
      />
    </div>
  );
};
