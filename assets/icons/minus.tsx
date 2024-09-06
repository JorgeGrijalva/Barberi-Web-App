import React from "react";
import { IconType } from "@/types/utils";

const MinusIcon: IconType = ({ size, ...otherProps }) => (
  <svg
    width={size || "24"}
    height={size || "24"}
    {...otherProps}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1_9041)">
      <path d="M5 11H19V13H5V11Z" fill="currentColor" />
    </g>
    <defs>
      <clipPath id="clip0_1_9041">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default MinusIcon;
