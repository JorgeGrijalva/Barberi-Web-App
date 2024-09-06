import fetcher from "@/lib/fetcher";
import { Paginate } from "@/types/global";
import { Faq } from "@/types/info";
import React from "react";
import { cookies } from "next/headers";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Qa } from "./components/qa";
import { GeneralChat } from "./components/general-chat";

const Help = async () => {
  const lang = cookies().get("lang")?.value;
  const faqs = await fetcher<Paginate<Faq>>(
    buildUrlQueryParams("v1/rest/faqs/paginate", { lang }),
    { cache: "no-cache" }
  );
  return (
    <div className="flex flex-col gap-2 w-full">
      {faqs?.data?.map((faq) => (
        <Qa data={faq} key={faq.id} />
      ))}
      <GeneralChat />
    </div>
  );
};

export default Help;
