import { Shop } from "@/types/shop";
import MapPinFillIcon from "@/assets/icons/map-pin-fill";
import MapPinEmptyIcon from "@/assets/icons/map-pin-empty";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import dynamic from "next/dynamic";

const ShopInfo = dynamic(() =>
  import("./shop-info").then((component) => ({ default: component.ShopInfo }))
);

interface ShopMarkerProps {
  data: Shop;
  onMarkerClick?: () => void;
  isMobile: boolean;
}

export const ShopMarker = ({ data, onMarkerClick, isMobile }: ShopMarkerProps) => (
  <Popover className="xl:relative">
    {({ open }) => (
      <>
        <Popover.Button
          onClick={() => isMobile && !!onMarkerClick && onMarkerClick()}
          className="outline-none"
        >
          <div className="relative hover:scale-150 transition-all hover:-translate-y-[20%] z-[1]">
            {!!data.r_avg && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[10px] font-medium">
                {data.r_avg || 0}
              </span>
            )}
            {data.r_avg ? <MapPinFillIcon /> : <MapPinEmptyIcon />}
          </div>
        </Popover.Button>
        {!isMobile && (
          <Transition
            as={Fragment}
            show={!isMobile && open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel
              static
              className="fixed xl:absolute left-0 xl:left-1/2 z-10 mt-3  xl:max-w-sm -translate-x-1/2 transform  lg:max-w-3xl "
            >
              <ShopInfo data={data} />
            </Popover.Panel>
          </Transition>
        )}
      </>
    )}
  </Popover>
);
