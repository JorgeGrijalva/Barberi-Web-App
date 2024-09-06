import { DefaultResponse, DeliveryPrice, Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Address, AddressCreateBody } from "@/types/address";
import { UserDetail } from "@/types/user";

export const addressService = {
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<Address>>(buildUrlQueryParams("v1/dashboard/user/addresses", params)),
  create: (data: AddressCreateBody) =>
    fetcher.post<DefaultResponse<UserDetail>>("v1/dashboard/user/addresses", { body: data }),
  get: (id?: number) => fetcher<DefaultResponse<Address>>(`v1/dashboard/user/addresses/${id}`),
  delete: (id?: number) => fetcher.delete(`v1/dashboard/user/addresses/delete?ids[0]=${id}`),
  update: (id: number | undefined, data: AddressCreateBody) =>
    fetcher.put<DefaultResponse<Address>>(`v1/dashboard/user/addresses/${id}`, { body: data }),
  getDeliveryPrices: (params?: ParamsType) =>
    fetcher<Paginate<DeliveryPrice>>(buildUrlQueryParams("v1/rest/delivery-prices", params)),
};
