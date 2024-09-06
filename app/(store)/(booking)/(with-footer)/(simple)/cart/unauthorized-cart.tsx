"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import { cartService } from "@/services/cart";
import { Price } from "@/components/price";
import useCartStore from "@/global-store/cart";
import { useQuery } from "@tanstack/react-query";
import { CartTotal } from "@/components/cart-total";
import LoadingIcon from "@/assets/icons/loading-icon";
import useAddressStore from "@/global-store/address";
import TrashIcon from "@/assets/icons/trash";
import { useModal } from "@/hook/use-modal";
import { ConfirmModal } from "@/components/confirm-modal";
import { ParamsType } from "@/types/global";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BackButton } from "@/components/back-button";
import { useSettings } from "@/hook/use-settings";
import { CartItem } from "./components/cart-item/unauthorized";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

const UnAuthorizedCart = () => {
  const { currency, language } = useSettings();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const clearCart = useCartStore((state) => state.clear);
  const cartList = useCartStore((state) => state.list);
  const { t } = useTranslation();
  const [isClearModalOpen, openClearModal, closeClearModal] = useModal();

  const {
    data: cartTotal,
    isFetching: isCalculating,
    error: cartError,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["calculate", currency?.id, cartList, country?.id, city?.id, language?.locale],
    queryFn: () => {
      const body: ParamsType = {
        currency_id: currency?.id,
        country_id: country?.id,
        city_id: city?.id,
        products: cartList.map((cartProduct) => ({
          stock_id: cartProduct.stockId,
          quantity: cartProduct.quantity,
          image: cartProduct.image,
        })),
        lang: language?.locale,
      };
      return cartService.restCalculate(body);
    },
    enabled: !!currency,
    staleTime: Infinity,
    keepPreviousData: true,
    retry: false,
  });

  if (isLoading) {
    return (
      <section className="xl:container px-4">
        <div className="grid grid-cols-7">
          <div className="flex flex-col gap-7 col-span-5">
            <div className="flex gap-7 animate-pulse">
              <div className="relative overflow-hidden lg:h-[320px] md:h-56 h-40 rounded-3xl aspect-[250/320] bg-gray-300" />
              <div className="flex-1 my-5">
                <div className="h-[22px] rounded-full w-full bg-gray-300 line-clamp-1" />
                <div className="h-4 mt-5 rounded-full bg-gray-300 w-4/5" />
                <div className="h-4 mt-4 rounded-full bg-gray-300 w-3/5" />
              </div>
            </div>
            <div className="flex gap-7 animate-pulse">
              <div className="relative overflow-hidden lg:h-[320px] md:h-56 h-40 rounded-3xl aspect-[250/320] bg-gray-300" />
              <div className="flex-1 my-5">
                <div className="h-[22px] rounded-full w-full bg-gray-300 line-clamp-1" />
                <div className="h-4 mt-5 rounded-full bg-gray-300 w-4/5" />
                <div className="h-4 mt-4 rounded-full bg-gray-300 w-3/5" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (cartError || cartList.length === 0 || cartTotal?.data.shops.length === 0) {
    return (
      <section className="xl:container px-2 md:px-4">
        <BackButton title="order.detail" />
        <Empty animated={false} text="your.cart.is.empty" imagePath="/img/empty_cart.png" />
      </section>
    );
  }

  return (
    <section className="xl:container px-4 mb-4">
      <div className="flex items-center justify-between">
        <BackButton title="order.detail" />
        <button onClick={openClearModal} className="flex items-center gap-2.5 text-red-600">
          <TrashIcon />
          {t("clear.all")}
        </button>
      </div>
      <div className="grid grid-cols-7 mt-7 gap-7 relative pb-24">
        {isCalculating && (
          <div className="absolute left-0 w-full h-full min-h-60 bg-white dark:bg-dark dark:bg-opacity-10 bg-opacity-30 flex items-center justify-center z-10">
            <LoadingIcon size={80} />
          </div>
        )}
        <div className="flex flex-col lg:col-span-5 col-span-7 gap-7 ">
          {cartTotal?.data.shops.map((shop) => (
            <CartItem data={shop} key={shop.shop?.id} loading={isCalculating} />
          ))}
        </div>
        <div className="lg:col-span-2 col-span-7">
          <div className="sticky top-2">
            <CartTotal totals={cartTotal?.data} showTotalTax />
            <Button
              loading={isCalculating}
              fullWidth
              disabled={isError}
              as={Link}
              href="/login?redirect=/cart"
            >
              {t("go.to.checkout")}
              {" - "}
              <Price number={cartTotal?.data?.total_price} />
            </Button>
          </div>
        </div>
      </div>
      <ConfirmModal
        text="are.you.sure.want.to.clear.all.items.in.the.cart"
        onConfirm={() => clearCart()}
        onCancel={closeClearModal}
        isOpen={isClearModalOpen}
      />
    </section>
  );
};

export default UnAuthorizedCart;
