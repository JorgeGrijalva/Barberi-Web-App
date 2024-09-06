/* eslint-disable react/destructuring-assignment */
import React from "react";
import { IconType } from "@/types/utils";

const DoubleCheckIcon: IconType = (props) => (
  <svg
    width={props.size || "20"}
    height={props.size || "20"}
    {...props}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1_9251)">
      <path
        d="M9.66825 11.4667L10.8449 12.6434L17.8999 5.58838L19.0783 6.76671L10.8449 15L5.54159 9.69671L6.71992 8.51838L8.49075 10.2892L9.66825 11.4659V11.4667ZM9.66992 9.11004L13.7966 4.98254L14.9716 6.15754L10.8449 10.285L9.66992 9.11004ZM7.31409 13.8225L6.13659 15L0.833252 9.69671L2.01159 8.51838L3.18909 9.69588L3.18825 9.69671L7.31409 13.8225Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_9251">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default DoubleCheckIcon;
