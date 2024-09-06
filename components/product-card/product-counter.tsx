"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import MinusIcon from "@/assets/icons/minus";
import PlusIcon from "@/assets/icons/plus";
import TrashIcon from "@/assets/icons/trash";
import { Unit } from "@/types/product";
import { unitify } from "@/utils/unitify";
import clsx from "clsx";
import React from "react";
import useUserStore from "@/global-store/user";
import { Price } from "@/components/price";

interface ProductCounterProps {
  onPlusClick: () => void;
  count?: number;
  onMinusClick: () => void;
  minQty?: number;
  unit?: Unit;
  interval?: number;
  cartDetailId?: number;
  price?: number;
}

const ProductCounter = ({
  onMinusClick,
  onPlusClick,
  count,
  minQty = 1,
  unit,
  interval,
  cartDetailId,
  price,
}: ProductCounterProps) => {
  const user = useUserStore((state) => state.user);
  return (
    <div
      className={clsx(
        "absolute bottom-4 right-4 z-[2]",
        !!count && count > 0 && "bottom-2.5 right-2.5"
      )}
    >
      <div
        className={clsx(
          "flex items-center gap-3 bg-dark bg-opacity-30 backdrop-blur-lg rounded-button",
          !!count && count > 0 && "p-1"
        )}
        onClick={(e) => e.preventDefault()}
      >
        {!!count && count > 0 && (
          <>
            <button
              onClick={onMinusClick}
              disabled={user ? !cartDetailId : false}
              className=" w-10 h-10 inline-flex items-center justify-center bg-white bg-opacity-30 backdrop-blur-lg rounded-full hover:bg-opacity-10 active:scale-95 text-white disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:bg-opacity-30"
            >
              {count <= minQty ? <TrashIcon /> : <MinusIcon />}
            </button>
            <span className="text-base font-medium text-white">
              {unitify(count, interval, unit)}
            </span>
          </>
        )}
        <button
          onClick={onPlusClick}
          className={clsx(
            "inline-flex gap-1 items-center justify-center rounded-button py-2 px-3 hover:bg-opacity-10 active:scale-95 text-white",
            !!count && count > 0 && "bg-white bg-opacity-30 backdrop-blur-lg rounded-full w-10 h-10"
          )}
        >
          <PlusIcon />
          {!!count && count > 0 ? null : <Price number={price} />}
        </button>
      </div>
    </div>
  );
};

export default ProductCounter;
