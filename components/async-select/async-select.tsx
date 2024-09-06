import { Combobox, Transition } from "@headlessui/react";
import AnchorDownIcon from "@/assets/icons/anchor-down";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import fetcher from "@/lib/fetcher";
import { useDebounce } from "@/hook/use-debounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { Paginate, ParamsType } from "@/types/global";
import clsx from "clsx";
import CheckIcon from "@/assets/icons/check";
import EmptyCheckIcon from "@/assets/icons/empty-check";
import { LoadingCard } from "@/components/loading";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { IconButton } from "@/components/icon-button";
import CrossIcon from "@/assets/icons/cross";
import { useMediaQuery } from "@/hook/use-media-query";

const sizes = {
  large: "py-[19px]",
  medium: "py-[11px]",
};

interface AsyncSelectFieldProps<T extends { id: number }> {
  value?: T;
  label?: string;
  onSelect: (value: T) => void;
  extractTitle: (value?: T) => string;
  extractKey: (value: T) => string | number;
  queryKey?: string;
  status?: "default" | "error" | "success";
  queryParams?: ParamsType;
  size?: keyof typeof sizes;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export const AsyncSelect = <T extends { id: number }>({
  value,
  onSelect,
  extractKey,
  extractTitle,
  label,
  queryKey,
  status = "default",
  queryParams,
  size = "large",
  disabled,
  error,
  required,
}: AsyncSelectFieldProps<T>) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const debouncedQuery = useDebounce(query);
  const {
    data: options,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [queryKey, debouncedQuery, queryParams],
    queryFn: ({ pageParam }) =>
      fetcher<Paginate<T>>(
        buildUrlQueryParams(queryKey as string, {
          search: debouncedQuery,
          page: pageParam,
          ...queryParams,
        })
      ),
    enabled: !!queryKey && (isInputFocused || (isMobile && isMobileDrawerOpen)),
    getNextPageParam: (lastPage) =>
      lastPage?.meta && lastPage?.links?.next && lastPage.meta.current_page + 1,
  });

  const optionsList = extractDataFromPagination(options?.pages);

  return (
    <Combobox
      disabled={disabled}
      value={value}
      onChange={onSelect}
      by={(a, b) => extractKey(a) === extractKey(b)}
    >
      {({ open }) => (
        <div className="relative ">
          {!!label && (
            <Combobox.Label className="text-sm">
              {t(label)}
              {required && "*"}:
            </Combobox.Label>
          )}
          <div
            className={clsx(
              "relative w-full cursor-default  text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
            )}
          >
            <Combobox.Input
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              className={clsx(
                "px-4  w-full text-sm bg-transparent rounded-2xl border appearance-none focus:outline-none focus:ring-0  peer hidden md:block",
                status === "default" && "border-gray-inputBorder focus-visible:border-primary",
                status === "error" && "border-badge-product focus-visible:border-red-700",
                status === "success" && "border-green-500 focus-visible:border-red-700",
                sizes[size],
                disabled && "text-gray-field cursor-not-allowed"
              )}
              displayValue={extractTitle}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen((old) => !old)}
              className="block px-4 text-start w-full text-sm bg-transparent rounded-2xl border appearance-none focus:outline-none focus:ring-0  peer border-gray-inputBorder focus-visible:border-primary md:hidden h-11"
            >
              {value && extractTitle(value)}
            </button>
            <Combobox.Button
              type="button"
              className={clsx(
                "absolute inset-y-0 right-0 rtl:left-1  rtl:right-auto flex items-center pr-2",
                disabled && "text-gray-field"
              )}
            >
              <AnchorDownIcon className="h-5 w-5 " aria-hidden="true" />
            </Combobox.Button>
          </div>
          {!!error && (
            <p role="alert" className="text-sm text-red mt-1">
              {error}
            </p>
          )}
          <InfiniteLoader
            hasMore={hasNextPage}
            loadMore={fetchNextPage}
            loading={isFetchingNextPage}
          >
            <Transition
              as={Fragment}
              show={isMobile ? isMobileDrawerOpen : open}
              enter="ease-out duration-300"
              enterFrom="sm:translate-y-0 translate-y-full"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0 sm:translate-y-0 translate-y-full"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options
                className="md:absolute fixed bottom-0 left-0 md:bottom-auto pt-4 min-h-[40vh] md:min-h-0 md:pt-0 rounded-t-2xl md:rounded-t-md md:rounded-b-md w-screen md:w-full mt-1 md:max-h-60 max-h-[80vh] overflow-auto bg-white dark:bg-dark py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-20"
                static
              >
                <div className="md:hidden flex items-center justify-between px-2 pb-2">
                  <span className="text-base">{t(label || "")}</span>
                  <IconButton onClick={() => setIsMobileDrawerOpen(false)} type="button">
                    <CrossIcon />
                  </IconButton>
                </div>
                {/* eslint-disable-next-line */}
                {isLoading ? (
                  <LoadingCard />
                ) : optionsList?.length === 0 || query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    {t("nothing.found")}
                  </div>
                ) : (
                  optionsList?.map((option, i) => (
                    <Combobox.Option
                      onClick={() => isMobile && setIsMobileDrawerOpen(false)}
                      key={extractKey(option)}
                      className={({ active }) =>
                        `relative cursor-default font-medium select-none py-4 flex items-center gap-2.5 px-5 ${
                          active ? "bg-gray-100 dark:bg-gray-bold" : ""
                        } ${i !== 0 && "border-t border-gray-inputBorder"}`
                      }
                      value={option}
                    >
                      {({ selected }) => (
                        <>
                          {selected ? (
                            <div className="text-primary dark:text-white">
                              <CheckIcon />
                            </div>
                          ) : (
                            <div className="text-gray-field">
                              <EmptyCheckIcon />
                            </div>
                          )}
                          <span
                            className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                          >
                            {extractTitle(option)}
                          </span>
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </InfiniteLoader>
        </div>
      )}
    </Combobox>
  );
};
