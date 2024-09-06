"use client";

import { DefaultResponse, Term } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { infoService } from "@/services/info";
import { useSettings } from "@/hook/use-settings";

interface PrivacyContentProps {
  data?: DefaultResponse<Term>;
}

export const PrivacyContent = ({ data }: PrivacyContentProps) => {
  const { language } = useSettings();
  const { data: privacy } = useQuery(
    ["privacy", language?.locale],
    () => infoService.privacy({ lang: language?.locale }),
    {
      initialData: data,
    }
  );
  return (
    <div className="xl:container px-4 py-7">
      <h1 className="md:text-head text-xl font-semibold">{privacy?.data?.translation?.title}</h1>
      <div
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: privacy?.data?.translation?.description || "" }}
      />
    </div>
  );
};
