import { memo, useEffect, useState } from "react";
import { OverlayView, OverlayViewF } from "@react-google-maps/api";
import UserLocationLineIcon from "remixicon-react/UserLocationLineIcon";
import FlagLineIcon from "remixicon-react/FlagLineIcon";
import { Price } from "@/components/price";
import dynamic from "next/dynamic";

interface ParcelMapProps {
  locationTo: {
    lat: number;
    lng: number;
  };
  locationFrom: {
    lat: number;
    lng: number;
  };
  price?: number;
}

const Map = dynamic(() =>
  import("@/components/map").then((component) => ({ default: component.Map }))
);

export const ParcelMap = memo(({ locationTo, locationFrom, price }: ParcelMapProps) => {
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (map) {
      const latLngTo = new google.maps.LatLng(locationTo.lat, locationTo.lng);
      const latLngFrom = new google.maps.LatLng(locationFrom.lat, locationFrom.lng);
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(latLngTo);
      bounds.extend(latLngFrom);
      map?.fitBounds(bounds, 20);
    }
  }, [map, locationFrom, locationTo]);
  return (
    <Map
      onLoad={(currentMap) => setMap(currentMap)}
      containerStyles={{
        width: "100%",
        height: "100%",
        maxHeight: "600px",
        borderRadius: "15px",
      }}
      options={{
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        zoomControl: false,
      }}
    >
      <OverlayViewF position={locationFrom} mapPaneName={OverlayView.MAP_PANE}>
        <div className="bg-white dark:bg-dark w-11 h-11 rounded-xl flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <UserLocationLineIcon />
        </div>
      </OverlayViewF>
      <OverlayViewF position={locationTo} mapPaneName={OverlayView.MAP_PANE}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white dark:bg-dark w-11 h-11 rounded-xl flex items-center justify-center relative">
            {!!price && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-sm px-2 py-1 rounded-full text-white">
                <Price number={price} />
              </div>
            )}
            <FlagLineIcon />
          </div>
        </div>
      </OverlayViewF>
    </Map>
  );
});
