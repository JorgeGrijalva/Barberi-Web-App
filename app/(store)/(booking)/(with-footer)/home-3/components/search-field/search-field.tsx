"use client";

import { Button } from "@/components/button";
import { Translate } from "@/components/translate";
import SearchIcon from "@/assets/icons/search";
import { useTranslation } from "react-i18next";
import LocationIcon from "@/assets/icons/location";
import clsx from "clsx";
import dayjs from "dayjs";
import { useSearch } from "@/context/search";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { SearchFieldCore } from "@/components/search-field-core";
import { useMediaQuery } from "@/hook/use-media-query";
import { useRouter } from "next/navigation";

dayjs.extend(customParseFormat);

interface SearchFieldSeparatorProps {
  isInHeader?: boolean;
}

interface SearchFieldProps extends SearchFieldSeparatorProps {
  withButton?: boolean;
}

export const SearchField = ({ isInHeader, withButton = true }: SearchFieldProps) => {
  const { t } = useTranslation();
  const { state } = useSearch();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  return (
    <div className={clsx(isInHeader && "hidden xl:block", "w-full lg:w-auto")}>
      <SearchFieldCore>
        {({ openServices, openPlaceModal, handleSearch }) => (
          <div
            className={clsx(
              "flex items-center lg:gap-3 gap-2.5 flex-col lg:flex-row w-full lg:w-auto"
            )}
          >
            <div className="bg-white px-7 md:py-3 py-0.5 relative w-full lg:w-auto  rounded-4xl border border-gray-link lg:border-none">
              <span className="absolute  lg:left-7 left-3 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </span>
              <button
                className={clsx(
                  "lg:pl-6 pl-3 lg:py-2 py-3 text-sm outline-none lg:min-w-[304px] min-w-full text-start",
                  !state.category.query && "text-gray-field"
                )}
                onClick={() => (isMobile ? router.push("/search/service") : openServices())}
              >
                {state.category.query || t("any")}
              </button>
            </div>
            <div className="bg-white px-7 md:py-3 py-0.5 relative w-full lg:w-auto rounded-4xl border border-gray-link lg:border-none">
              <span className="absolute  lg:left-7 left-3 top-1/2 -translate-y-1/2">
                <LocationIcon />
              </span>
              <button
                className={clsx(
                  "lg:pl-6 pl-3 lg:py-2 py-3 text-sm outline-none lg:min-w-[240px] lg:max-w-[240px] min-w-full text-start whitespace-nowrap text-ellipsis overflow-hidden",
                  !state.location.query && "text-gray-field"
                )}
                onClick={() => (isMobile ? router.push("/search/location") : openPlaceModal())}
              >
                {state.location.query || t("where")}
              </button>
            </div>
            {withButton && (
              <div className="w-full lg:w-auto h-full">
                <Button
                  fullWidth
                  onClick={() => handleSearch({ replace: false })}
                  color="black"
                  className="!rounded-4xl"
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
