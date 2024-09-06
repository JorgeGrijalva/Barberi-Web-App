import { IconType } from "@/types/utils";
import React from "react";

const BagIcon: IconType = ({ size }) => (
  <svg
    width={size || "20"}
    height={size || "20"}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.08301 11.875C7.08301 13.475 8.39967 14.7917 9.99967 14.7917C11.5997 14.7917 12.9163 13.475 12.9163 11.875"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.34186 1.66699L4.3252 4.69199"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.6582 1.66699L15.6749 4.69199"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.66699 6.54167C1.66699 5 2.49199 4.875 3.51699 4.875H16.4837C17.5087 4.875 18.3337 5 18.3337 6.54167C18.3337 8.33333 17.5087 8.20833 16.4837 8.20833H3.51699C2.49199 8.20833 1.66699 8.33333 1.66699 6.54167Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M2.91699 8.33301L4.09199 15.533C4.35866 17.1497 5.00033 18.333 7.38366 18.333H12.4087C15.0003 18.333 15.3837 17.1997 15.6837 15.633L17.0837 8.33301"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default BagIcon;
