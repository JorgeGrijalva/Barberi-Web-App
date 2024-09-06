import { Map } from "@/components/map";
import { LatLng } from "@/types/global";
import { MarkerF } from "@react-google-maps/api";
import Pin from "@/assets/img/pin.png";

export const OrderAddress = ({ location }: { location: LatLng }) => (
  <Map
    containerStyles={{ height: "300px", width: "100%", borderRadius: "15px" }}
    center={location}
    options={{ center: location, mapTypeControl: false, streetViewControl: false }}
    findMyLocation={false}
  >
    <MarkerF icon={Pin.src} position={location} />
  </Map>
);
