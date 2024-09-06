/* eslint-disable */
import React from "react";
import { IconType } from "@/types/utils";

const HeartFillIcon: IconType = (props) => (
  <svg
    width={props.size || "30"}
    height={props.size || "30"}
    {...props}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.98934 14.4978C1.25008 9.37488 4.37501 5.17286 7.85517 4.10778C11.25 3.06881 13.7501 4.12697 15 5.62488C16.2501 4.12697 18.75 3.0729 22.1316 4.10778C25.8386 5.24225 28.75 9.37488 27.0093 14.4978C24.8119 21.1353 16.2501 26.2477 15 26.2478C13.7498 26.2478 5.26041 21.2128 2.98934 14.4978Z"
      fill="#E34F26"
    />
  </svg>
);

export default HeartFillIcon;
