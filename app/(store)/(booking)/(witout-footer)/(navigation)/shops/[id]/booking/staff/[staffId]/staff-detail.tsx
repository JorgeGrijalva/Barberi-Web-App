"use client";

import { useQuery } from "@tanstack/react-query";
import { masterService } from "@/services/master";
import { useTranslation } from "react-i18next";
import { Price } from "@/components/price";
import StarOutlinedIcon from "@/assets/icons/star-outlined";
import { ImageWithFallBack } from "@/components/image";
import { useSearchParams } from "next/navigation";
import { useSettings } from "@/hook/use-settings";
import { useBooking } from "@/context/booking";
import { Types } from "@/context/booking/booking.reducer";
import { BookingDateTime } from "../../../components/date-time";

interface StaffDetailProps {
  id?: string;
}

export const StaffDetail = ({ id }: StaffDetailProps) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const { language, currency } = useSettings();
  const { dispatch } = useBooking();
  const { data: staffDetail, isLoading } = useQuery(
    ["staff", id, language?.locale, currency?.id],
    () => masterService.getById(id, { lang: language?.locale, currency_id: currency?.id }),
    {
      enabled: !!id,
      onSuccess: (res) => {
        dispatch({ type: Types.SetMaster, payload: res.data });
      },
    }
  );
  const serviceMasterId = searchParams.get("serviceMasterId");

  return (
    <div>
      <div className="flex items-center md:gap-7 gap-5 pb-7 mb-7 border-b border-gray-link flex-col md:flex-row">
        <div className="relative h-[193px] sm:aspect-[220/193] w-full md:w-auto rounded-button overflow-hidden border border-gray-link">
          {isLoading ? (
            <div className="bg-gray-300 h-full w-full animate-pulse" />
          ) : (
            <ImageWithFallBack
              src={staffDetail?.data.img || ""}
              alt={staffDetail?.data.firstname || "user"}
              fill
              className="object-cover"
            />
          )}
        </div>
        <div className="flex-1 w-full md:w-auto">
          <div className="flex items-center flex-1 justify-between pb-3 border-b border-gray-link">
            {isLoading ? (
              <div className="h-5 w-3/5 rounded-full bg-gray-300" />
            ) : (
              <div>
                <h1 className="text-xl font-semibold">
                  {staffDetail?.data.firstname} {staffDetail?.data.lastname}
                </h1>
                <span className="text-sm text-dark text-opacity-50">{staffDetail?.data.role}</span>
              </div>
            )}
            {isLoading ? (
              <div className="h-4 w-1/5 rounded-full bg-gray-300" />
            ) : (
              <div>
                <div className="text-sm">{t("starting.from")}</div>
                <strong className="text-xl font-bold">
                  <Price number={staffDetail?.data.service_min_price} />
                </strong>
              </div>
            )}
          </div>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-7 gap-y-2.5 py-3">
            {isLoading
              ? Array.from(Array(6).keys()).map((item) => (
                  <div key={item} className="bg-gray-300 h-4 w-3/5 rounded-full" />
                ))
              : staffDetail?.data.service_masters?.map((serviceMaster) => (
                  <div className="flex items-center gap-1" key={serviceMaster.id}>
                    <StarOutlinedIcon />
                    <span className="text-base">{serviceMaster.service?.translation?.title}</span>
                  </div>
                ))}
          </div>
        </div>
      </div>
      <BookingDateTime withBorder={false} serviceMasterId={Number(serviceMasterId)} />
    </div>
  );
};
