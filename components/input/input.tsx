/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import clsx from "clsx";
import React, { forwardRef, InputHTMLAttributes, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconButton } from "../icon-button";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  label?: string;
  error?: string;
  rightIcon?: React.ReactElement | null;
  leftIcon?: React.ReactElement | null;
  status?: "default" | "error" | "success";
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      fullWidth,
      label,
      type,
      className,
      error,
      rightIcon,
      status = "default",
      autoComplete,
      placeholder,
      leftIcon,
      containerClassName,
      required,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [inputType, setInputType] = useState(type || "text");
    const { t } = useTranslation();
    const inputId = useId();

    const handleChangeType = () => {
      if (inputType === "password") {
        setInputType("text");
      } else {
        setInputType("password");
      }
    };

    return (
      <div
        className={clsx(
          "relative flex flex-col items-start",
          fullWidth && "w-full",
          containerClassName
        )}
      >
        <div className={clsx("relative", fullWidth && "w-full")}>
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            autoComplete="off"
            placeholder=" "
            disabled={disabled}
            {...props}
            className={clsx(
              "block px-4 w-full text-sm  bg-transparent rounded-button border appearance-none focus:outline-none focus:ring-0  peer ",
              fullWidth && "w-full",
              !!rightIcon && "pr-8",
              !!leftIcon && "pl-10",
              label ? "pt-4 pb-[12px]" : "py-[19px]",
              status === "default" && "border-gray-link focus-visible:border-primary",
              status === "error" && "border-badge-product focus-visible:border-red-700",
              status === "success" && "border-green-500 focus-visible:border-red-700",
              disabled && "text-gray-field",
              className
            )}
          />
          {type === "password" && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
              <IconButton rounded type="button" onClick={handleChangeType}>
                {inputType === "password" ? (
                  <i className="ri-eye-line" />
                ) : (
                  <i className="ri-eye-close-line" />
                )}
              </IconButton>
            </div>
          )}
          {!!leftIcon && (
            <div className="absolute inset-y-0 left-3 flex items-center pr-3 z-[4]">{leftIcon}</div>
          )}
          {!!rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 z-[4]">
              {rightIcon}
            </div>
          )}

          <label
            htmlFor={inputId}
            className={clsx(
              "absolute text-sm text-gray-placeholder duration-300 transform -translate-y-3 scale-75 top-3.5 origin-[0] peer-focus:text-black dark:peer-focus:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5",
              leftIcon ? "left-10 rtl:right-10 rtl:left-auto" : "left-4 rtl:right-0 rtl:left-auto",
              disabled && "text-gray-field"
            )}
          >
            {label}
            {required && "*"}
          </label>
        </div>
        {error && (
          <p role="alert" className="text-red text-sm mt-1">
            {t(error)}
          </p>
        )}
      </div>
    );
  }
);
