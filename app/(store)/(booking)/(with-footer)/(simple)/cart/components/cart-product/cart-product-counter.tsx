"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import MinusIcon from "@/assets/icons/minus";
import PlusIcon from "@/assets/icons/plus";
import TrashIcon from "@/assets/icons/trash";
import { unitify } from "@/utils/unitify";
import clsx from "clsx";
import React from "react";

interface ProductCounterProps {
  onPlusClick: () => void;
  count?: number;
  onMinusClick: () => void;
  minQty: number;
  isCounterLoading: boolean;
  interval?: number;
  disabled?: boolean;
}

const CartProductCounter = ({
  onMinusClick,
  onPlusClick,
  count,
  minQty = 1,
  isCounterLoading,
  interval,
  disabled,
}: ProductCounterProps) => (
  <div className={clsx("flex items-center lg:gap-3 gap-2")} onClick={(e) => e.preventDefault()}>
    {!!count && count > 0 && (
      <>
        <button
          onClick={isCounterLoading ? undefined : onMinusClick}
          disabled={isCounterLoading || disabled}
          className=" w-9 h-9 inline-flex items-center justify-center   rounded-full hover:bg-opacity-10 active:scale-95 border border-gray-border dark:border-gray-bold disabled:cursor-not-allowed disabled:bg-gray-100 disabled:active:scale-100 dark:disabled:bg-gray-darkSegment"
        >
          {count < minQty + 1 ? <TrashIcon /> : <MinusIcon />}
        </button>
        <span className="text-base font-medium ">{unitify(count, interval)}</span>
      </>
    )}
    <button
      onClick={isCounterLoading ? undefined : onPlusClick}
      disabled={isCounterLoading || disabled}
      className={clsx(
        "w-9 h-9 inline-flex items-center justify-center rounded-full hover:bg-opacity-10 active:scale-95 border border-gray-border dark:border-gray-bold disabled:cursor-not-allowed disabled:bg-gray-100 disabled:active:scale-100 dark:disabled:bg-gray-darkSegment"
      )}
    >
      <PlusIcon />
    </button>
  </div>
);

export default CartProductCounter;
