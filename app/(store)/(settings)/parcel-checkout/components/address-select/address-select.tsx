"use client";

import SearchIcon from "@/assets/icons/search";
import { Autocomplete, MarkerF } from "@react-google-maps/api";
import React, { useRef, useState } from "react";
import { Map } from "@/components/map";
import { useTranslation } from "react-i18next";
import Pin from "@/assets/img/pin.png";
import { useSearchAddress } from "@/hook/use-search-address";
import { Button } from "@/components/button";
import { ParcelAddress } from "@/types/parcel";

interface AddressSelectProps extends ParcelAddress {
  onSave: (value: ParcelAddress) => void;
}

export const AddressSelect = ({ location, address, onSave }: AddressSelectProps) => {
  const { t } = useTranslation();
  const autoComplete = useRef<google.maps.places.Autocomplete>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { mutate: search } = useSearchAddress();
  const [currentLocation, setCurrentLocation] = useState(location);
  const [currentAddress, setCurrentAddress] = useState(address);
  const handlePlaceChange = () => {
    if (autoComplete.current !== null) {
      const place = autoComplete.current?.getPlace();
      setCurrentLocation({
        lat: place?.geometry?.location?.lat() || 0,
        lng: place?.geometry?.location?.lng() || 0,
      });
      setCurrentAddress(place?.formatted_address || "");
    }
  };

  const handleSave = () => {
    onSave({ address: currentAddress, location: currentLocation });
  };

  return (
    <div className="p-5">
      <h5 className="text-[22px] font-semibold mb-7">{t("change.address")}</h5>
      {map && (
        <Autocomplete
          className="flex-grow h-full shadow-none"
          onLoad={(autocomplete) => {
            // @ts-expect-error this is important because of ref
            autoComplete.current = autocomplete;
          }}
          onPlaceChanged={handlePlaceChange}
        >
          <div className="relative z-10">
            <div className="absolute inset-y-0 left-3 rtl:right-3 rtl:max-w-max flex items-center">
              <SearchIcon />
            </div>
            <input
              value={currentAddress}
              type="search"
              className="bg-white dark:bg-darkBg w-full rounded-2xl py-5 pl-11 rtl:pr-11 rtl:pl-3 pr-3"
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
          center: currentLocation,
        }}
        onLoad={(loadedMap) => setMap(loadedMap)}
        center={currentLocation}
        containerStyles={{
          width: "100%",
          height: "400px",
          position: "relative",
          top: "-10px",
          borderRadius: "15px",
        }}
        onClick={(e) => {
          setCurrentLocation({ lat: e.latLng?.lat() || 0, lng: e.latLng?.lng() || 0 });
          search(
            { lat: e.latLng?.lat(), lng: e.latLng?.lng() },
            {
              onSuccess: (res) => {
                setCurrentAddress(res?.results[0]?.formatted_address);
              },
            }
          );
        }}
      >
        <MarkerF position={currentLocation} icon={Pin.src} />
      </Map>
      <Button type="button" onClick={handleSave} fullWidth>
        {t("save")}
      </Button>
    </div>
  );
};
