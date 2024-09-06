"use client";

import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import clsx from "clsx";
import CrossOutlinedIcon from "@/assets/icons/cross-outlined";
import { IconButton } from "../icon-button";

const sizes = {
  xsmall: "sm:max-w-sm",
  small: "sm:max-w-lg",
  medium: "sm:max-w-[640px]",
  large: "sm:max-w-[836px]",
  xlarge: "sm:max-w-5xl",
};

interface ModalProps extends React.PropsWithChildren {
  isOpen?: boolean;
  onClose?: () => void;
  withCloseButton?: boolean;
  size?: keyof typeof sizes;
  fixedButton?: boolean;
  disableCloseOnOverlayClick?: boolean;
  mobileFullHeight?: boolean;
  transparent?: boolean;
  overflowHidden?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  withCloseButton,
  children,
  size = "medium",
  fixedButton,
  disableCloseOnOverlayClick = false,
  mobileFullHeight,
  transparent,
  overflowHidden = true,
}: ModalProps) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog
      as="div"
      className="relative z-[9]"
      unmount
      onClose={() => (!!onClose && !disableCloseOnOverlayClick ? onClose() : null)}
    >
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300 "
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-40 z-[7]" />
      </Transition.Child>

      <div className="fixed sm:inset-0 w-full bottom-0 left-0 sm:overflow-y-auto z-[9]">
        <div className="flex min-h-full items-center justify-center md:p-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="sm:opacity-0 sm:translate-y-40 translate-y-full"
            enterTo="sm:opacity-100 translate-y-0 "
            leave="ease-in duration-200"
            leaveFrom="sm:opacity-100 sm:scale-100 "
            leaveTo="sm:opacity-0  sm:translate-y-40 translate-y-full"
          >
            <Dialog.Panel
              className={clsx(
                "w-full transform   sm:rounded-button  bg-white dark:bg-dark  dark:bg-opacity-50 dark:" +
                  "backdrop-blur-lg text-left rtl:text-right transition-all",
                sizes[size],
                mobileFullHeight
                  ? "h-screen md:h-auto"
                  : "sm:max-h-none max-h-[80vh] rounded-t-button",
                transparent && "bg-opacity-80 backdrop-blur-md",
                overflowHidden && "overflow-x-hidden overflow-y-auto"
              )}
            >
              {withCloseButton && (
                <div
                  className={clsx(
                    "sm:top-4 sm:right-5 rtl:left-5 max-w-max rtl:right-auto z-10",
                    fixedButton
                      ? "sm:absolute fixed right-2 top-2 rtl:left-2 rtl:right-auto"
                      : "absolute top-4 right-4 rtl:left-4 rtl:right-auto"
                  )}
                >
                  <IconButton rounded size="small" onClick={onClose}>
                    <CrossOutlinedIcon />
                  </IconButton>
                </div>
              )}
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);
