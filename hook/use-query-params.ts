"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useQueryParams = <T = unknown>(option?: { scroll?: boolean; push?: boolean }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(Array.from(searchParams.entries()));

  const setQueryParams = useCallback(
    (params: Partial<T>, multiple = true) => {
      Object.entries(params).forEach(([key, value]) => {
        const prevValues = urlSearchParams.getAll(key);
        if (prevValues.includes(String(value)) && multiple) {
          urlSearchParams.delete(key);
          prevValues.forEach((prevValue) => {
            if (prevValue !== String(value)) {
              urlSearchParams.append(key, String(prevValue));
            }
          });
        } else if (!multiple) {
          urlSearchParams.set(key, String(value));
        } else if (value) {
          urlSearchParams.append(key, String(value));
        } else {
          urlSearchParams.delete(key);
        }
      });

      const search = urlSearchParams.toString();
      const query = search ? `?${search}` : "";

      if (option?.push) {
        window.history.pushState(null, "", `${pathname}${query}`);
        return;
      }
      window.history.replaceState(null, "", `${pathname}${query}`);
    },
    [urlSearchParams.toString(), pathname]
  );
  const deleteParams = useCallback(
    (paramKey: string) => {
      const filteredParams: Record<string, string> = {};
      urlSearchParams.delete(paramKey);
      urlSearchParams.forEach((value, key) => {
        filteredParams[key] = value;
      });
      const search = urlSearchParams.toString();
      const query = search ? `?${search}` : "";

      if (option?.push) {
        window.history.pushState(null, "", `${pathname}${query}`);
      }
      window.history.replaceState(null, "", `${pathname}${query}`);
    },
    [urlSearchParams.toString(), pathname]
  );

  return { urlSearchParams, setQueryParams, deleteParams };
};
