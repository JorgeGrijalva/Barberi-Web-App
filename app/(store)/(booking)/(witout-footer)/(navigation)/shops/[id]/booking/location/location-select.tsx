"use client";

import { useBooking } from "@/context/booking";
import { useTranslation } from "react-i18next";
import { Types } from "@/context/booking/booking.reducer";
import { Autocomplete, MarkerF } from "@react-google-maps/api";
import { Input } from "@/components/input";
import Pin from "@/assets/img/pin.png";
import React, { useEffect, useRef, useState } from "react";
import { Map } from "@/components/map";
import { useSettings } from "@/hook/use-settings";
import { useSearchAddress } from "@/hook/use-search-address";
import { useRouter } from "next/navigation";

interface LocationSelectProps {
  shopSlug?: string;
}

export const LocationSelect = ({ shopSlug }: LocationSelectProps) => {
  const router = useRouter();
  const { state, dispatch } = useBooking();
  const { settings } = useSettings();
  const autoComplete = useRef<google.maps.places.Autocomplete>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(state.address?.address || "");
  const { mutate: search } = useSearchAddress();
  const onPlaceChanged = () => {
    if (autoComplete.current !== null) {
      const position = autoComplete.current.getPlace();
      setSearchValue(position?.formatted_address || "");
      dispatch({
        type: Types.UpdateAddress,
        payload: {
          address: position?.formatted_address || "",
          lat: position?.geometry?.location?.lat() || 0,
          long: position?.geometry?.location?.lng() || 0,
        },
      });
    }
  };

  useEffect(() => {
    if (!state.time && shopSlug) {
      router.replace(`/shops/${shopSlug}/booking`);
    }
  }, [state.time, shopSlug]);

  return (
    <div className="mt-6 flex flex-col gap-3">
      {map && (
        <Autocomplete
          onLoad={(autocomplete) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            autoComplete.current = autocomplete;
          }}
          onPlaceChanged={onPlaceChanged}
        >
          <Input
            label={t("address").toString()}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            fullWidth
            required
          />
        </Autocomplete>
      )}
      <Map
        onLoad={(loadedMap) => {
          setMap(loadedMap);
        }}
        onClick={(e) => {
          search(
            { lat: e.latLng?.lat(), lng: e.latLng?.lng() },
            {
              onSuccess: (res) => {
                setSearchValue(res?.results[0]?.formatted_address || "");
                dispatch({
                  type: Types.UpdateAddress,
                  payload: {
                    address: res?.results[0]?.formatted_address || "",
                    lat: e.latLng?.lat() || 0,
                    long: e.latLng?.lng() || 0,
                  },
                });
              },
            }
          );
        }}
        containerStyles={{ height: "400px", borderRadius: "15px" }}
        center={
          state.address
            ? {
                lat: state.address.lat || Number(settings?.latitude),
                lng: state.address.long || Number(settings?.longitude),
              }
            : undefined
        }
        options={{
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          minZoom: 3,
        }}
      >
        <MarkerF
          icon={Pin.src}
          position={{
            lat: state.address?.lat || Number(settings?.latitude),
            lng: state.address?.long || Number(settings?.longitude),
          }}
        />
      </Map>
    </div>
  );
};
