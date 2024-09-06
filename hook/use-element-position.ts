import { useEffect, useRef } from "react";

export const useElementPosition = (onScrolled: (value: boolean) => void) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = targetRef?.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.intersectionRatio <= 1 && entry.boundingClientRect.top <= 0) {
            onScrolled(true);
          } else {
            onScrolled(false);
          }
        }),
      {
        threshold: [1],
      }
    );
    observer.observe(node);

    // eslint-disable-next-line consistent-return
    return () => {
      observer.unobserve(node);
    };
  }, [targetRef?.current]);

  return targetRef;
};
