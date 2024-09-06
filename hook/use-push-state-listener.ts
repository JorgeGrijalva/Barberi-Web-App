/* eslint-disable no-restricted-globals */
import { useEffect } from "react";

export const usePushStateListener = (callback: (url?: string | URL | null) => void) => {
  useEffect(() => {
    // make a copy of original function to avoid complications
    const originalPushState = history.pushState;

    history.pushState = (data, title, url) => {
      originalPushState.apply(history, [data, title, url]);
      callback(url);
    };
    return () => {
      history.pushState = originalPushState; // restore the copy
    };
  }, [callback]);
};
