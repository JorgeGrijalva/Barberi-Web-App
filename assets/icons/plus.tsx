import React from "react";
import { IconType } from "@/types/utils";

const PlusIcon: IconType = ({ size, ...otherProps }) => (
  <svg
    width={size || "24"}
    height={size || "24"}
    {...otherProps}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1_10942)">
      <path
        d="M11 10.9999V4.99986H13V10.9999H19V12.9999H13V18.9999H11V12.9999H5V10.9999H11Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_10942">
        <rect width="24" height="24" fill="currentColor" />
      </clipPath>
    </defs>
  </svg>
);

export default PlusIcon;
