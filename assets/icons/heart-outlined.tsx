import React from "react";
import { IconType } from "@/types/utils";

const HeartOutlinedIcon: IconType = ({ size, ...otherProps }) => (
  <svg
    width={size || "36"}
    height={size || "36"}
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...otherProps}
  >
    <path
      d="M18 33C26.2843 33 33 26.2843 33 18C33 9.71573 26.2843 3 18 3C9.71573 3 3 9.71573 3 18C3 26.2843 9.71573 33 18 33Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.4954 26.175C18.2254 26.265 17.7604 26.265 17.4904 26.175C15.1504 25.38 9.90039 22.0349 9.90039 16.3649C9.90039 13.8599 11.9104 11.835 14.4004 11.835C15.8704 11.835 17.1754 12.5399 18.0004 13.6499C18.8104 12.5549 20.1304 11.835 21.6004 11.835C24.0904 11.835 26.1004 13.8599 26.1004 16.3649C26.1004 22.0349 20.8504 25.38 18.4954 26.175Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HeartOutlinedIcon;
