import fetcher from "@/lib/fetcher";
import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Membership, MembershipDetail, UserMembership } from "@/types/membership";

export const membershipService = {
  getAll: (shopId?: number, params?: ParamsType) =>
    fetcher<Paginate<Membership>>(
      buildUrlQueryParams(`v1/rest/shop/${shopId}/memberships`, params)
    ),
  getMyAll: (params?: ParamsType) =>
    fetcher<Paginate<UserMembership>>(
      buildUrlQueryParams("v1/dashboard/user/user-memberships", params)
    ),
  getById: (shopId?: string, id?: string, params?: ParamsType) =>
    fetcher<DefaultResponse<MembershipDetail>>(
      buildUrlQueryParams(`v1/rest/shop/${shopId}/membership/${id}`, params)
    ),
};
