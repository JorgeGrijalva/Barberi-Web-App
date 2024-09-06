import fetcher from "@/lib/fetcher";
import { DefaultResponse, ParamsType } from "@/types/global";
import {
  Cart,
  CartCalculateBody,
  CartCalculateRes,
  InsertCartPayload,
  JoinCartCredentials,
  OpenCartCredentials,
  UserCart,
} from "@/types/cart";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";

export const cartService = {
  insert: async (data: InsertCartPayload) =>
    fetcher.post<DefaultResponse<Cart>>("v1/dashboard/user/cart/insert-product", {
      body: data,
    }),
  delete: async (data: Record<string, number>) =>
    fetcher(buildUrlQueryParams("v1/dashboard/user/cart/product/delete", data), {
      method: "DELETE",
    }),
  clearAll: async () => fetcher.delete("v1/dashboard/user/cart/my-delete"),
  calculate: async (id: number | undefined, data: CartCalculateBody) =>
    fetcher.post<DefaultResponse<CartCalculateRes>>(`v1/dashboard/user/cart/calculate/${id}`, {
      body: data,
    }),
  get: (params: ParamsType) =>
    fetcher<DefaultResponse<Cart>>(buildUrlQueryParams("v1/dashboard/user/cart", params)),
  restCalculate: async (params?: ParamsType) =>
    fetcher<DefaultResponse<CartCalculateRes>>(
      buildUrlQueryParams("v1/rest/order/products/calculate", params)
    ),
  open: (data: OpenCartCredentials) =>
    fetcher.post<DefaultResponse<Cart>>(`v1/dashboard/user/cart/open`, { body: data }),
  setGroup: (id?: number) => fetcher.post(`v1/dashboard/user/cart/set-group/${id}`),
  join: (data: JoinCartCredentials) =>
    fetcher.post<DefaultResponse<UserCart>>(`v1/rest/cart/open`, { body: data }),
  guestGet: (id: number, params?: ParamsType) =>
    fetcher<DefaultResponse<Cart>>(buildUrlQueryParams(`v1/rest/cart/${id}`, params)),
  deleteGuestProducts: (data: { cart_id: number; ids: number[] }) =>
    fetcher.delete(`v1/rest/cart/product/delete`, {
      body: data,
    }),
  deleteGuest: (params: Record<string, string | number | undefined>) =>
    fetcher.delete(buildUrlQueryParams(`v1/dashboard/user/cart/member/delete`, params)),
  insertGuest: (data: InsertCartPayload) =>
    fetcher.post<DefaultResponse<Cart>>(`v1/rest/cart/insert-product`, { body: data }),
  statusChange: (uuid: string, data: { cart_id: number }) =>
    fetcher.post(`v1/rest/cart/status/${uuid}`, { body: data }),
};
