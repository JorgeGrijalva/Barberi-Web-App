import React from "react";
import clsx from "clsx";
import { ProductFull, Stock } from "@/types/product";
import { ImageWithFallBack } from "@/components/image";
import { useCart } from "@/hook/use-cart";
import { IconButton } from "@/components/icon-button";
import MinusIcon from "@/assets/icons/minus";
import { unitify } from "@/utils/unitify";
import PlusIcon from "@/assets/icons/plus";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useLike } from "@/hook/use-like";
import useCompareStore from "@/global-store/compare";
import HeartFillIcon from "@/assets/icons/heart-fill";
import HeartIcon from "@/assets/icons/heart";
import CompareIcon from "@/assets/icons/compare";
import Link from "next/link";
import useUserStore from "@/global-store/user";
import useCartStore from "@/global-store/cart";

interface ProductStickyInfoProps {
  data?: ProductFull;
  selectedStock?: Stock;
}

export const ProductStickyInfo = ({ data, selectedStock }: ProductStickyInfoProps) => {
  const user = useUserStore((state) => state.user);
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
    minQty: data?.min_qty,
    maxQty: data?.max_qty,
    productQty: selectedStock?.quantity,
    image: selectedStock?.galleries?.[0]?.path,
    cartDetailId,
  });
  const { t } = useTranslation();
  const { isLiked, handleLikeDisLike } = useLike("product", data?.id);
  const router = useRouter();
  const addToOrRemoveFromCompareList = useCompareStore((state) => state.addOrRemove);
  const compareList = useCompareStore((state) => state.ids);
  const isInCompareList = compareList.includes(data?.id || 0);
  const handleAddOrRemoveFromCompareList = () => {
    if (data?.id) {
      addToOrRemoveFromCompareList(data.id);
    }
  };
  return (
    <div
      className={clsx(
        "fixed block top-0 md:bottom-auto w-full rounded-t-md md:rounded-t-none",
        "z-10 bg-white dark:bg-darkBg border-b border-gray-border dark:border-gray-inputBorder bg-opacity-30 backdrop-blur-md dark:bg-opacity-20"
      )}
    >
      <div className="px-2 py-4 sm:py-2">
        <div className="flex items-center gap-4 xl:container px-2 md:px-4 justify-between ">
          <div className="items-center gap-2 hidden sm:flex">
            <ImageWithFallBack
              src={data?.img || ""}
              alt={data?.translation?.title || "product"}
              width={60}
              height={60}
              className="max-h-[60px] w-auto"
            />
            <span className="text-sm font-medium">{data?.translation?.title}</span>
          </div>
          <div className="flex items-center gap-4 justify-between sm:justify-normal w-full sm:w-auto">
            {cartQuantity && cartQuantity > 0 ? (
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-normal">
                <Button color="primary" size="small" as={Link} href="/cart">
                  {t("go.to.cart")}
                </Button>
                <div className="flex items-center gap-4">
                  <IconButton
                    disabled={data && user ? !cartDetailId : false}
                    onClick={() => handleDecrement()}
                    size="large"
                    color="black"
                  >
                    <MinusIcon />
                  </IconButton>
                  <span className="text-lg font-medium">
                    {unitify(cartQuantity, data?.interval)}
                  </span>

                  <IconButton onClick={() => handleIncrement()} size="large" color="black">
                    <PlusIcon />
                  </IconButton>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-5 md:gap-2.5 w-full sm:w-auto">
                <Button
                  loading={isCounterLoading}
                  fullWidth
                  onClick={() => {
                    handleBuyNow(() => router.push("/cart"));
                  }}
                  color="primary"
                  size="small"
                  disabled={
                    (selectedStock && data && selectedStock.quantity < data?.min_qty) ||
                    !selectedStock?.quantity
                  }
                >
                  {t("buy.now")}
                </Button>
                <Button
                  disabled={
                    isCounterLoading ||
                    (selectedStock && data && selectedStock.quantity < data?.min_qty) ||
                    !selectedStock?.quantity
                  }
                  onClick={() => handleAddToCart()}
                  fullWidth
                  size="small"
                  color="black"
                >
                  {t("add.to.cart")}
                </Button>
              </div>
            )}
            <div className="items-center gap-2 hidden md:flex">
              <IconButton onClick={() => handleLikeDisLike()} color="lightGray" size="medium">
                {isLiked ? <HeartFillIcon size={24} /> : <HeartIcon size={24} />}
              </IconButton>
              <IconButton
                onClick={() => handleAddOrRemoveFromCompareList()}
                color="lightGray"
                size="medium"
              >
                {isInCompareList ? (
                  <span className="text-primary">
                    <CompareIcon size={24} />
                  </span>
                ) : (
                  <CompareIcon size={24} />
                )}
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
