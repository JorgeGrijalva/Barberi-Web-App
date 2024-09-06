"use client";

import { DeliveryPoint } from "@/types/global";
import SearchIcon from "@/assets/icons/search";
import { Autocomplete, MarkerF } from "@react-google-maps/api";
import React, { useRef, useState } from "react";
import { defaultLocation } from "@/config/global";
import Pin from "@/assets/img/pin.png";
import { Map } from "@/components/map";
import { useTranslation } from "react-i18next";
import useAddressStore from "@/global-store/address";
import { useInfiniteQuery } from "@tanstack/react-query";
import { orderService } from "@/services/order";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import dynamic from "next/dynamic";
import { Modal } from "@/components/modal";
import { useMediaQuery } from "@/hook/use-media-query";
import { useSettings } from "@/hook/use-settings";
import { PointCard } from "./point-card";

const PointDetail = dynamic(() =>
  import("./point-detail").then((component) => ({ default: component.PointDetail }))
);

export const PointSelectMap = ({
  onPointClick,
}: {
  onPointClick: (point: DeliveryPoint) => void;
}) => {
  const { t } = useTranslation();
  const autoComplete = useRef<google.maps.places.Autocomplete>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [location, setLocation] = useState(defaultLocation);
  const [selectedPoint, setSelectedPoint] = useState<DeliveryPoint | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { language } = useSettings();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const {
    data: points,
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
  const handlePlaceChange = () => {
    if (autoComplete.current !== null) {
      const place = autoComplete.current?.getPlace();
      setLocation({
        lat: place?.geometry?.location?.lat() || 0,
        lng: place?.geometry?.location?.lng() || 0,
      });
      // onAddressChange(place?.formatted_address || "");
    }
  };
  return (
    <div className="p-5 ">
      <h5 className="text-[22px] font-semibold mb-7">{t("change.point")}</h5>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 lg:gap-4 gap-2">
        {selectedPoint ? (
          <div className="hidden md:block">
            <PointDetail
              data={selectedPoint}
              onSelect={(value) => onPointClick(value)}
              onBack={() => setSelectedPoint(null)}
            />
          </div>
        ) : (
          <div className="flex-col gap-3 hidden md:flex">
            <InfiniteLoader
              hasMore={hasNextPage}
              loadMore={fetchNextPage}
              loading={isFetchingNextPage}
            >
              {pointList?.map((point) => (
                <PointCard
                  onSelect={(value) => {
                    setSelectedPoint(value);
                    setLocation({
                      lat: Number(value.location.latitude),
                      lng: Number(value.location.longitude),
                    });
                  }}
                  data={point}
                  key={point.id}
                />
              ))}
            </InfiniteLoader>
          </div>
        )}
        <div className="lg:col-span-2">
          {map && (
            <Autocomplete
              className="shadow-none"
              onLoad={(autocomplete) => {
                // @ts-expect-error this is important because of ref
                autoComplete.current = autocomplete;
              }}
              onPlaceChanged={handlePlaceChange}
            >
              <div className="relative z-10">
                <div className="absolute inset-y-0 left-3 rtl:right-3 rtl:left-auto flex items-center">
                  <SearchIcon />
                </div>
                <input
                  type="search"
                  className="bg-white dark:bg-gray-darkSegment w-full rounded-2xl py-5 pl-11 rtl:pr-11 rtl:pl-3 pr-3"
                />
              </div>
            </Autocomplete>
          )}
          <Map
            options={{
              minZoom: 3,
              fullscreenControl: false,
              zoomControl: false,
              mapTypeControl: false,
              scaleControl: false,
              streetViewControl: false,
              center: location,
            }}
            onLoad={(loadedMap) => setMap(loadedMap)}
            center={location}
            containerStyles={{
              width: "100%",
              height: "600px",
              position: "relative",
              top: "-10px",
              borderRadius: "15px",
            }}
          >
            {pointList?.map((point) => (
              <MarkerF
                key={point.id}
                icon={Pin.src}
                onClick={() => {
                  setSelectedPoint(point);
                  setLocation({
                    lat: Number(point.location.latitude),
                    lng: Number(point.location.longitude),
                  });
                }}
                position={{
                  lat: Number(point.location.latitude),
                  lng: Number(point.location.longitude),
                }}
              />
            ))}
          </Map>
        </div>
      </div>
      {!!selectedPoint && (
        <Modal isOpen={!!selectedPoint && isMobile} onClose={() => setSelectedPoint(null)}>
          <PointDetail
            onSelect={(value) => onPointClick(value)}
            data={selectedPoint}
            onBack={() => setSelectedPoint(null)}
          />
        </Modal>
      )}
    </div>
  );
};
