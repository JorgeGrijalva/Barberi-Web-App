"use client";

import { DefaultResponse } from "@/types/global";
import { Career } from "@/types/career";
import { useQuery } from "@tanstack/react-query";
import { useSettings } from "@/hook/use-settings";
import { infoService } from "@/services/info";

interface CareerDetailContentProps {
  initialData?: DefaultResponse<Career>;
}

export const CareerDetailContent = ({ initialData }: CareerDetailContentProps) => {
  const { language } = useSettings();
  const { data } = useQuery(
    ["career", initialData?.data.id, language?.locale],
    () => infoService.getCareer(initialData?.data.id.toString(), { lang: language?.locale }),
    {
      enabled: !!initialData?.data.id,
    }
  );

  return (
    <section className="xl:container px-4 py-7">
      <h1 className="text-head font-semibold mb-3">{data?.data.translation?.title}</h1>
      <p className="text-xl font-medium">
        {data?.data.translation?.title} {data?.data.translation?.address}
      </p>
      <div
        className="text-base mt-7"
        dangerouslySetInnerHTML={{ __html: data?.data.translation?.description || "" }}
      />
    </section>
  );
};
