import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { CreateShopCredentials, Shop, ShopGallery, ShopTag, ShopFilter } from "@/types/shop";

export const shopService = {
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<Shop>>(buildUrlQueryParams("v1/rest/shops/paginate", params)),
  create: (data: CreateShopCredentials) => fetcher.post("v1/dashboard/user/shops", { body: data }),
  getById: (id?: number | string, params?: ParamsType) =>
    fetcher<DefaultResponse<Shop>>(buildUrlQueryParams(`v1/rest/shops/${id}`, params), {
      cache: "no-cache",
      redirectOnError: true,
    }),
  getBySlug: (slug?: string, params?: ParamsType) =>
    fetcher<DefaultResponse<Shop>>(buildUrlQueryParams(`v1/rest/shops/slug/${slug}`, params), {
      cache: "no-store",
      redirectOnError: true,
    }),
  gellery: (slug?: string) =>
    fetcher<DefaultResponse<ShopGallery>>(`v1/rest/shops/slug/${slug}/galleries`, {
      redirectOnError: true,
    }),
  getByIds: (params?: ParamsType) =>
    fetcher<Paginate<Shop>>(buildUrlQueryParams("v1/rest/shops/paginate", params)),
  getAllTags: (params?: ParamsType) =>
    fetcher<DefaultResponse<ShopTag[]>>(buildUrlQueryParams("v1/rest/shops-takes", params)),
  getShopFilters: () => fetcher<ShopFilter>("v1/rest/shop-filter"),
};
