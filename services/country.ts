import { DefaultResponse, Paginate, ParamsType, Country, City } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";

export const countryService = {
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<Country>>(buildUrlQueryParams("v1/rest/countries", params)),
  get: (id: number, params?: ParamsType) =>
    fetcher<DefaultResponse<Country>>(buildUrlQueryParams(`v1/rest/countries/${id}`, params)),
};

export const cityService = {
  get: (id: number, params?: ParamsType) =>
    fetcher<DefaultResponse<City>>(`v1/rest/cities/${id}`, params),
};
