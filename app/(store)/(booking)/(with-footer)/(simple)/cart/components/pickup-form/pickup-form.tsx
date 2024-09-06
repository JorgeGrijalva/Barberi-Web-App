"use client";

import useAddressStore from "@/global-store/address";
import { DeliveryPoint } from "@/types/global";
import MapPinRangeLineIcon from "remixicon-react/MapPinRangeLineIcon";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { RadioGroup } from "@headlessui/react";
import CheckIcon from "@/assets/icons/check";
import EmptyCheckIcon from "@/assets/icons/empty-check";
import { Modal } from "@/components/modal";
import dynamic from "next/dynamic";
import { useInfiniteQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { useSettings } from "@/hook/use-settings";
import clsx from "clsx";
import { Types } from "@/context/checkout/checkout.reducer";
import { useCheckout } from "@/context/checkout";
import { ActionButton } from "../action-button";

const comparePoints = (a?: DeliveryPoint, b?: DeliveryPoint) => a?.id === b?.id;

const PointSelectMap = dynamic(() =>
  import("../point-select-map").then((component) => ({ default: component.PointSelectMap }))
);

export const CheckoutPickupForm = () => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const {
    data: points,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["deliveryPoints"],
    queryFn: ({ pageParam }) =>
      orderService.deliveryPoints({
        country_id: country?.id,
        city_id: city?.id,
        lang: language?.locale,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
  });
  const pointList = extractDataFromPagination(points?.pages);
  const { state, dispatch } = useCheckout();
  const [pointSelectModalOpen, setPointSelectModalOpen] = useState(false);
  const handlePointSelect = (point: DeliveryPoint) => {
    dispatch({ type: Types.UpdateDeliveryPoint, payload: { point } });
    setPointSelectModalOpen(false);
  };
  if (isLoading) {
    return (
      <div className="my-7">
        <div className="flex flex-col gap-3">
          <div className="bg-gray-300 w-full rounded-full h-4" />
          <div className="bg-gray-300 w-3/5 rounded-full h-3" />
        </div>
        <div className="flex flex-col gap-3 mt-7">
          <div className="bg-gray-300 w-full rounded-full h-4" />
          <div className="bg-gray-300 w-3/5 rounded-full h-3" />
        </div>
      </div>
    );
  }
  if (pointList && pointList.length === 0) {
    return <div className="mt-7">{t("we.are.not.available.here")}</div>;
  }
  return (
    <div className="mt-7">
      <ActionButton
        onClick={() => setPointSelectModalOpen(true)}
        title={t("select.on.map")}
        icon={<MapPinRangeLineIcon />}
        subTitle={state.deliveryPoint?.translation?.title}
      />
      <InfiniteLoader hasMore={hasNextPage} loadMore={fetchNextPage} loading={isFetchingNextPage}>
        <RadioGroup
          by={comparePoints}
          value={state.deliveryPoint}
          onChange={(point) => dispatch({ type: Types.UpdateDeliveryPoint, payload: { point } })}
          className="mb-7"
        >
          {pointList?.map((point, i) => (
            <RadioGroup.Option key={point.id} value={point} className="cursor-pointer">
              {({ checked }) => (
                <div
                  className={clsx(
                    "flex items-center gap-2 py-3",
                    i !== (pointList ? pointList.length - 1 : 0) && "border-b border-gray-layout"
                  )}
                >
                  {checked ? (
                    <span className="text-primary dark:text-white">
                      <CheckIcon />
                    </span>
                  ) : (
                    <EmptyCheckIcon />
                  )}
                  <div className="flex flex-col">
                    <span className="text-base font-medium">{point.translation?.title}</span>
                    <span className="text-sm text-gray-field line-clamp-1">
                      {point.address?.[language?.locale || "en"]}
                    </span>
                  </div>
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </InfiniteLoader>
      <Modal
        size="xlarge"
        transparent
        withCloseButton
        isOpen={pointSelectModalOpen}
        onClose={() => setPointSelectModalOpen(false)}
      >
        <PointSelectMap onPointClick={handlePointSelect} />
      </Modal>
    </div>
  );
};
