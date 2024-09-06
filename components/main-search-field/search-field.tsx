"use client";

import { Button } from "@/components/button";
import { Translate } from "@/components/translate";
import SearchIcon from "@/assets/icons/search";
import { useTranslation } from "react-i18next";
import LocationIcon from "@/assets/icons/location";
import CalendarIcon from "@/assets/icons/calendar";
import ClockIcon from "@/assets/icons/clock";
import { Popover } from "@headlessui/react";
import clsx from "clsx";
import dayjs from "dayjs";
import { useSearch } from "@/context/search";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useMediaQuery } from "@/hook/use-media-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePopper } from "react-popper";
import ReactDOM from "react-dom";
import { SearchFieldCore } from "../search-field-core";

dayjs.extend(customParseFormat);

interface SearchFieldSeparatorProps {
  isInHeader?: boolean;
}

interface SearchFieldProps extends SearchFieldSeparatorProps {
  withPadding?: boolean;
  withButton?: boolean;
}

const Separator = ({ isInHeader }: SearchFieldSeparatorProps) => (
  <div
    className={clsx("w-px bg-dark bg-opacity-20 hidden lg:block", isInHeader ? "h-7" : "h-12")}
  />
);

export const SearchField = ({
  isInHeader,
  withPadding = true,
  withButton = true,
}: SearchFieldProps) => {
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
          offset: [0, 20],
        },
      },
    ],
  });

  useEffect(() => {
    setIsDomReady(true);
  }, []);
  return (
    <div className={clsx(isInHeader && "hidden xl:block", "w-full lg:w-auto")}>
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
              "rounded-button bg-white flex items-center justify-between lg:gap-5 gap-2.5 flex-col lg:flex-row w-full lg:w-auto",
              isInHeader && "border border-gray-link p-[5px]",
              withPadding && "lg:py-2 lg:px-5 px-3 py-3"
            )}
          >
            <div className="relative w-full lg:w-auto rounded-button border border-gray-link lg:border-none">
              <span className="absolute  lg:left-0 left-3 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </span>
              <button
                className={clsx(
                  "lg:pl-6 pl-9 lg:py-2 py-3 text-sm outline-none lg:min-w-[160px] min-w-full text-start",
                  !state.category.query && "text-gray-field"
                )}
                onClick={() => (isMobile ? router.push("/search/service") : openServices())}
              >
                {state.category.query || t("any")}
              </button>
            </div>
            <Separator isInHeader={isInHeader} />
            <div className="relative w-full lg:w-auto rounded-button border border-gray-link lg:border-none">
              <span className="absolute  lg:left-0 left-3 top-1/2 -translate-y-1/2">
                <LocationIcon />
              </span>
              <button
                className={clsx(
                  "lg:pl-6 pl-9 lg:py-2 py-3 text-sm outline-none lg:min-w-[160px] lg:max-w-[200px] min-w-full text-start whitespace-nowrap text-ellipsis overflow-hidden",
                  !state.location.query && "text-gray-field"
                )}
                onClick={() => (isMobile ? router.push("/search/location") : openPlaceModal())}
              >
                {state.location.query || t("where")}
              </button>
            </div>
            <Separator isInHeader={isInHeader} />
            <Popover className="md:relative w-full lg:w-auto">
              <Popover.Button
                ref={setReferenceElement}
                onClick={isMobile ? () => router.push("/search/date") : undefined}
                className="relative lg:min-w-[160px] flex items-center justify-start w-full lg:w-auto min-w-full rounded-button border border-gray-link lg:border-none outline-none"
              >
                <span className="absolute lg:left-0 left-3  top-1/2 -translate-y-1/2">
                  <CalendarIcon />
                </span>
                <span
                  className={clsx(
                    "lg:pl-6 pl-9 lg:py-2 py-3 text-sm outline-none",
                    !state.date.query && "text-gray-field"
                  )}
                >
                  {state.date.query ? state.date.query : t("date")}
                </span>
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

            <Separator isInHeader={isInHeader} />
            <Popover className="md:relative w-full lg:w-auto">
              <Popover.Button
                onClick={isMobile ? () => router.push("/search/time") : undefined}
                className="relative lg:min-w-[160px] flex items-center justify-start w-full lg:w-auto min-w-full rounded-button border border-gray-link lg:border-none outline-none"
              >
                <span className="absolute lg:left-0 left-3 top-1/2 -translate-y-1/2">
                  <ClockIcon />
                </span>
                <span
                  className={clsx(
                    "lg:pl-6 pl-9 lg:py-2 py-3 text-sm  outline-none ",
                    !state.searchTime.time && "text-gray-field"
                  )}
                >
                  {state.searchTime.time ? (
                    <span>
                      {state.searchTime.time.from} - {state.searchTime.time.to}
                    </span>
                  ) : (
                    t("time")
                  )}
                </span>
              </Popover.Button>
              {!isMobile && (
                <Popover.Panel className="absolute z-[9] left-0 md:left-auto top-0 md:top-14 md:rounded-button bg-white drop-shadow-xl md:px-5 md:pt-5 pb-5 px-4 pt-20 min-w-full md:min-w-[326px]">
                  {renderTimeSelectPanel({ withButton })}
                </Popover.Panel>
              )}
            </Popover>
            {withButton && (
              <div className="w-full lg:w-auto">
                <Button
                  fullWidth
                  onClick={() => handleSearch({ replace: false })}
                  size="small"
                  color="black"
                >
                  <Translate value="search" />
                </Button>
              </div>
            )}
          </div>
        )}
      </SearchFieldCore>
    </div>
  );
};
