import fetcher from "@/lib/fetcher";
import { Paginate, ParamsType } from "@/types/global";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Notification, Statistics } from "@/types/notification";

export const notificationService = {
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<Notification>>(buildUrlQueryParams(`v1/dashboard/notifications`, params)),
  get: (id: number, params?: ParamsType) =>
    fetcher(buildUrlQueryParams(`v1/dashboard/notifications/${id}`, params)),
  statistics: (params?: ParamsType) =>
    fetcher<Statistics>(
      buildUrlQueryParams(`v1/dashboard/user/profile/notifications-statistic`, params)
    ),
  readAll: () => fetcher.post(`v1/dashboard/notifications/read-all`),
  readById: (id: number) => fetcher.post(`v1/dashboard/notifications/${id}/read-at`),
};
