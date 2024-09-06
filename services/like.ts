import fetcher from "@/lib/fetcher";
import { LikeOptions, Paginate, ParamsType } from "@/types/global";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Product } from "@/types/product";
import { Shop } from "@/types/shop";
import { Master } from "@/types/master";

export const likeService = {
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<Product>>(buildUrlQueryParams("v1/dashboard/likes", params)),
  getShopAll: (params?: ParamsType) =>
    fetcher<Paginate<Shop>>(buildUrlQueryParams("v1/dashboard/likes", params)),
  getMasterAll: (params?: ParamsType) =>
    fetcher<Paginate<Master>>(buildUrlQueryParams("v1/dashboard/likes", params)),
  like: (body: LikeOptions) => fetcher.post("v1/dashboard/likes", { body }),
  dislike: (options: LikeOptions) =>
    fetcher.delete(`v1/dashboard/likes/${options.type_id}?type=${options.type}`),
  likeMany: (body: { types: LikeOptions[] }) =>
    fetcher.post("v1/dashboard/like/store-many", { body }),
};
