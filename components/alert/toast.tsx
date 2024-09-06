"use client";

import { Slide, toast, ToastOptions } from "react-toastify";
import CheckboxCircleLineIcon from "remixicon-react/CheckboxCircleLineIcon";
import ErrorWarningLineIcon from "remixicon-react/ErrorWarningLineIcon";
import InformationLineIcon from "remixicon-react/InformationLineIcon";
import React from "react";
import { IconButton } from "@/components/icon-button";
import CrossIcon from "@/assets/icons/cross";
import { Alert } from "./alert";

const defaultOptions: ToastOptions = {
  closeButton: (
    <IconButton>
      <CrossIcon size={24} />
    </IconButton>
  ),
  hideProgressBar: true,
  className:
    "!bg-white !bg-opacity-60 !rounded-2xl backdrop-blur-lg dark:!bg-dark dark:!bg-opacity-30",
  transition: Slide,
};

export const success = (msg: React.ReactNode, options: ToastOptions = defaultOptions) => {
  toast(<Alert icon={<CheckboxCircleLineIcon />} message={msg} type="success" />, options);
};
export const warning = (msg: React.ReactNode, options: ToastOptions = defaultOptions) => {
  toast(<Alert icon={<ErrorWarningLineIcon />} message={msg} type="warning" />, options);
};
export const error = (msg: React.ReactNode, options: ToastOptions = defaultOptions) => {
  toast(<Alert icon={<ErrorWarningLineIcon />} message={msg} type="error" />, options);
};
export const info = (msg: React.ReactNode, options: ToastOptions = defaultOptions) => {
  toast(<Alert icon={<InformationLineIcon />} message={msg} type="info" />, options);
};
