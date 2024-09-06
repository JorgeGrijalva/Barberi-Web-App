"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => (
  <NextThemesProvider {...props}>
    <ToastContainer />
    {children}
  </NextThemesProvider>
);

export default ThemeProvider;
