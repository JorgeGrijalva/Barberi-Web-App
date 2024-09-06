import fetcher from "@/lib/fetcher";
import { Ad, AdDetail } from "@/types/ads";
import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";

export const adsService = {
  getAll: (params?: ParamsType, init?: RequestInit) =>
    fetcher<Paginate<Ad>>(buildUrlQueryParams("v1/rest/ads-packages", params), init),
  get: (id: string, params?: ParamsType, init?: RequestInit) =>
    fetcher<DefaultResponse<AdDetail>>(
      buildUrlQueryParams(`v1/rest/ads-packages/${id}`, params),
      init
    ),
  getAdProducts: (params?: ParamsType) =>
    fetcher<Paginate<AdDetail>>(buildUrlQueryParams("v1/rest/products-ads-packages", params)),
};
