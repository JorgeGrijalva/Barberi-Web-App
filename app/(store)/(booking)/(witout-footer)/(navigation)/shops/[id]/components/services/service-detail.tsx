import { useQuery } from "@tanstack/react-query";
import { useSettings } from "@/hook/use-settings";
import { serviceService } from "@/services/service";
import { Price } from "@/components/price";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import { Translate } from "@/components/translate";
import { useParams, useRouter } from "next/navigation";
import { useQueryParams } from "@/hook/use-query-params";
import { useBooking } from "@/context/booking";
import { BookingService, Types } from "@/context/booking/booking.reducer";
import { useMemo, useState } from "react";
import { LoadingCard } from "@/components/loading";
import ServiceExtras from "../service-extras";

interface ServiceDetailProps {
  id?: string | null;
  isBookingPage?: boolean;
}

export const ServiceDetail = ({ id, isBookingPage }: ServiceDetailProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { dispatch, state } = useBooking();
  const params = useParams();
  const { language, currency } = useSettings();
  const { setQueryParams } = useQueryParams();
  const { data: serviceDetail, isLoading } = useQuery(
    ["service", id, language?.locale],
    () => serviceService.getById(id, { lang: language?.locale, currency_id: currency?.id }),
    {
      enabled: !!id,
    }
  );

  const stateService = state.services?.find((service) => service?.id === serviceDetail?.data?.id);
  const [selectedExtraIds, setSelectedExtraIds] = useState<number[]>(
    stateService?.selected_extra_ids ?? []
  );

  const selectedExtrasTotalPrice = useMemo(
    () =>
      selectedExtraIds.reduce((acc, selectedExtraId) => {
        const extra = serviceDetail?.data?.service_extras?.find(
          (item) => item.id === selectedExtraId
        );
        return acc + (extra?.price || 0);
      }, 0),
    [selectedExtraIds]
  );

  const price =
    (serviceDetail?.data.total_price ?? serviceDetail?.data.price ?? 0) + selectedExtrasTotalPrice;
  const handleButtonClick = (type: "select" | "update" | "unselect") => {
    if (serviceDetail?.data) {
      const tempData: BookingService = serviceDetail.data;
      if (state.master) {
        const serviceMaster = state.master.service_masters?.find(
          (item) => item.service_id === Number(id)
        );
        const tempMaster = { ...state.master, service_master: serviceMaster || null };
        if (serviceMaster) {
          tempData.master = tempMaster;
        }
      }
      const payload = {
        ...serviceDetail.data,
        selected_extra_ids: selectedExtraIds,
      };
      switch (type) {
        case "select":
          dispatch({
            type: Types.SelectService,
            payload,
          });
          break;
        case "update":
          dispatch({
            type: Types.UpdateService,
            payload,
          });
          break;
        case "unselect":
          dispatch({ type: Types.UnselectService, payload: serviceDetail?.data?.id });
          break;
        default:
          break;
      }
    }
    if (!isBookingPage) {
      router.push(`/shops/${params.id}/booking?offerId=${id}`);
      return;
    }
    setQueryParams({ offerId: id, serviceId: undefined });
  };
  if (isLoading) {
    return (
      <div>
        <LoadingCard />
      </div>
    );
  }
  const renderButtons = () => {
    if (stateService?.selected_extra_ids?.length) {
      return (
        <div className="flex justify-between items-center gap-3">
          <Button
            fullWidth
            color="white"
            onClick={() => handleButtonClick("unselect")}
            className="border border-footerBg"
          >
            {t("remove")}
          </Button>
          <Button fullWidth color="black" onClick={() => handleButtonClick("update")}>
            {t("update")}
          </Button>
        </div>
      );
    }
    if (state.services?.find((service) => service?.id === serviceDetail?.data?.id)) {
      return (
        <Button
          fullWidth
          color="white"
          onClick={() => handleButtonClick("unselect")}
          className="border border-footerBg"
        >
          {t("remove")}
        </Button>
      );
    }
    return (
      <Button fullWidth color="black" onClick={() => handleButtonClick("select")}>
        {t("book.now")}
      </Button>
    );
  };
  return (
    <div className="sm:pt-12 pb-7 sm:px-12 pt-16 px-4">
      <div className="flex items-center justify-between">
        <strong className="text-head font-semibold">
          {serviceDetail?.data?.translation?.title}
        </strong>
        <span className="text-lg font-semibold">
          <Price number={price} />
        </span>
      </div>
      <span className="text-sm">{serviceDetail?.data.translation?.description}</span>
      <div className="flex items-center gap-2 flex-wrap my-5">
        <div className="border border-gray-field rounded-full py-2 px-5">
          <span className="text-base text-gray-field">
            {serviceDetail?.data.interval} <Translate value="min" />
          </span>
        </div>
      </div>
      {!!serviceDetail?.data?.service_extras?.length && (
        <ServiceExtras
          extras={serviceDetail?.data?.service_extras}
          selectedExtraIds={selectedExtraIds}
          setSelectedExtraIds={setSelectedExtraIds}
        />
      )}
      <div className="h-px w-full bg-gray-link my-10" />
      <div className="flex items-center gap-10">
        <div className="flex flex-col mb-2 md:hidden md:m-0">
          <span className="text-sm text-gray-field">{t("price")}</span>
          <span className="text-head font-semibold whitespace-nowrap">
            <Price number={price} />
          </span>
        </div>
      </div>
      {renderButtons()}
    </div>
  );
};
