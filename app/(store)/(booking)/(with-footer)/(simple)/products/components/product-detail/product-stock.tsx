"use client";

import { ExtraValue as ExtraValueType, Stock } from "@/types/product";
import { groupExtras } from "@/utils/group-extras";
import React, { useMemo } from "react";
import clsx from "clsx";
import { Button } from "@/components/button";
import { useCart } from "@/hook/use-cart";
import { IconButton } from "@/components/icon-button";
import MinusIcon from "@/assets/icons/minus";
import PlusIcon from "@/assets/icons/plus";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { unitify } from "@/utils/unitify";
import { useElementPosition } from "@/hook/use-element-position";
import Link from "next/link";
// import useUserStore from "@/global-store/user";
import useCartStore from "@/global-store/cart";
import { ExtraValue } from "../extra-value";

interface ProductStockProps {
  stocks?: Stock[];
  fullPage?: boolean;
  minQty?: number;
  selectedStock?: Stock;
  onSelectStock: (stock: Stock) => void;
  maxQty?: number;
  onSelectColor: (value: ExtraValueType) => void;
  interval?: number;
  onScrolled: (value: boolean) => void;
}

const ProductStock = ({
  stocks,
  fullPage,
  minQty = 1,
  selectedStock,
  onSelectStock,
  maxQty,
  onSelectColor,
  interval,
  onScrolled,
}: ProductStockProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const groupedExtras = useMemo(() => groupExtras(stocks, selectedStock), [stocks, selectedStock]);
  // const user = useUserStore((state) => state.user);
  const cartList = useCartStore((state) => state.list);
  const cartDetailId = cartList.find(
    (cartItem) => cartItem.stockId === selectedStock?.id
  )?.cartDetailId;
  const {
    handleAddToCart,
    handleIncrement,
    handleDecrement,
    cartQuantity,
    isCounterLoading,
    handleBuyNow,
  } = useCart({
    stockId: selectedStock?.id,
    minQty,
    maxQty,
    productQty: selectedStock?.quantity,
    image: selectedStock?.galleries?.[0]?.path,
    cartDetailId,
  });
  const targetRef = useElementPosition((value) => onScrolled(value));

  return (
    <>
      <div className="flex flex-col gap-5 mt-5">
        {groupedExtras.map((groupedExtra) => (
          <div
            key={groupedExtra.group.id}
            className={clsx(
              "bg-white dark:bg-transparent rounded-2xl py-4 px-3",
              fullPage && "border border-gray-border dark:border-gray-inputBorder"
            )}
          >
            <span className="font-semibold text-lg">{groupedExtra.group.translation?.title}</span>
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {groupedExtra.values.map((extraValue) => (
                <ExtraValue
                  onClick={() => {
                    onSelectStock(extraValue.stock);
                    if (extraValue.stock.galleries && groupedExtra.group.type === "color")
                      onSelectColor(extraValue.data);
                  }}
                  data={extraValue.data}
                  key={extraValue.data?.id}
                  group={groupedExtra.group.type}
                  selected={selectedStock?.extras.some(
                    (selectedExtras) => selectedExtras.extra_value_id === extraValue.data?.id
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div ref={targetRef}>
        {cartQuantity && cartQuantity > 0 ? (
          <div className="flex items-center gap-4 mt-6">
            <Button className="flex-shrink" as={Link} href="/cart" color="black">
              {t("go.to.cart")}
            </Button>
            <div className="flex items-center justify-between flex-1 border border-dark dark:border-white rounded-2xl overflow-hidden min-w-fit">
              <IconButton
                // disabled={user ? !cartDetailId : false}
                onClick={() => handleDecrement()}
                size="xlarge"
                color="transparentWithHover"
              >
                <MinusIcon />
              </IconButton>
              <span className="text-lg font-medium">{unitify(cartQuantity, interval)}</span>
              <IconButton
                onClick={() => handleIncrement()}
                size="xlarge"
                color="transparentWithHover"
              >
                <PlusIcon />
              </IconButton>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 mt-6">
            <Button
              loading={isCounterLoading}
              fullWidth
              onClick={() => {
                handleBuyNow(() => router.push("/cart"));
              }}
              color="primary"
              disabled={
                (selectedStock && selectedStock.quantity < minQty) || !selectedStock?.quantity
              }
            >
              {t("buy.now")}
            </Button>
            <Button
              disabled={
                isCounterLoading ||
                (selectedStock && selectedStock.quantity < minQty) ||
                !selectedStock?.quantity
              }
              onClick={() => handleAddToCart()}
              fullWidth
              color="black"
            >
              {t("add.to.cart")}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductStock;
