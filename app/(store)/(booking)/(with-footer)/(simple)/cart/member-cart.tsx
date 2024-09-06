"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import { cartService } from "@/services/cart";
import dynamic from "next/dynamic";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartTotal } from "@/components/cart-total";
import TrashIcon from "@/assets/icons/trash";
import { useModal } from "@/hook/use-modal";
import { ConfirmModal } from "@/components/confirm-modal";
import NetworkError from "@/utils/network-error";
import { error } from "@/components/alert";
import { useMemberCart } from "@/hook/use-member-cart";
import useCartStore from "@/global-store/cart";
import { DefaultResponse } from "@/types/global";
import { Cart } from "@/types/cart";
import { BackButton } from "@/components/back-button";
import { UserCartItem } from "./components/user-cart-item";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

const MemberCart = () => {
  const { data, error: cartError, isLoading } = useMemberCart();
  const { t } = useTranslation();
  const [isClearModalOpen, openClearModal, closeClearModal] = useModal();
  const memberCartId = useCartStore((state) => state.memberCartId);
  const userCartUuid = useCartStore((state) => state.userCartUuid);
  const queryClient = useQueryClient();

  const cartDetailsLength = data?.data.user_carts.flatMap((userCart) =>
    userCart.cartDetails.flatMap((detail) => detail.cartDetailProducts)
  ).length;

  const userCart = data?.data.user_carts.find((userCartItem) => userCartItem.uuid === userCartUuid);
  const userProducts = userCart?.cartDetails.flatMap((cartDetail) =>
    cartDetail.cartDetailProducts.map((cartProduct) => cartProduct.id)
  );

  const { mutate: clearAll, isLoading: isClearing } = useMutation({
    mutationFn: (body: { cartId: number; ids: number[] }) =>
      cartService.deleteGuestProducts({
        cart_id: body.cartId,
        ids: body.ids,
      }),
    onMutate: async () => {
      await queryClient.cancelQueries(["cart"], { exact: false });
      const prevCart = queryClient.getQueryData<DefaultResponse<Cart>>(["cart"], { exact: false });

      queryClient.setQueriesData<DefaultResponse<Cart> | undefined>(
        { queryKey: ["cart"], exact: false },
        (old) => {
          if (!old) return prevCart;
          return {
            ...old,
            data: {
              ...old.data,
              user_carts: old.data.user_carts.map((userCartItem) => {
                if (userCartItem.uuid === userCartUuid) {
                  return { ...userCartItem, cartDetails: [] };
                }
                return userCartItem;
              }),
            },
          };
        }
      );

      return { prevCart };
    },
    onError: (err: NetworkError, variables, context) => {
      queryClient.setQueriesData({ queryKey: ["cart"], exact: false }, () => context?.prevCart);
      error(err.message);
    },
    onSettled: async () => {
      closeClearModal();
      await queryClient.invalidateQueries(["cart"], { exact: false });
    },
  });

  const { mutate: changeStatus } = useMutation({
    mutationFn: (body: { cartUuid: string; cartId: number }) =>
      cartService.statusChange(body.cartUuid, { cart_id: body.cartId }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries(["cart"], { exact: false });
      const prevCart = queryClient.getQueryData<DefaultResponse<Cart>>(["cart"], { exact: false });

      queryClient.setQueriesData<DefaultResponse<Cart> | undefined>(
        { queryKey: ["cart"], exact: false },
        (old) => {
          if (!old) return prevCart;
          return {
            ...old,
            data: {
              ...old.data,
              user_carts: old.data.user_carts.map((userCartItem) => {
                if (userCartItem.uuid === variables.cartUuid) {
                  return { ...userCartItem, status: !userCartItem.status };
                }
                return userCartItem;
              }),
            },
          };
        }
      );

      return { prevCart };
    },
    onError: (err: NetworkError, variables, context) => {
      queryClient.setQueriesData({ queryKey: ["cart"], exact: false }, () => context?.prevCart);
      error(err.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(["cart"], { exact: false });
    },
  });

  const handleChangeStatus = () => {
    if (!!memberCartId && !!userCartUuid) {
      changeStatus({ cartId: memberCartId, cartUuid: userCartUuid });
    }
  };

  const handleClearCart = () => {
    if (memberCartId && userProducts && userProducts.length > 0) {
      clearAll({ cartId: memberCartId, ids: userProducts });
    }
  };

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
  if (!cartDetailsLength || cartError || cartDetailsLength === 0) {
    return (
      <section className="xl:container px-4 ">
        <BackButton title="order.detail" />
        <Empty animated={false} text="group.cart.is.empty" imagePath="/img/empty_cart.png" />
      </section>
    );
  }
  return (
    <section className="xl:container px-4  mb-4">
      <div className="flex items-center justify-between">
        <BackButton title="order.detail" />
        {userProducts && userProducts.length > 0 && (
          <button onClick={openClearModal} className="flex items-center gap-2.5 text-red-600">
            <TrashIcon />
            {t("clear.all")}
          </button>
        )}
      </div>
      <div className="grid grid-cols-7 mt-7 gap-7 relative pb-24">
        <div className="flex flex-col lg:col-span-5 col-span-7 gap-5 ">
          {data?.data.user_carts?.map((userCartItem) => (
            <UserCartItem ownerId={data?.data.owner_id} key={userCartItem.id} data={userCartItem} />
          ))}
        </div>
        <div className="lg:col-span-2 col-span-7">
          <div className="sticky top-2">
            <CartTotal totals={{ total_price: data?.data.total_price }} />
            <Button
              color={userCart?.status ? "primary" : "black"}
              fullWidth
              onClick={handleChangeStatus}
            >
              {userCart?.status ? t("done") : t("ready")}
            </Button>
          </div>
        </div>
      </div>
      <ConfirmModal
        text="are.you.sure.want.to.clear.all.items.in.the.cart"
        onConfirm={handleClearCart}
        onCancel={closeClearModal}
        isOpen={isClearModalOpen}
        loading={isClearing}
      />
    </section>
  );
};

export default MemberCart;
