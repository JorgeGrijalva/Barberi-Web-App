import { Cart, CartCalculateRes, CartDetail } from "@/types/cart";
import React from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import TruckLineIcon from "remixicon-react/TruckLineIcon";
import { Price } from "@/components/price";
import { TextArea } from "@/components/text-area";
import { useModal } from "@/hook/use-modal";
import { ConfirmModal } from "@/components/confirm-modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cart";
import { DefaultResponse } from "@/types/global";
import NetworkError from "@/utils/network-error";
import { error } from "@/components/alert";
import { IconButton } from "@/components/icon-button";
import CrossIcon from "@/assets/icons/cross";
import { CheckoutProduct } from "@/components/checkout-product";
import { ExpandableShop } from "@/components/expandable-shop";
import { Types } from "@/context/checkout/checkout.reducer";
import { useCheckout } from "@/context/checkout/checkout.context";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

interface CheckoutProductGroupProps {
  data: CartDetail;
  calcResult?: CartCalculateRes;
}

export const CheckoutProductGroup = ({ data, calcResult }: CheckoutProductGroupProps) => {
  const [isClearModalOpen, openClearModal, closeClearModal] = useModal();
  const queryClient = useQueryClient();
  const { dispatch } = useCheckout();
  const { t } = useTranslation();
  const deliveryFee =
    typeof calcResult?.delivery_fee === "object"
      ? calcResult?.delivery_fee?.find((fee) => fee.shop_id === data.shop_id)?.price
      : calcResult?.delivery_fee;
  const calculateError = calcResult?.errors?.find(
    (errorResult) => errorResult.shop_id === data.shop_id
  );
  const { mutate: deleteProductsFromServerCart, isLoading: isDeleting } = useMutation({
    mutationFn: (body: Record<string, number>) => cartService.delete(body),
    onSuccess: () => {
      closeClearModal();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["cart"], exact: false });
      await queryClient.cancelQueries({ queryKey: ["calculate"], exact: false });
      const prevCart = queryClient.getQueryData<DefaultResponse<Cart>>(["cart"], { exact: false });

      queryClient.setQueriesData<DefaultResponse<Cart> | undefined>(
        { queryKey: ["cart"], exact: false },
        (old) => {
          if (!old) {
            return prevCart;
          }
          return {
            ...old,
            data: {
              ...old.data,
              user_carts: old.data.user_carts.map((userCart) => ({
                ...userCart,
                cartDetails: userCart.cartDetails.filter((detail) => detail.id !== data.id),
              })),
            },
          };
        }
      );
      return { prevCart };
    },
    onError: (err: NetworkError, newTodo, context) => {
      queryClient.setQueriesData({ queryKey: ["cart"], exact: false }, context?.prevCart);
      error(err.message);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cart"], exact: false });
      await queryClient.invalidateQueries({ queryKey: ["calculate"], exact: false });
    },
  });
  const handleDeleteShopProducts = () => {
    const reqBody = Object.assign(
      {},
      ...data.cartDetailProducts.map((product, i) => ({ [`ids[${i}]`]: product.id }))
    );
    deleteProductsFromServerCart(reqBody);
  };
  return (
    <ExpandableShop
      extra={
        <IconButton
          size="small"
          rounded={false}
          onClick={(e) => {
            e.stopPropagation();
            openClearModal();
          }}
          color="transparentWithHover"
        >
          <CrossIcon />
        </IconButton>
      }
      shop={data.shop}
      defaultOpen={data.cartDetailProducts.length !== 0}
      showEstimatedTime
    >
      <div className="flex flex-col lg:col-span-5 col-span-7 gap-7 ">
        {data.cartDetailProducts?.length === 0 ? (
          <Empty animated={false} />
        ) : (
          data.cartDetailProducts?.map((product) => (
            <CheckoutProduct key={product.id} data={product} />
          ))
        )}
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {!calculateError && (
          <TextArea
            rows={3}
            placeholder={t("note")}
            onChange={(e) => {
              dispatch({
                type: Types.UpdateShopNote,
                payload: { shopId: data.shop_id, note: e.target.value },
              });
            }}
          />
        )}
        {!!calculateError && (
          <div>
            <span className="text-sm text-red">{calculateError.message}</span>
          </div>
        )}
        {!!deliveryFee && (
          <div className="rounded-xl py-4 px-2 bg-white dark:bg-gray-inputBorder flex items-center gap-2">
            <div className="rounded-full p-3 bg-dark dark:bg-white dark:text-dark text-white">
              <TruckLineIcon />
            </div>
            <div>
              <div className="text-sm">{t("delivery.fee")}</div>
              <span className="text-sm font-bold">
                <Price number={deliveryFee} />
              </span>
            </div>
          </div>
        )}
      </div>
      <ConfirmModal
        text="are.you.sure.want.to.clear"
        onConfirm={handleDeleteShopProducts}
        onCancel={closeClearModal}
        isOpen={isClearModalOpen}
        loading={isDeleting}
        confirmText="clear"
      />
    </ExpandableShop>
  );
};
