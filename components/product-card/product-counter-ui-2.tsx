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
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import { IconButton } from "@/components/icon-button";
import useUserStore from "@/global-store/user";

interface ProductCounterProps {
  onPlusClick: () => void;
  count?: number;
  onMinusClick: () => void;
  minQty?: number;
  unit?: Unit;
  interval?: number;
  cartDetailId?: number;
}

const ProductCounterUI2 = ({
  onMinusClick,
  onPlusClick,
  count,
  minQty = 1,
  unit,
  interval,
  cartDetailId,
}: ProductCounterProps) => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  return !!count && count > 0 ? (
    <div
      className={clsx(
        "flex items-center md:gap-3 border border-dark dark:border-white rounded-2xl overflow-hidden"
      )}
      onClick={(e) => e.preventDefault()}
    >
      {!!count && count > 0 && (
        <>
          <IconButton
            disabled={user ? !cartDetailId : false}
            onClick={onMinusClick}
            color="transparentWithHover"
            size="medium"
          >
            {count <= minQty ? <TrashIcon /> : <MinusIcon size={22} />}
          </IconButton>
          <span className="text-base font-medium ">{unitify(count, interval, unit)}</span>
        </>
      )}
      <IconButton onClick={onPlusClick} size="medium" color="transparentWithHover">
        <PlusIcon size={22} />
      </IconButton>
    </div>
  ) : (
    <Button
      size="xsmall"
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();
        onPlusClick();
      }}
      leftIcon={<PlusIcon />}
    >
      {t("add")}
    </Button>
  );
};

export default ProductCounterUI2;
