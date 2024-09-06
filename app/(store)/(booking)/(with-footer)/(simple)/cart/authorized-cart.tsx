"use client";

import React, { useState, useTransition } from "react";
import { useServerCart } from "@/hook/use-server-cart";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import { cartService } from "@/services/cart";
import useSettingsStore from "@/global-store/settings";
import { Price } from "@/components/price";
import dynamic from "next/dynamic";
import useCartStore from "@/global-store/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartCalculateBody } from "@/types/cart";
import { LoadingCard } from "@/components/loading";
import { CartTotal } from "@/components/cart-total";
import { useRouter } from "next/navigation";
import useAddressStore from "@/global-store/address";
import TrashIcon from "@/assets/icons/trash";
import { useModal } from "@/hook/use-modal";
import { ConfirmModal } from "@/components/confirm-modal";
import NetworkError from "@/utils/network-error";
import { error, warning } from "@/components/alert";
import useUserStore from "@/global-store/user";
import { BackButton } from "@/components/back-button";
import { useSettings } from "@/hook/use-settings";
import Wallet3LineIcon from "remixicon-react/Wallet3LineIcon";
import { Drawer } from "@/components/drawer";
import { OrderCreateBody } from "@/types/order";
import dayjs from "dayjs";
import { internalPayments } from "@/config/global";
import { orderService } from "@/services/order";
import { useExternalPayment } from "@/hook/use-external-payment";
import { Types } from "@/context/checkout/checkout.reducer";
import { useCheckout } from "@/context/checkout/checkout.context";
import { UserCartItem } from "./components/user-cart-item";
import { CartItem } from "./components/cart-item";
import CheckoutShipping from "./components/shipping";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

const PaymentList = dynamic(() => import("./components/payment"), {
  loading: () => <LoadingCard />,
});

const AuthorizedCart = () => {
  const router = useRouter();
  const { data, error: cartError, isLoading } = useServerCart(true);
  const { currency, language, settings } = useSettings();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const clearCart = useCartStore((state) => state.clear);
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const [isOrderCreateSuccess, setIsOrderCreateSuccess] = useState(false);
  const [isOrderPermissionModalOpen, openPermissionModal, closePermissionModal] = useModal();
  const { dispatch, state: checkoutState } = useCheckout();
  const defaultCurrency = useSettingsStore((state) => state.defaultCurrency);
  const [isClearModalOpen, openClearModal, closeClearModal] = useModal();
  const [isPaymentDrawerOpen, openPaymentDrawer, closePaymentDrawer] = useModal();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const cartDetailsLength = data?.data.user_carts.flatMap((userCart) =>
    userCart.cartDetails.flatMap((detail) => detail.cartDetailProducts)
  ).length;
  const userCart = data?.data?.user_carts?.find(
    (userCartItem) => userCartItem.user_id === user?.id
  );

  const { mutate: createOrder, isLoading: isOrderCreateLoading } = useMutation({
    mutationFn: (body: OrderCreateBody) => orderService.create(body),
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });
  const { mutate: externalPay, isLoading: isExternalPayLoading } = useExternalPayment();

  const isEveryItemDigital = userCart?.cartDetails
    .flatMap((detail) => detail.cartDetailProducts)
    .every((product) => product.stock.product.digital);

  const {
    data: cartTotal,
    isFetching: isCalculating,
    isError,
  } = useQuery({
    queryKey: [
      "calculate",
      currency?.id,
      language?.locale,
      userCart?.cartDetails,
      checkoutState,
      isEveryItemDigital,
      country?.id,
      city?.id,
    ],
    queryFn: () => {
      const body: CartCalculateBody = {
        currency_id: currency?.id,
        country_id: country?.id,
        city_id: city?.id,
        lang: language?.locale,
      };
      if (
        !isEveryItemDigital &&
        checkoutState.deliveryType === "delivery" &&
        !!checkoutState.deliveryPrice
      ) {
        body.delivery_price_id = checkoutState.deliveryPrice?.id;
        body.delivery_type = checkoutState.deliveryType;
      }
      if (!isEveryItemDigital && checkoutState.deliveryType === "point") {
        body.delivery_point_id = checkoutState.deliveryPoint?.id;
        body.delivery_type = checkoutState.deliveryType;
      }
      if (isEveryItemDigital) {
        body.delivery_type = "digital";
      }
      if (
        Object.values(checkoutState.coupons).filter((coupon) => typeof coupon !== "undefined")
          .length !== 0
      ) {
        body.coupon = checkoutState.coupons;
      }
      return cartService.calculate(data?.data?.id, body);
    },
    enabled:
      !!userCart && (checkoutState.deliveryType === "point" ? !!checkoutState.deliveryPoint : true),
    staleTime: Infinity,
    keepPreviousData: true,
    retry: false,
  });

  const { mutate: clearAll, isLoading: isClearing } = useMutation({
    mutationFn: () => cartService.clearAll(),
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"], { exact: false });
      queryClient.setQueriesData({ queryKey: ["cart"], exact: false }, () => undefined);
    },
    onSettled: () => {
      closeClearModal();
    },
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });

  const { data: payments, isLoading: isPaymentsLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: () => orderService.paymentList(),
    onSuccess: (paymentsData) => {
      const defaultPayment = paymentsData?.data?.find((payment) => payment?.tag === "cash");
      if (defaultPayment) {
        dispatch({ type: Types.UpdatePaymentMethod, payload: { paymentMethod: defaultPayment } });
      }
    },
  });

  const handleClearCart = () => {
    clearAll();
  };

  const handleOrderCreateSuccess = (orderId: number) => {
    router.push(`/orders/${orderId}`, { scroll: false });
    setIsOrderCreateSuccess(true);
    clearCart();
  };

  const handleCreateOrder = async () => {
    const body: OrderCreateBody = {
      delivery_date: dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
      currency_id: currency?.id,
      rate: currency?.rate,
      cart_id: data?.data?.id,
      delivery_type: isEveryItemDigital ? "digital" : checkoutState.deliveryType,
      notes:
        Object.keys(checkoutState.notes).length !== 0 ||
        Object.keys(checkoutState.shopNotes).length !== 0
          ? {
              product:
                Object.keys(checkoutState.notes).length !== 0 ? checkoutState.notes : undefined,
              order:
                Object.keys(checkoutState.shopNotes).length !== 0
                  ? checkoutState.shopNotes
                  : undefined,
            }
          : undefined,
    };
    if (!isEveryItemDigital && checkoutState.deliveryType === "point") {
      body.delivery_point_id = checkoutState.deliveryPoint?.id;
    }
    if (!isEveryItemDigital && checkoutState.deliveryType === "delivery") {
      body.delivery_price_id = checkoutState.deliveryPrice?.id;
      body.address_id = checkoutState.deliveryAddress?.id;
    }

    const tempCoupons = { ...checkoutState.coupons };

    Object.entries(checkoutState.coupons).forEach(([key, coupon]) => {
      if (typeof coupon === "undefined") {
        delete tempCoupons[Number(key)];
      }
    });

    if (Object.keys(tempCoupons).length !== 0) {
      body.coupon = tempCoupons;
      body.coupon = tempCoupons;
    }

    if (internalPayments.includes(checkoutState.paymentMethod?.tag || "")) {
      body.payment_id = checkoutState.paymentMethod?.id;
    }

    if (!internalPayments.includes(checkoutState.paymentMethod?.tag || "")) {
      externalPay(
        {
          tag: checkoutState.paymentMethod?.tag,
          data: body,
        },
        {
          onSuccess: async () => {
            dispatch({ type: Types.ClearState, payload: { all: true } });
            await queryClient.invalidateQueries(["profile"], { exact: false });
            await queryClient.invalidateQueries(["cart"], { exact: false });
          },
        }
      );
      return;
    }

    createOrder(body, {
      onSuccess: async (res) => {
        dispatch({ type: Types.ClearState, payload: { all: true } });
        await queryClient.invalidateQueries(["profile"], { exact: false });
        await queryClient.invalidateQueries(["cart"], { exact: false });
        const parentOrder = res.data.find(
          (orderDetail) => typeof orderDetail.parent_id === "undefined"
        );

        if (parentOrder) {
          handleOrderCreateSuccess(parentOrder.id);
        }
        dispatch({ type: Types.ClearState, payload: { all: false } });
      },
    });
  };

  const handleGoToCheckout = () => {
    if (
      settings?.min_amount &&
      cartTotal?.data &&
      Number(settings?.min_amount) > cartTotal.data.price
    ) {
      warning(
        <span>
          {t("order.price.did.not.reach.the.min.amount.min.amount.is")}{" "}
          <Price number={Number(settings?.min_amount)} customCurrency={defaultCurrency} />
        </span>
      );
      return;
    }
    const members = data?.data.user_carts.filter((item) => item.user_id !== data?.data.owner_id);
    const isMemberActive = members?.some((item) => item.status);
    if (isMemberActive) {
      openPermissionModal();
      return;
    }
    startTransition(() => handleCreateOrder());
  };

  if (isOrderCreateSuccess) {
    return (
      <section className="xl:container px-4">
        <BackButton title="order.detail" />
        <div className="flex items-center justify-center flex-col my-20">
          <Image src="/img/order-success.png" alt="empty_cart" width={300} height={400} />
          <strong className="text-xl font-bold">{t("congrats")}</strong>
          <span className="text-lg font-medium text-center ">{t("order.success.message")}</span>
        </div>
      </section>
    );
  }
  if (isLoading && isPaymentsLoading) {
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
  if ((!userCart && !cartDetailsLength) || cartError || cartDetailsLength === 0) {
    return (
      <section className="xl:container px-4">
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
        <div className="flex flex-col lg:col-span-4 col-span-7 gap-5 ">
          <div className="border border-gray-link rounded-button md:p-10 p-2">
            <CheckoutShipping />
          </div>
          <div className="flex flex-col gap-7 md:border border-gray-link md:rounded-button md:p-10">
            {data?.data.group
              ? data?.data.user_carts?.map((userCartItem) => (
                  <UserCartItem
                    ownerId={data?.data.owner_id}
                    key={userCartItem.id}
                    data={userCartItem}
                  />
                ))
              : userCart?.cartDetails.map((detail) => (
                  <CartItem
                    key={detail.id}
                    data={detail}
                    disabled={isCalculating}
                    cartUuid={userCart.uuid}
                    userId={data?.data.owner_id}
                    showCoupon
                  />
                ))}
            {!!cartTotal?.data?.errors?.length && (
              <div className="flex flex-col gap-y-3">
                {cartTotal?.data?.errors?.map((item) => (
                  <span className="text-sm text-red">{item?.message}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-3 col-span-7">
          <div className="sticky top-2">
            <div className="md:border border-gray-link rounded-button md:p-10">
              <strong className="text-head font-semibold">{t("payment")}</strong>
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-4">
                  <Wallet3LineIcon />
                  <span className="text-base font-medium">
                    {checkoutState.paymentMethod
                      ? t(checkoutState.paymentMethod.tag)
                      : t("add.payment.method")}
                  </span>
                </div>
                <Button size="xsmall" color="gray" onClick={openPaymentDrawer}>
                  {t("edit")}
                </Button>
              </div>
              <CartTotal totals={cartTotal?.data} couponStyle={false} />
              <Button
                className="md:mt-10 mt-4"
                loading={isPending || isCalculating || isOrderCreateLoading || isExternalPayLoading}
                fullWidth
                color="black"
                disabled={
                  isError ||
                  !checkoutState.paymentMethod ||
                  (checkoutState.deliveryType === "point"
                    ? !checkoutState.deliveryType
                    : !checkoutState.deliveryPrice)
                }
                onClick={handleGoToCheckout}
              >
                {t("checkout")}
                {" - "}
                <Price number={cartTotal?.data?.total_price} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Drawer
        position="right"
        open={isPaymentDrawerOpen}
        onClose={closePaymentDrawer}
        container={false}
      >
        <PaymentList
          onSelect={closePaymentDrawer}
          payments={payments}
          isLoading={isPaymentsLoading}
        />
      </Drawer>
      <ConfirmModal
        text="are.you.sure.want.to.clear.all.items.in.the.cart"
        onConfirm={handleClearCart}
        onCancel={closeClearModal}
        isOpen={isClearModalOpen}
        loading={isClearing}
      />
      <ConfirmModal
        text="group.order.permission"
        onConfirm={() => startTransition(() => handleGoToCheckout())}
        onCancel={closePermissionModal}
        isOpen={isOrderPermissionModalOpen}
      />
    </section>
  );
};

export default AuthorizedCart;
