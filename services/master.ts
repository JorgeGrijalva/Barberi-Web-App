import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Master } from "@/types/master";
import { BookingDate } from "@/types/booking";

export const masterService = {
  list: (params?: ParamsType) =>
    fetcher<Paginate<Master>>(buildUrlQueryParams("v1/rest/masters", params)),
  getById: (id?: string, params?: ParamsType) =>
    fetcher<DefaultResponse<Master>>(buildUrlQueryParams(`v1/rest/masters/${id}`, params), {
      redirectOnError: true,
    }),
  getByIds: (params?: ParamsType) =>
    fetcher<Paginate<Master>>(buildUrlQueryParams("v1/rest/masters", params)),
  getTimes: (params?: ParamsType) =>
    fetcher<DefaultResponse<BookingDate[]>>(
      buildUrlQueryParams(`v1/rest/master/times-all`, params)
    ),
};
