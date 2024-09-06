"use client";

import { Button } from "@/components/button";
import { Translate } from "@/components/translate";
import SearchIcon from "@/assets/icons/search";
import { useTranslation } from "react-i18next";
import LocationIcon from "@/assets/icons/location";
import ClockIcon from "@/assets/icons/clock";
import { Popover } from "@headlessui/react";
import clsx from "clsx";
import dayjs from "dayjs";
import { useSearch } from "@/context/search";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { SearchFieldCore } from "@/components/search-field-core";
import AnchorDownIcon from "@/assets/icons/anchor-down";
import { useMediaQuery } from "@/hook/use-media-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import ReactDOM from "react-dom";

dayjs.extend(customParseFormat);

interface SearchFieldProps {
  isInHeader?: boolean;
}

export const SearchField = ({ isInHeader }: SearchFieldProps) => {
  const { t } = useTranslation();
  const { state } = useSearch();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const [isDomReady, setIsDomReady] = useState(false);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  useEffect(() => {
    setIsDomReady(true);
  }, []);

  return (
    <SearchFieldCore>
      {({
        openServices,
        openPlaceModal,
        handleSearch,
        renderTimeSelectPanel,
        renderDateSelectPanel,
      }) => (
        <div
          className={clsx(
            "rounded-button bg-white flex items-end justify-between gap-2.5 drop-shadow-gray flex-wrap mx-4 z-[1]",
            isInHeader ? "border border-gray-link p-[5px]" : "py-2.5 px-5 "
          )}
        >
          <div className="relative  xl:min-w-[195px] min-w-full">
            <div className="flex gap-2.5 mb-2">
              <span>
                <SearchIcon />
              </span>
              <span className="text-sm text-start">{t("search")}</span>
            </div>
            <button
              className={clsx(
                "pl-5  md:py-5 py-4 text-sm w-full outline-none text-start bg-gray-bright rounded-button",
                !state.category.query && "text-gray-field"
              )}
              onClick={() => (isMobile ? router.push("/search/service") : openServices())}
            >
              {state.category.query || t("type")}
            </button>
          </div>
          <div className="relative  xl:min-w-[195px] min-w-full">
            <div className="flex gap-2.5 mb-2">
              <span>
                <LocationIcon />
              </span>
              <span className="text-sm text-start">{t("location")}</span>
            </div>
            <button
              className={clsx(
                "pl-5  md:py-5 py-4 text-sm outline-none w-full text-start bg-gray-bright rounded-button",
                !state.location.query && "text-gray-field"
              )}
              onClick={() => (isMobile ? router.push("/search/location") : openPlaceModal())}
            >
              {state.location.query || t("type.location")}
            </button>
          </div>
          <Popover className="relative  xl:min-w-[195px] min-w-full">
            <Popover.Button
              className="relative w-full flex items-center justify-start outline-none"
              onClick={isMobile ? () => router.push("/search/date") : undefined}
              ref={setReferenceElement}
            >
              <div className="relative w-full">
                <div className="flex gap-2.5 mb-2">
                  <span>
                    <ClockIcon />
                  </span>
                  <span className="text-sm text-start">{t("date")}</span>
                </div>
                <div
                  className={clsx(
                    "relative pl-5  md:py-5 py-4 text-sm outline-none md:min-w-[195px] text-start bg-gray-bright rounded-button",
                    !state.date.query && "text-gray-field"
                  )}
                >
                  {state.date.query ? <span>{state.date.query}</span> : t("choose.date")}
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark">
                    <AnchorDownIcon />
                  </span>
                </div>
              </div>
            </Popover.Button>
            {!isMobile &&
              isDomReady &&
              ReactDOM.createPortal(
                <Popover.Panel
                  ref={setPopperElement}
                  style={styles.popper}
                  {...attributes.popper}
                  unmount
                  className="z-[9]  md:top-14 md:rounded-button bg-white drop-shadow-xl md:px-5 md:pt-5 pb-5 px-4 pt-20 min-w-full md:min-w-[326px]"
                >
                  {renderDateSelectPanel()}
                </Popover.Panel>,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                document.getElementById("portal")
              )}
          </Popover>

          <Popover className="relative xl:min-w-[195px] min-w-full">
            <Popover.Button
              className="relative w-full flex items-center justify-start outline-none"
              onClick={isMobile ? () => router.push("/search/time") : undefined}
            >
              <div className="relative w-full">
                <div className="flex gap-2.5 mb-2">
                  <span>
                    <ClockIcon />
                  </span>
                  <span className="text-sm text-start">{t("time")}</span>
                </div>
                <div
                  className={clsx(
                    "relative pl-5 md:py-5 py-4 text-sm outline-none md:min-w-[195px] text-start bg-gray-bright rounded-button",
                    !state.searchTime.time && "text-gray-field"
                  )}
                >
                  {state.searchTime.time ? (
                    <span>
                      {state.searchTime.time.from} - {state.searchTime.time.to}
                    </span>
                  ) : (
                    t("choose.time")
                  )}
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-dark">
                    <AnchorDownIcon />
                  </span>
                </div>
              </div>
            </Popover.Button>
            {!isMobile && (
              <Popover.Panel className="absolute z-[9] top-24 rounded-button bg-white drop-shadow-xl p-5  h-screen md:h-auto">
                {renderTimeSelectPanel({ withButton: true })}
              </Popover.Panel>
            )}
          </Popover>
          <div className="xl:max-w-[160px] w-full">
            <Button
              onClick={() => handleSearch({ replace: false })}
              size="large"
              color="giantsOrange"
              fullWidth
            >
              <Translate value="search" />
            </Button>
          </div>
        </div>
      )}
    </SearchFieldCore>
  );
};
