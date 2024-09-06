import React from "react";
import clsx from "clsx";

interface AlertProps {
  icon: React.ReactElement;
  message: React.ReactNode;
  type: "success" | "warning" | "error" | "info";
}

const styles = {
  success: "bg-green-600",
  warning: "bg-yellow-600",
  error: "bg-red-600",
  info: "bg-blue-600",
};

export const Alert = ({ icon, message, type }: AlertProps) => (
  <div className={clsx("rounded-3xl flex items-center gap-3")}>
    <div
      className={clsx(
        "w-6 h-6 rounded-xl flex items-center justify-center  text-white",
        styles[type]
      )}
    >
      {icon}
    </div>
    <div className="text-base dark:text-white">{message}</div>
  </div>
);
