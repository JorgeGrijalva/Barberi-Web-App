import clsx from "clsx";
import React, { forwardRef } from "react";

const sizes = {
  withoutPadding: "ring-offset-2",
  small: "p-1",
  medium: "p-2",
  large: "p-3",
  xlarge: "p-[18px]",
} as const;

const colors = {
  transparent: "bg-transparent disabled:text-gray-inputBorder",
  black:
    "bg-black text-white hover:brightness-95 disabled:bg-gray-placeholder disabled:brightness-100 dark:bg-white dark:text-dark dark:disabled:bg-gray-darkSegment dark:disabled:text-white",
  primary:
    "bg-primary text-white hover:brightness-95 disabled:bg-gray-placeholder disabled:brightness-100",
  white: "bg-white text-black hover:brightness-95 disabled:bg-gray-card disabled:brightness-100",
  gray: "bg-dark bg-opacity-60 backdrop-blur-lg",
  lightGray: "bg-gray-segment text-dark",
  blackOutlined: "border border-dark dark:border-white",
  grayOutlined: "border border-gray-link dark:border-white",
  transparentWithHover:
    "bg-transparent hover:bg-gray-layout disabled:cursor-not-allowed hover:disabled:bg-transparent dark:hover:bg-gray-bold disabled:text-gray-inputBorder",
} as const;

interface IconButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: keyof typeof colors;
  size?: keyof typeof sizes;
  rounded?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButton>(
  (
    {
      color = "transparent",
      size = "withoutPadding",
      rounded = false,
      children,
      className,
      ...restProps
    },
    ref
  ) => (
    <button
      className={clsx(
        "focus-ring outline-none active:translate-y-[1px] aspect-square disabled:active:translate-y-0 ",
        rounded ? "rounded-button" : "rounded-[5px]",
        colors[color],
        sizes[size],
        className
      )}
      {...restProps}
      ref={ref}
    >
      {children}
    </button>
  )
);
