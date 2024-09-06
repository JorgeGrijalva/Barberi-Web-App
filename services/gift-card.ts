import fetcher from "@/lib/fetcher";
import { Paginate, ParamsType } from "@/types/global";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { GiftCart, UserGiftCart } from "@/types/gift-card";

export const giftCardService = {
  getAll: (shopId?: number, params?: ParamsType) =>
    fetcher<Paginate<GiftCart>>(buildUrlQueryParams(`v1/rest/gift-carts/paginate`, params)),
  getMyAll: (params?: ParamsType) =>
    fetcher<Paginate<UserGiftCart>>(
      buildUrlQueryParams("v1/dashboard/user/gift-carts/my-carts", params)
    ),
};
