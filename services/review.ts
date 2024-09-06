import { DefaultResponse, ParamsType } from "@/types/global";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import {
  Review,
  ReviewCreateBody,
  ReviewGroupRating,
  ReviewPermission,
  ReviewRating,
} from "@/types/review";

export const reviewService = {
  getAllReviews: (type: string, id?: string, params?: ParamsType) => {
    let link = "";
    if (type === "products") {
      link = `v1/rest/${type}/reviews/${id}`;
    } else {
      link = `v1/rest/${type}/${id}/reviews`;
    }
    return fetcher<DefaultResponse<Review[]>>(buildUrlQueryParams(link, params));
  },
  checkCanReview: (params?: ParamsType) =>
    fetcher<DefaultResponse<ReviewPermission>>(buildUrlQueryParams("v1/rest/added-review", params)),
  getRating: (params?: ParamsType) =>
    fetcher<DefaultResponse<ReviewRating>>(buildUrlQueryParams(`v1/rest/review/options`, params)),
  getGroupRating: (type: string, typeId?: number) =>
    fetcher<ReviewGroupRating>(`v1/rest/${type}/${typeId}/reviews-group-rating`),
  createReview: (type: string, typeId: string | number | undefined, body: ReviewCreateBody) =>
    fetcher.post(`v1/dashboard/user/${type}/review/${typeId}`, { body }),
};
