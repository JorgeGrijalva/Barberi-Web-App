import AnchorLeft from "@/assets/icons/anchor-left";
import React from "react";

interface ActionButtonProps {
  onClick: () => void;
  title: string;
  subTitle?: string;
  icon: React.ReactElement;
}

export const ActionButton = ({ onClick, subTitle, title, icon }: ActionButtonProps) => (
  <button
    onClick={onClick}
    className="px-2.5 py-4 inline-flex w-full items-center justify-between bg-amber-button rounded-2xl my-2 dark:bg-gray-800"
  >
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-dark text-white">
        {icon}
      </div>
      <div className="flex-1 flex flex-col">
        <span className="text-base font-semibold text-start">{title}</span>
        <span className="text-xs text-start">{subTitle}</span>
      </div>
    </div>
    <div className="rotate-180 rtl:rotate-0">
      <AnchorLeft />
    </div>
  </button>
);
