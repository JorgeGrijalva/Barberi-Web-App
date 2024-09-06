import { InputHTMLAttributes } from "react";

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  disabled?: boolean;
  defaultChecked?: boolean;
  label?: string;
}

export const Radio = ({ id, label, ...otherProps }: RadioProps) => (
  <div className="w-full flex gap-2 relative items-center">
    <input
      className="peer relative appearance-none shrink-0 w-6 h-6 "
      type="radio"
      id={id}
      {...otherProps}
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6 absolute pointer-events-none stroke-white fill-white dark:fill-gray-bold peer-checked:!hidden "
    >
      <g clipPath="url(#clip0_367_4772)">
        <circle cx="12" cy="12" r="8" stroke="#080210" strokeWidth="2" />
      </g>
      <defs>
        <clipPath id="clip0_367_4772">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6 absolute pointer-events-none stroke-white fill-none peer-checked:!fill-red-500 !hidden peer-checked:!block dark:peer-checked:!fill-white"
    >
      <g clipPath="url(#clip0_367_4768)">
        <circle cx="12" cy="12" r="8" fill="#080210" stroke="#080210" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" fill="white" />
      </g>
      <defs>
        <clipPath id="clip0_367_4768">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
    <label className="text-sm font-medium" htmlFor={id}>
      {label}
    </label>
  </div>
);
