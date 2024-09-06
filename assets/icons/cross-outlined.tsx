import { IconType } from "@/types/utils";

const CrossOutlinedIcon: IconType = ({ size }) => (
  <svg
    width={size || "32"}
    height={size || "32"}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.0003 29.3332C23.3337 29.3332 29.3337 23.3332 29.3337 15.9998C29.3337 8.6665 23.3337 2.6665 16.0003 2.6665C8.66699 2.6665 2.66699 8.6665 2.66699 15.9998C2.66699 23.3332 8.66699 29.3332 16.0003 29.3332Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.2266 19.7732L19.7732 12.2266"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.7732 19.7732L12.2266 12.2266"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CrossOutlinedIcon;
