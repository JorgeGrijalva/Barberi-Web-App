import React from "react";
import { IconType } from "@/types/utils";

const AnchorLeftIcon: IconType = ({ size, ...otherProps }) => (
  <svg
    width={size || "30"}
    height={size || "30"}
    {...otherProps}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.5 9.375C17.5 9.375 12.5 14.375 12.5 15C12.5 15.625 17.5 20.625 17.5 20.625"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AnchorLeftIcon;
