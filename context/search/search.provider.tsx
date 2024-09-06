"use client";

import React, { createContext, useContext, useMemo, useReducer } from "react";
import { useSearchParams } from "next/navigation";
import { InitialStateType, SearchActions, searchReducer } from "./search.reducer";

const initialState: InitialStateType = {
  category: {},
  location: {
    status: "",
  },
  date: {},
  searchTime: { time: null },
};

const SearchContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<SearchActions>;
}>({ state: initialState, dispatch: () => null });

const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [state, dispatch] = useReducer(searchReducer, initialState, () => ({
    date: { ...(searchParams.has("date") && { query: searchParams.get("date") }) },
    location: {
      status: "",
      ...(searchParams.has("location") && { query: searchParams.get("location") as string }),
      ...(searchParams.has("latitude") &&
        searchParams.has("longitude") && {
          geolocation: {
            longitude: searchParams.get("longitude") as string,
            latitude: searchParams.get("latitude") as string,
          },
        }),
    },
    category: {
      ...(searchParams.has("revenue") && { query: searchParams.get("revenue") as string }),
      ...(searchParams.has("category_id") && {
        categoryId: searchParams.get("category_id") as string,
      }),
    },
    searchTime: {
      ...(searchParams.has("timeFrom") &&
        searchParams.has("timeTo") && {
          to: searchParams.get("timeTo") as string,
          from: searchParams.get("timeFrom") as string,
        }),
    },
  }));
  const memoizedValue = useMemo(() => ({ state, dispatch }), [state]);
  return <SearchContext.Provider value={memoizedValue}>{children}</SearchContext.Provider>;
};

export default SearchProvider;
export const useSearch = () => {
  const searchContext = useContext(SearchContext);

  if (!searchContext) {
    throw new Error("useSearch has to be used within <Search.Provider>");
  }

  return searchContext;
};
