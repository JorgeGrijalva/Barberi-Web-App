import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Paginate, ParamsType } from "@/types/global";
import { BookingForm } from "@/types/booking-form";

export const formService = {
  getForm: (params?: ParamsType) =>
    fetcher<Paginate<BookingForm>>(buildUrlQueryParams("v1/rest/form-options", params)),
  updateForm: (id: number, data: BookingForm[]) =>
    fetcher.put(`v1/dashboard/user/bookings/${id}`, { body: { data: { form: data } } }),
};
