import { Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Brand } from "@/types/brand";

export const brandService = {
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<Brand>>(buildUrlQueryParams("v1/rest/brands/paginate", params)),
};
