import React from "react";
import { IconType } from "@/types/utils";

const CrossIcon: IconType = ({ size, ...otherProps }) => (
  <svg
    width={size || "30"}
    height={size || "30"}
    {...otherProps}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1_7002)">
      <path
        d="M14.9999 13.2324L21.1874 7.04492L22.9549 8.81242L16.7674 14.9999L22.9549 21.1874L21.1874 22.9549L14.9999 16.7674L8.81242 22.9549L7.04492 21.1874L13.2324 14.9999L7.04492 8.81242L8.81242 7.04492L14.9999 13.2324Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_7002">
        <rect width="30" height="30" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default CrossIcon;
