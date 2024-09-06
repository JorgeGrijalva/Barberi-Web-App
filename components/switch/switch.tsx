import React, { Fragment } from "react";
import { Switch as HeadlessSwitch } from "@headlessui/react";
import clsx from "clsx";

const sizes = {
  large: {
    width: "w-20",
    height: "h-8",
    translateFrom: "translate-x-[52px] rtl:-translate-x-2",
    translateTo: "translate-x-2 rtl:-translate-x-[52px]",
    textTranslateFrom: "translate-x-2 rtl:-translate-x-9",
    textTranslateTo: "translate-x-9 rtl:-translate-x-2",
  },
  medium: {
    width: "w-14",
    height: "h-7",
    translateFrom: "translate-x-8 rlt:-translate-x-1",
    translateTo: "translate-x-1 rtl:-translate-x-8",
    textTranslateFrom: "translate-x-1 rtl:-translate-x-7",
    textTranslateTo: "translate-x-7 rtl:-translate-x-1",
  },
} as const;

interface SwitchProps {
  value?: boolean;
  onChange?: (checked: boolean) => void;
  size?: keyof typeof sizes;
  onText?: string;
  offText?: string;
  defaultChecked?: boolean;
}

export const Switch = ({
  value,
  onChange,
  size = "large",
  onText,
  offText,
  defaultChecked,
}: SwitchProps) => (
  <HeadlessSwitch
    as={Fragment}
    defaultChecked={defaultChecked}
    checked={value}
    onChange={(newValue) => !!onChange && onChange(newValue)}
  >
    {({ checked }) => (
      <button
        className={clsx(
          checked ? "bg-primary" : "bg-gray-layout dark:bg-gray-inputBorder",
          sizes[size].height,
          sizes[size].width,
          "relative inline-flex  items-center rounded-full outline-none focus-ring"
        )}
      >
        {!!onText && !!offText && (
          <span
            className={clsx(
              checked ? `${sizes[size].textTranslateFrom} text-white` : sizes[size].textTranslateTo,
              "absolute transition-all"
            )}
          >
            {checked ? onText : offText}
          </span>
        )}
        <div
          className={clsx(
            checked ? sizes[size].translateFrom : sizes[size].translateTo,
            "h-5 w-5 transform rounded-full bg-white transition shadow-md flex items-center gap-1 justify-center"
          )}
        >
          <div className="w-px h-[60%] rounded-full bg-gray-layout" />
          <div className="w-px h-[60%] rounded-full bg-gray-layout" />
        </div>
      </button>
    )}
  </HeadlessSwitch>
);
