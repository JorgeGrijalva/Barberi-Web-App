import { Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Refund, RefundCreateBody } from "@/types/order";

const refundService = {
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<Refund>>(
      buildUrlQueryParams(`v1/dashboard/user/order-refunds/paginate`, params)
    ),
  create: (body: RefundCreateBody) => fetcher.post(`v1/dashboard/user/order-refunds`, { body }),
};

export default refundService;
