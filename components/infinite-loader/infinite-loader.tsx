import React from "react";
import { useElementOnScreen } from "@/hook/use-element-on-screen";
import LoadingIcon from "@/assets/icons/loading-icon";

interface Props extends React.PropsWithChildren {
  hasMore: boolean | undefined;
  loadMore: () => void;
  loading?: boolean;
}

export const InfiniteLoader = ({ hasMore, loadMore, loading = false, children }: Props) => {
  const targetRef = useElementOnScreen({
    enabled: !!hasMore && !loading,
    onScreen: () => {
      loadMore();
    },
    rootMargin: "30px",
    threshold: 0.2,
  });

  return (
    <>
      {children}
      {loading && (
        <div className="flex justify-center my-7">
          <LoadingIcon />
        </div>
      )}
      <span aria-label="bottom" ref={targetRef} style={{ visibility: "hidden" }} />
    </>
  );
};
