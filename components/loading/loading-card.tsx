import clsx from "clsx";
import React from "react";
import LoadingIcon from "@/assets/icons/loading-icon";

export const LoadingCard = ({ centered }: { centered?: boolean }) => (
  <div
    className={clsx(
      "flex items-center justify-center min-h-[200px]",
      centered && "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    )}
  >
    <LoadingIcon size={40} />
  </div>
);
