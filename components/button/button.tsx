import React, { forwardRef } from "react";
import clsx from "clsx";
import CircularLoading from "@/assets/icons/circular-loading";

const colors = {
  primary: "bg-primary text-white disabled:bg-gray-placeholder",
  black: "bg-dark text-white disabled:bg-gray-placeholder dark:bg-white dark:text-dark",
  white: "bg-white text-black",
  gray: "bg-gray-segment text-dark",
  blackOutlined: "border border-footerBg",
  whiteOutlined: "border border-white text-white",
  giantsOrange:
    "bg-giantsOrange text-white disabled:bg-gray-placeholder dark:bg-white dark:text-dark",
} as const;

const sizes = {
  xsmall: "text-xs font-medium py-2 px-4",
  small: "text-sm font-semibold py-2.5 px-6",
  medium: "text-base font-medium py-[13px] px-8",
  large: "text-base font-semibold py-[18px] md:px-14 px-6",
} as const;

type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = object
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>["ref"];

type PolymorphicComponentPropWithRef<
  C extends React.ElementType,
  Props = object
> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

type ButtonProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    size?: keyof typeof sizes;
    color?: keyof typeof colors;
    rounded?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactElement;
    rightIcon?: React.ReactElement;
    loading?: boolean;
    disabled?: boolean;
  }
>;

type ButtonComponent = <C extends React.ElementType = "button">(
  props: ButtonProps<C>
) => React.ReactElement | null;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export const Button: ButtonComponent = forwardRef(
  <C extends React.ElementType = "button">(
    {
      as,
      color = "primary",
      size = "large",
      rounded,
      fullWidth,
      loading,
      disabled,
      className,
      children,
      leftIcon,
      rightIcon,
      onClick,
      ...props
    }: ButtonProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || "button";
    return (
      <Component
        ref={ref}
        className={clsx(
          "outline-none focus:outline-none rounded-button overflow-hidden text-ellipsis whitespace-nowrap  inline-flex items-center gap-2 justify-center active:translate-y-px hover:brightness-95 focus-ring disabled:cursor-not-allowed disabled:active:translate-y-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          sizes[size],
          rounded && "rounded-full",
          fullWidth && "!w-full",
          colors[color],
          loading && "opacity-70 active:translate-y-0",
          className
        )}
        onClick={!disabled && !loading ? onClick : undefined}
        disabled={disabled}
        {...props}
      >
        {loading ? <CircularLoading size={24} /> : leftIcon}
        {children}
        {rightIcon}
      </Component>
    );
  }
);
