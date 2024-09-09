"use client";

import { Map } from "@/components/map";
import { useCallback, useEffect, useState } from "react";
import { useSettings } from "@/hook/use-settings";
import { useQueryParams } from "@/hook/use-query-params";
import { Location } from "@/types/global";
import { useDebounce } from "@/hook/use-debounce";
import { MarkerCluster } from "./marker-cluster";

interface LocationWithDistance extends Location {
  distance: string;
}

export const ShopsInMap = () => {
  const [map, setMap] = useState<google.maps.Map>();
  const [center, setCenter] = useState<LocationWithDistance | null>(null);
  const debouncedCenter = useDebounce(center);
  const { setQueryParams, urlSearchParams } = useQueryParams({ scroll: false });
  const { settings } = useSettings();

  const handleChangeMapCenter = useCallback(() => {
    if (map)
      setCenter({
        latitude: map.getCenter()?.lat().toString() || "",
        longitude: map.getCenter()?.lng()?.toString() || "",
        distance: map.getZoom()?.toString() || "",
      });
  }, [map]);

  useEffect(() => {
    if ((debouncedCenter?.longitude, debouncedCenter?.longitude)) {
      setQueryParams(debouncedCenter, false);
    }
  }, [debouncedCenter?.longitude, debouncedCenter?.longitude]);

  useEffect(() => {
    if (map && urlSearchParams.get("latitude") && urlSearchParams.get("longitude")) {
      const newCenter = new google.maps.LatLng(
        Number(urlSearchParams.get("latitude")),
        Number(urlSearchParams.get("longitude"))
      );
      map?.panTo(newCenter);
    }
  }, [map, Number(urlSearchParams.get("latitude")), Number(urlSearchParams.get("longitude"))]);

  return (
    <Map
      containerStyles={{ width: "100%", height: "100%" }}
      center={
        urlSearchParams.has("latitude") && urlSearchParams.has("longitude")
          ? {
              lat: Number(urlSearchParams.get("latitude")),
              lng: Number(urlSearchParams.get("longitude")),
            }
          : {
              lat: Number(settings?.latitude),
              lng: Number(settings?.longitude),
            }
      }
      zoom={urlSearchParams?.has("distance") ? Number(urlSearchParams.get("distance")) : undefined}
      options={{
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControl: false,
        streetViewControl: false,
      }}
      onLoad={(newMap) => setMap(newMap)}
      onCenterChange={handleChangeMapCenter}
    >
      <MarkerCluster
        centerLatitude={debouncedCenter?.latitude}
        centerLongitude={debouncedCenter?.longitude}
      />
    </Map>
  );
};
