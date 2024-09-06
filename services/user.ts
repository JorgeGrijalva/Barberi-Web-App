import fetcher from "@/lib/fetcher";
import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import {
  NotificationUpdateBody,
  PasswordUpdateBody,
  SearchedUser,
  Transaction,
  UpdateProfileBody,
  UserDetail,
} from "@/types/user";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";

export const userService = {
  profile: () => fetcher<DefaultResponse<UserDetail>>("v1/dashboard/user/profile/show"),
  updateFirebaseToken: (data: { firebase_token: string }) =>
    fetcher.post(`v1/dashboard/user/profile/firebase/token/update`, { body: data }),
  update: (data: UpdateProfileBody) =>
    fetcher.put("v1/dashboard/user/profile/update", { body: data }),
  updatePassword: (data: PasswordUpdateBody) =>
    fetcher.post("v1/dashboard/user/profile/password/update", { body: data }),
  updateNotificationSettings: (body: NotificationUpdateBody) =>
    fetcher.post(`v1/dashboard/user/update/notifications`, { body }),
  getWalletHistory: (params?: ParamsType) =>
    fetcher<Paginate<Transaction>>(
      buildUrlQueryParams("v1/dashboard/user/wallet/histories", params)
    ),
  userList: (params?: ParamsType) =>
    fetcher<Paginate<SearchedUser>>(
      buildUrlQueryParams("v1/dashboard/user/search-sending", params)
    ),
  sendMoney: (data: { price: number; uuid: string }) =>
    fetcher.post("v1/dashboard/user/wallet/send", { body: data }),
  updateLanguage: (lang: string) =>
    fetcher.put(buildUrlQueryParams("v1/dashboard/user/profile/lang/update", { lang })),
  updateCurrency: (currencyId: number) =>
    fetcher.put(
      buildUrlQueryParams("v1/dashboard/user/profile/currency/update", { currency_id: currencyId })
    ),
  sendGiftCart: (data: { user_gift_cart_id?: number; user_id: number }) =>
    fetcher.post("v1/dashboard/user/gift-carts/send", { body: data }),
};
