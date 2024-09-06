import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import { error } from "@/components/alert";
import { useSearchAddress } from "@/hook/use-search-address";
import { useSearch } from "@/context/search";
import { Types } from "@/context/search/search.reducer";
import { useState } from "react";

interface NearbySearchProps {
  onSuccess: (value: string) => void;
}

export const NearbySearch = ({ onSuccess }: NearbySearchProps) => {
  const { t } = useTranslation();
  const { mutate: searchAddress } = useSearchAddress();
  const { dispatch } = useSearch();
  const [loading, setLoading] = useState(false);
  const handleSearchNearby = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (geoResponse) => {
          searchAddress(
            { lat: geoResponse.coords.latitude, lng: geoResponse.coords.longitude },
            {
              onSuccess: (res) => {
                const result = res?.results?.[0]?.formatted_address;
                onSuccess(result);
                dispatch({
                  type: Types.SetLocation,
                  payload: {
                    query: result,
                    geolocation: {
                      longitude: geoResponse.coords.longitude.toString(),
                      latitude: geoResponse.coords.latitude.toString(),
                    },
                  },
                });
              },
              onError: () => {
                error(t("cant.get.place.info"));
              },
              onSettled: () => {
                setLoading(false);
              },
            }
          );
        },
        () => {
          setLoading(false);
        }
      );
    } else {
      error(t("your.browser.dosnt.support.this.feature"));
    }
  };
  return (
    <Button loading={loading} color="black" size="small" onClick={handleSearchNearby}>
      {t("search.nearby")}
    </Button>
  );
};
