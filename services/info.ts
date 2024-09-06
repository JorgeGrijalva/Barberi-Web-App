import { DefaultResponse, Page, Paginate, ParamsType, Referral, Term } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Faq } from "@/types/info";
import { Career } from "@/types/career";

export const infoService = {
  terms: (params?: ParamsType) =>
    fetcher<DefaultResponse<Term>>(buildUrlQueryParams("v1/rest/term", params), {
      redirectOnError: true,
      cache: "no-cache",
    }),

  privacy: (params?: ParamsType) =>
    fetcher<DefaultResponse<Term>>(buildUrlQueryParams("v1/rest/policy", params), {
      redirectOnError: true,
    }),
  faq: (params: ParamsType) =>
    fetcher<Paginate<Faq>>(buildUrlQueryParams("v1/rest/faqs/paginate", params), {
      cache: "no-cache",
    }),
  referrals: (params?: ParamsType) =>
    fetcher<DefaultResponse<Referral>>(buildUrlQueryParams("v1/rest/referral", params), {
      cache: "no-cache",
    }),
  getPages: (params: ParamsType) =>
    fetcher<Paginate<Page>>(buildUrlQueryParams("v1/rest/pages/paginate", params)),
  careerList: (params?: ParamsType) =>
    fetcher<Paginate<Career>>(buildUrlQueryParams("v1/rest/careers/paginate", params)),
  getCareer: (id?: string, params?: ParamsType) =>
    fetcher<DefaultResponse<Career>>(buildUrlQueryParams(`v1/rest/careers/${id}`, params)),
};
