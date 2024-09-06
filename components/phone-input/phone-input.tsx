import ReactPhoneInput, { PhoneInputProps as ReactPhoneInputProps } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import clsx from "clsx";
import React, { useId } from "react";
import { useTranslation } from "react-i18next";

interface PhoneInputProps extends Omit<ReactPhoneInputProps, "inputClass"> {
  status?: "default" | "error" | "success";
  error?: string;
}

export const PhoneInput = ({ status = "default", error, ...otherProps }: PhoneInputProps) => {
  const id = useId();
  const { t } = useTranslation();
  return (
    <div className="relative" dir="ltr">
      <ReactPhoneInput
        {...otherProps}
        inputProps={{ id }}
        dropdownClass="!rounded-2xl dark:!bg-dark"
        buttonClass="!rouned-2xl !bg-transparent !border-none hover:!bg-transparent"
        inputClass={clsx(
          "block px-4 w-full !text-sm bg-transparent !rounded-2xl border appearance-none focus:outline-none focus:ring-0  peer !w-full",
          "!py-[29px]",
          status === "default" && "!border-gray-inputBorder focus-visible:border-primary",
          status === "error" && "!border-badge-product focus-visible:border-red-700",
          status === "success" && "!border-green-500 focus-visible:border-red-700"
        )}
      />
      {error && (
        <p role="alert" className="text-red text-sm mt-1">
          {t(error)}
        </p>
      )}
    </div>
  );
};
