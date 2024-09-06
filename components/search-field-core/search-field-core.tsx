"use client";

import React from "react";
import { useModal } from "@/hook/use-modal";
import { Modal } from "@/components/modal";
import dynamic from "next/dynamic";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { useSearch } from "@/context/search";
import { useRouter } from "next/navigation";
import { useSettings } from "@/hook/use-settings";
import { useJsApiLoader } from "@react-google-maps/api";
import { DateSelect } from "@/components/search-field-core/date-select";
import dayjs from "dayjs";
import { TimeSelect } from "@/components/search-field-core/time-select";
import { Types } from "@/context/search/search.reducer";

interface SearchFieldCoreProps {
  children: (options: {
    openServices: () => void;
    openPlaceModal: () => void;
    handleSearch: (searchOption: { scroll?: boolean; replace?: boolean }) => void;
    renderDateSelectPanel: () => React.ReactNode;
    renderTimeSelectPanel: (options: { withButton?: boolean }) => React.ReactNode;
  }) => React.ReactNode;
}

const ServiceSelect = dynamic(() =>
  import("./service-select").then((component) => ({ default: component.ServiceSelect }))
);
const PlaceSelect = dynamic(() =>
  import("./place-select").then((component) => ({ default: component.PlaceSelect }))
);

const libraries: "places"[] = ["places"];

export const SearchFieldCore = ({ children }: SearchFieldCoreProps) => {
  const [isServicesModalOpen, openServicesModal, closeServicesModal] = useModal();
  const [isPlaceModalOpen, openPlaceModal, closePlaceModal] = useModal();
  const router = useRouter();
  const { state, dispatch } = useSearch();
  const { settings } = useSettings();

  useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: settings?.google_map_key || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    libraries,
  });

  const handleSearch = ({ scroll, replace }: { scroll?: boolean; replace?: boolean }) => {
    const url = buildUrlQueryParams("/search", {
      date: state.date.query,
      category_id: state.category.categoryId,
      revenue: state.category.query,
      timeFrom: state.searchTime.time?.from,
      timeTo: state.searchTime.time?.to,
      latitude: state.location.geolocation?.latitude || settings?.latitude,
      longitude: state.location.geolocation?.longitude || settings?.longitude,
      location: state.location.query,
    });
    if (replace) {
      router.replace(url, { scroll });
      return;
    }
    router.push(url, { scroll });
  };

  const handleChangeFromTime = (time: Date) => {
    dispatch({
      type: Types.SetTime,
      payload: {
        from: dayjs(time).format("HH:mm"),
        to: dayjs(time).add(1, "hour").format("HH:mm"),
      },
    });
  };
  const handleChangeToTime = (time: Date) => {
    dispatch({
      type: Types.SetTime,
      payload: {
        from: state.searchTime.time?.from || dayjs(time).subtract(1, "hour").format("HH:mm"),
        to: dayjs(time).format("HH:mm"),
      },
    });
  };

  const renderDateSelectPanel = () => (
    <div className="border-t md:border-none border-gray-link flex flex-col justify-between h-full">
      <DateSelect
        onChange={(value) => {
          dispatch({
            type: Types.SetDate,
            payload: dayjs(value).format("DD, MM YYYY"),
          });
        }}
        value={state.date.query ? dayjs(state.date.query, "DD, MM YYYY").toDate() : undefined}
      />
    </div>
  );

  const renderTimeSelectPanel = ({ withButton }: { withButton?: boolean }) => (
    <div className="flex items-center gap-4 border-t md:border-none border-gray-link pt-5 md:pt-5">
      <TimeSelect
        value={
          state.searchTime.time ? dayjs(state.searchTime.time.from, "HH:mm").toDate() : undefined
        }
        label="from"
        onChange={(value: Date) => {
          handleChangeFromTime(value);
          if (!withButton) {
            handleSearch({ replace: true });
          }
        }}
        showPastTime={
          state.date.query
            ? dayjs(state.date.query, "DD, MM YYYY").isSame(dayjs(), "day")
            : undefined
        }
      />
      <TimeSelect
        label="to"
        onChange={(value) => {
          handleChangeToTime(value);
          if (!withButton) {
            handleSearch({ replace: true });
          }
        }}
        value={
          state.searchTime.time?.to ? dayjs(state.searchTime.time.to, "HH:mm").toDate() : undefined
        }
        showPastTime={
          state.date.query
            ? dayjs(state.date.query, "DD, MM YYYY").isSame(dayjs(), "day")
            : undefined
        }
      />
    </div>
  );

  return (
    <>
      {children({
        openServices: openServicesModal,
        openPlaceModal,
        handleSearch,
        renderDateSelectPanel,
        renderTimeSelectPanel,
      })}
      <Modal isOpen={isServicesModalOpen} onClose={closeServicesModal} mobileFullHeight>
        <ServiceSelect closeModal={closeServicesModal} />
      </Modal>

      <Modal isOpen={isPlaceModalOpen} onClose={closePlaceModal} mobileFullHeight>
        <PlaceSelect closeModal={closePlaceModal} />
      </Modal>
    </>
  );
};
