import React from "react";
import { IconType } from "@/types/utils";

const CheckIcon: IconType = ({ size, ...otherProps }) => (
  <svg
    width={size || "22"}
    height={size || "22"}
    viewBox="0 0 22 22"
    {...otherProps}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1_1522)">
      <path
        d="M10.9997 20.1667C5.93692 20.1667 1.83301 16.0628 1.83301 11C1.83301 5.93726 5.93692 1.83334 10.9997 1.83334C16.0624 1.83334 20.1663 5.93726 20.1663 11C20.1663 16.0628 16.0624 20.1667 10.9997 20.1667ZM10.0858 14.6667L16.5666 8.18493L15.2704 6.88876L10.0858 12.0743L7.49251 9.48109L6.19634 10.7773L10.0858 14.6667Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_1522">
        <rect width="22" height="22" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default CheckIcon;
