import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Service, ServiceMasterInfo } from "@/types/service";

export const serviceService = {
  list: (params?: ParamsType) =>
    fetcher<Paginate<Service>>(buildUrlQueryParams("v1/rest/services", params)),
  getById: (id?: string | null, params?: ParamsType) =>
    fetcher<DefaultResponse<Service>>(buildUrlQueryParams(`v1/rest/services/${id}`, params)),
  getServiceMasters: (params?: ParamsType) =>
    fetcher<Paginate<ServiceMasterInfo>>(buildUrlQueryParams("v1/rest/service-masters", params)),
};
