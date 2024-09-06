import {
  Booking,
  BookingCalculateBody,
  BookingCalculateRes,
  BookingCreateBody,
  BookingReviewFormValues,
} from "@/types/booking";
import fetcher from "@/lib/fetcher";
import { DefaultResponse, Paginate, ParamsType } from "@/types/global";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { ReviewCreateFormValues } from "@/types/review";
import { Coupon } from "@/types/product";

export const bookingService = {
  calculate: (body: BookingCalculateBody, params?: ParamsType) =>
    fetcher.post<DefaultResponse<BookingCalculateRes>>(
      buildUrlQueryParams("v1/dashboard/user/bookings/calculate", params),
      {
        body,
      }
    ),
  create: (body: BookingCreateBody) =>
    fetcher.post<DefaultResponse<Booking[]>>("v1/dashboard/user/bookings", { body }),
  getAll: (params?: ParamsType) =>
    fetcher<Paginate<Booking>>(buildUrlQueryParams("v1/dashboard/user/bookings", params)),
  getById: (id?: number, params?: ParamsType) =>
    fetcher<DefaultResponse<Booking[]>>(
      buildUrlQueryParams(`v1/dashboard/user/bookings/${id}/get-all`, params)
    ),
  cancel: (id: number) => fetcher.post(`v1/dashboard/user/booking/parent/${id}/canceled`),
  createReview: (id?: number, body?: ReviewCreateFormValues) =>
    fetcher.post(`v1/dashboard/user/booking/review/${id}`, { body }),
  updateReview: (id?: number, body?: BookingReviewFormValues) =>
    fetcher.put(`v1/dashboard/user/booking/review/${id}`, { body }),
  addNote: (id?: number, body?: { note: string }) =>
    fetcher.post(`v1/dashboard/user/bookings/${id}/notes/update`, { body }),
  checkCoupon: (params?: ParamsType) =>
    fetcher.post<DefaultResponse<Coupon>>(buildUrlQueryParams("v1/rest/coupons/check", params)),
};
