/* eslint-disable no-restricted-globals */
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const useUrlSyncedState = <T>(
  deserialize: (params: ReadonlyURLSearchParams) => T,
  serialize: (data: T, params: URLSearchParams) => void
): [T, Dispatch<SetStateAction<T>>] => {
  const searchParams = useSearchParams();
  // initialize state with deserialized params
  // params is always non-null in app directory, so we can use non-null assert
  const [state, setState] = useState<T>(() => deserialize(searchParams!));
  // store changed state in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oldParamsString = params.toString();
    serialize(state, params);
    const str = params.toString();
    if (str !== oldParamsString) {
      const newHref = `${location.pathname}${str === "" ? "" : `?${str}`}`;
      // https://github.com/vercel/next.js/discussions/18072#discussioncomment-109059
      window.history.replaceState(
        { ...window.history.state, as: newHref, url: newHref },
        "",
        newHref
      );
    }
  }, [state, serialize]);
  return [state, setState];
};
