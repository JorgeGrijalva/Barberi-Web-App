import { useMutation } from "@tanstack/react-query";
import { Coordinate } from "@/types/global";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { useSettings } from "@/hook/use-settings";

export const useSearchAddress = () => {
  const { settings } = useSettings();
  return useMutation({
    mutationFn: async (location?: Partial<Coordinate>) => {
      const params = {
        latlng: `${location?.lat},${location?.lng}`,
        lang: "en",
        key: settings?.google_map_key
          ? settings.google_map_key
          : process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
      };
      return fetch(
        buildUrlQueryParams("https://maps.googleapis.com/maps/api/geocode/json", params)
      ).then((res) => res.json());
    },
  });
};
