import { MarkerClusterer, OverlayView, OverlayViewF } from "@react-google-maps/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { shopService } from "@/services/shop";
import { extractDataFromPagination } from "@/utils/extract-data";
import { useSettings } from "@/hook/use-settings";
import { useQueryParams } from "@/hook/use-query-params";
import { useState } from "react";
import { Shop } from "@/types/shop";
import { Drawer } from "@/components/drawer";
import dynamic from "next/dynamic";
import { useMediaQuery } from "@/hook/use-media-query";
import { useDebounce } from "@/hook/use-debounce";
import { ShopMarker } from "./shop-marker";

const ShopInfo = dynamic(() =>
  import("./shop-info").then((component) => ({ default: component.ShopInfo }))
);

interface MarkerClusterProps {
  centerLongitude?: string;
  centerLatitude?: string;
}

export const MarkerCluster = ({ centerLatitude, centerLongitude }: MarkerClusterProps) => {
  const { language, settings } = useSettings();
  const { urlSearchParams } = useQueryParams({ scroll: false });
  const [selectedShop, setSelectedShop] = useState<Shop | undefined>();
  const isMobile = useMediaQuery("(max-width: 1200px)");
  const debouncePriceFrom = useDebounce(urlSearchParams.get("priceFrom") || undefined, 500);
  const debouncePriceTo = useDebounce(urlSearchParams.get("priceTo") || undefined, 500);
  const { data: shops } = useInfiniteQuery(
    [
      "shops",
      language?.locale,
      centerLongitude,
      centerLatitude,
      urlSearchParams.get("order_by"),
      debouncePriceFrom,
      debouncePriceTo,
      urlSearchParams.get("column"),
      urlSearchParams.get("sort"),
      urlSearchParams.get("category_id"),
      urlSearchParams.getAll("take"),
      urlSearchParams.get("has_discount"),
      urlSearchParams.get("service_type"),
      urlSearchParams.get("gender"),
    ],
    () =>
      shopService.getAll({
        lang: language?.locale,
        location_type: "2",
        column: urlSearchParams.has("column") ? urlSearchParams.get("column") : "distance",
        sort: urlSearchParams.has("sort") ? urlSearchParams.get("sort") : "asc",
        "address[latitude]": centerLatitude ?? settings?.latitude,
        "address[longitude]": centerLongitude ?? settings?.longitude,
        order_by: urlSearchParams.get("order_by"),
        "service_prices[0]": debouncePriceFrom,
        "service_prices[1]": debouncePriceTo,
        has_discount: urlSearchParams.has("has_discount") ? urlSearchParams.get("has_discount") : 0,
        category_id: urlSearchParams.get("category_id"),
        ...Object.assign(
          {},
          ...urlSearchParams.getAll("take").map((take, index) => ({ [`take[${index}]`]: take }))
        ),
        service_type: urlSearchParams.get("service_type"),
        gender: urlSearchParams.get("gender"),
      }),
    {
      keepPreviousData: true,
    }
  );

  const shopList = extractDataFromPagination(shops?.pages);
  return (
    <>
      <MarkerClusterer>
        {() => (
          <div>
            {shopList?.map((shop) => (
              <OverlayViewF
                position={{
                  lat: Number(shop.lat_long.latitude || 43),
                  lng: Number(shop.lat_long.longitude || 54),
                }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                  <ShopMarker
                    data={shop}
                    isMobile={isMobile}
                    onMarkerClick={() => setSelectedShop(shop)}
                  />
                </div>
              </OverlayViewF>
            ))}
          </div>
        )}
      </MarkerClusterer>
      <Drawer
        open={!!selectedShop}
        onClose={() => setSelectedShop(undefined)}
        position="bottom"
        withCloseIcon={false}
        container={false}
        withBorderRadius
      >
        {selectedShop && <ShopInfo data={selectedShop} />}
      </Drawer>
    </>
  );
};
