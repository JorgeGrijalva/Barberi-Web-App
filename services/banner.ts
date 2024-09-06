import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { Banner } from "@/types/banner";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";

export const bannerService = {
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<Banner>>(buildUrlQueryParams("v1/rest/banners/paginate", params)),
  get: (id: number, params?: ParamsType) =>
    fetcher<DefaultResponse<Banner>>(buildUrlQueryParams(`v1/rest/banners/${id}`, params)),
};
