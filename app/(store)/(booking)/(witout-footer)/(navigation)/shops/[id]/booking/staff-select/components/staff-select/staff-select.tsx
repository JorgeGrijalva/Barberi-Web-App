"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { masterService } from "@/services/master";
import { MasterCard } from "@/components/master-card";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { useBooking } from "@/context/booking";
import { Types } from "@/context/booking/booking.reducer";
import clsx from "clsx";
import UserAddLineIcon from "remixicon-react/UserAddLineIcon";
import { useTranslation } from "react-i18next";
import { serviceService } from "@/services/service";
import { LoadingCard } from "@/components/loading";
import { useSettings } from "@/hook/use-settings";
import { error } from "@/components/alert";

interface StaffSelectProps {
  shopId?: number;
}

export const StaffSelect = ({ shopId }: StaffSelectProps) => {
  const { dispatch, state } = useBooking();
  const { t } = useTranslation();
  const { currency } = useSettings();
  const serviceIds = state.services.map((service) => service.id);
  const {
    data: masters,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["masters", shopId, serviceIds],
    () =>
      masterService.list({
        shop_id: shopId,
        service_ids: serviceIds,
        currency_id: currency?.id,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      suspense: true,
    }
  );

  const { data: serviceMasterInfo, isLoading: isMasterServiceLoading } = useQuery(
    ["serviceMaster", state.master?.id],
    () =>
      serviceService.getServiceMasters({ master_id: state.master?.id, currency_id: currency?.id }),
    {
      enabled: !!state.master?.id,
      onSuccess: (res) => {
        if (!state.master) return;
        const masterServices = res.data?.map((master) => master.service_id);
        const isMasterSupportSelectedServices = state.services.every((item) =>
          masterServices.includes(item.id)
        );
        if (!isMasterSupportSelectedServices) {
          error(t("selected.master.does.not.support.chosen.services"));
          dispatch({ type: Types.UnsupportedMastersByServices, payload: state.master.id });
          dispatch({ type: Types.UnSetMaster });
          return;
        }
        dispatch({
          type: Types.SetOnlyMaster,
          payload: { master: state.master, serviceMasterInfo: res.data },
        });
      },
    }
  );

  const masterList = extractDataFromPagination(masters?.pages);
  return (
    <div className="relative">
      {isMasterServiceLoading && state.master && (
        <div className="absolute top-0 left-0 w-full h-full z-10 bg-white bg-opacity-60 flex items-center justify-center">
          <LoadingCard />
        </div>
      )}
      <InfiniteLoader hasMore={hasNextPage} loadMore={fetchNextPage} loading={isFetchingNextPage}>
        <div className="grid md:grid-cols-3 sm:grid-cols-3 grid-cols-2 gap-4 mt-6">
          <button
            className={clsx(
              "rounded-button border border-gray-link flex items-center justify-center flex-col gap-3",
              !state.master && "ring-2 ring-black"
            )}
            onClick={() => dispatch({ type: Types.UnSetMaster })}
          >
            <UserAddLineIcon />
            <span className="text-sm font-medium">{t("select.master.per.service")}</span>
          </button>
          {masterList?.map((master) => (
            <button
              key={master.id}
              onClick={() =>
                dispatch({
                  type: Types.SetOnlyMaster,
                  payload: { master, serviceMasterInfo: serviceMasterInfo?.data },
                })
              }
              disabled={!!state?.unsupportedMastersByServices?.includes(master.id)}
              className={clsx(
                state?.unsupportedMastersByServices?.includes(master.id)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              )}
            >
              <MasterCard selected={state.master?.id === master.id} data={master} key={master.id} />
            </button>
          ))}
        </div>
      </InfiniteLoader>
    </div>
  );
};
