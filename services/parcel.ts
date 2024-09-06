import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Parcel, ParcelCreateBody } from "@/types/parcel";

export const parcelService = {
  getTypes: (params: ParamsType) =>
    fetcher(buildUrlQueryParams("v1/rest/parcel-order/types", params)),
  calculate: (params: ParamsType) =>
    fetcher<DefaultResponse<{ price: number }>>(
      buildUrlQueryParams("v1/rest/parcel-order/calculate-price", params)
    ),
  create: (body: ParcelCreateBody) =>
    fetcher.post<DefaultResponse<Parcel>>("v1/dashboard/user/parcel-orders", { body }),
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<Parcel>>(buildUrlQueryParams("v1/dashboard/user/parcel-orders", params)),
  get: (id?: number | null, params?: ParamsType) =>
    fetcher<DefaultResponse<Parcel>>(
      buildUrlQueryParams(`v1/dashboard/user/parcel-orders/${id}`, params)
    ),
  cancel: (id?: number) =>
    fetcher.post(`v1/dashboard/user/parcel-orders/${id}/status/change?status=canceled`),
};
