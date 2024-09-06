import React from "react";
import clsx from "clsx";
import { Menu } from "@headlessui/react";

interface MessageActionButtonProps {
  icon: React.ReactElement;
  text: string;
  danger?: boolean;
  onClick: () => void;
}

export const MessageActionButton = ({ icon, text, danger, onClick }: MessageActionButtonProps) => (
  <Menu.Item>
    {({ active, close }) => (
      <button
        onClick={() => {
          onClick();
          close();
        }}
        className={clsx(
          "px-3 py-2 inline-flex items-center gap-5 hover:bg-gray-segment dark:hover:bg-gray-inputBorder",
          active && "bg-gray-segment",
          danger && "text-red"
        )}
      >
        {icon}
        {text}
      </button>
    )}
  </Menu.Item>
);
