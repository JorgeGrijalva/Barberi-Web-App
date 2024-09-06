import React, { forwardRef } from "react";
import clsx from "clsx";

interface HamburgerProps {
  isOpen: boolean;
}

export const Hamburger = forwardRef<HTMLButtonElement, HamburgerProps>(({ isOpen }, ref) => (
  <button className="relative group" ref={ref}>
    <div className="relative flex items-center justify-center transform transition-all">
      <div className="flex flex-col justify-between w-[24px] h-[12px] transform transition-all duration-300 origin-center">
        <div
          className={clsx(
            "bg-black h-[2px] w-7 transform transition-all duration-300 origin-left ",
            isOpen && "group-focus:rotate-[22deg]"
          )}
        />
        <div
          className={clsx(
            "bg-black h-[2px] w-7 transform transition-all duration-300 origin-left ",
            isOpen && "group-focus:-rotate-[22deg]"
          )}
        />
      </div>
    </div>
  </button>
));
