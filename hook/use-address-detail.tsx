import { useMutation } from "@tanstack/react-query";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { useSettings } from "@/hook/use-settings";

export const useAddressDetail = () => {
  const { settings } = useSettings();
  return useMutation({
    mutationFn: async (placeId?: string) => {
      const params = {
        place_id: placeId,
        key: settings?.google_map_key
          ? settings.google_map_key
          : process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
      };
      return fetch(
        buildUrlQueryParams("https://maps.googleapis.com/maps/api/place/details/json", params),
        {
          mode: "no-cors",
          headers: new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
          }),
        }
      ).then((res) => res.json());
    },
  });
};
