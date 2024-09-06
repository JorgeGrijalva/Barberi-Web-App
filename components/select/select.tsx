import AnchorDownIcon from "@/assets/icons/anchor-down";
import CheckIcon from "@/assets/icons/check";
import EmptyCheckIcon from "@/assets/icons/empty-check";
import { Listbox, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment } from "react";
import { useTranslation } from "react-i18next";

interface SelectProps<T> {
  options?: T[];
  value?: T;
  label?: string;
  onSelect: (value: T) => void;
  extractTitle: (value?: T) => string | number | undefined;
  extractKey: (value: T) => string | number;
  error?: string | null;
  icon?: React.ReactNode;
  required?: boolean;
  className?: string;
  checkById?: boolean;
  showTempValue?: boolean;
}

export const Select = <T,>({
  value,
  onSelect,
  options,
  label,
  extractTitle,
  extractKey,
  error,
  icon,
  required,
  className,
  checkById = true,
  showTempValue,
}: SelectProps<T>) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
      <Listbox value={value} onChange={onSelect} {...(checkById && { by: "id" })}>
        <div className="relative">
          <Listbox.Button
            className={clsx(
              "relative w-full max-h-[60px] border border-gray-inputBorder p-5 outline-none focus-ring rounded-button flex items-center justify-between",
              className
            )}
          >
            {({ open }) => (
              <>
                {!!label && (
                  <div className="flex gap-3 items-center">
                    {icon}
                    <span className="text-sm font-medium text-gray-placeholder">
                      {label}
                      {required && "*"}
                    </span>
                  </div>
                )}
                <div
                  className={clsx("flex gap-3 items-center", !label && "w-full justify-between")}
                >
                  <span
                    className={clsx(
                      "block truncate text-xs font-medium",
                      showTempValue && !value && "text-gray-placeholder"
                    )}
                  >
                    {extractTitle(value) || (showTempValue ? t("select.option") : "")}
                  </span>
                  <div className={clsx(open ? "rotate-180" : "rotate-0", "transition-all")}>
                    <AnchorDownIcon aria-hidden="true" />
                  </div>
                </div>
              </>
            )}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-[3] mt-2 max-h-60  w-full overflow-auto rounded-[10px] shadow-select bg-white bg-opacity-80 backdrop-blur-lg dark:bg-darkBg outline-none focus-ring">
              <div>
                {options?.map((option, i) => (
                  <Listbox.Option
                    key={extractKey(option)}
                    className={({ active }) =>
                      `relative cursor-default font-medium select-none py-4 flex items-center gap-2.5 px-5 ${
                        active ? "bg-gray-100 dark:bg-gray-bold" : ""
                      } ${i !== 0 && "border-t border-gray-inputBorder"}`
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <>
                        {selected ? (
                          <div className="text-primary">
                            <CheckIcon />
                          </div>
                        ) : (
                          <div className="text-gray-field">
                            <EmptyCheckIcon />
                          </div>
                        )}
                        <span className="block text-sm truncate">{extractTitle(option)}</span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </div>
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {!!error && <p className="text-red text-sm mt-1">{error || ""}</p>}
    </div>
  );
};
