"use client";

import { useRouter } from "next/navigation";
import { Modal } from "@/components/modal";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cart";
import { useServerCart } from "@/hook/use-server-cart";
import { useEffect, useRef, useState } from "react";
import { LoadingCard } from "@/components/loading";
import useAddressStore from "@/global-store/address";
import { IconButton } from "@/components/icon-button";
import FileCopyLineIcon from "remixicon-react/FileCopyLineIcon";
import { error } from "@/components/alert";
import CheckLineIcon from "remixicon-react/CheckLineIcon";
import useUserStore from "@/global-store/user";
import { Button } from "@/components/button";
import { DefaultResponse } from "@/types/global";
import { Cart } from "@/types/cart";
import NetworkError from "@/utils/network-error";
import { useSettings } from "@/hook/use-settings";
import { CartMember } from "@/components/cart-member";

const GroupOrderCreatePage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { currency } = useSettings();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const { data: cart, isError: isCartError, isLoading: isCartLoading } = useServerCart();
  const [isCopied, setIsCopied] = useState(false);
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const openCartRequestSent = useRef(false);
  const { mutate: openCart } = useMutation({
    mutationFn: () =>
      cartService.open({
        currency_id: currency?.id,
        region_id: country?.region_id,
        country_id: country?.id,
        city_id: city?.id,
      }),
    onSuccess: async (res) => {
      queryClient.setQueriesData({ queryKey: ["cart"], exact: false }, () => res);
    },
  });

  const { mutate: setGroup, isLoading: isCartChanging } = useMutation({
    mutationFn: (id?: number) => cartService.setGroup(id),
    onMutate: async () => {
      await queryClient.cancelQueries(["cart"], { exact: false });
      const prevCart = queryClient.getQueryData<DefaultResponse<Cart>>(["cart"], { exact: false });

      queryClient.setQueriesData<DefaultResponse<Cart>>(
        { queryKey: ["cart"], exact: false },
        (old) => {
          if (!old) return prevCart;
          return { ...old, data: { ...old.data, group: !old.data.group } };
        }
      );
      return { prevCart };
    },
    onError: (err, variables, context) => {
      error(t("cant.open.group.order"));
      queryClient.setQueriesData({ queryKey: ["cart"], exact: false }, context?.prevCart);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(["cart"], { exact: false });
    },
  });

  const { mutate: memberDelete, isLoading: isDeletingMember } = useMutation({
    mutationFn: (data: Record<string, string | number | undefined>) =>
      cartService.deleteGuest(data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries(["cart"], { exact: false });
      const prevCart = queryClient.getQueryData<DefaultResponse<Cart>>(["cart"], { exact: false });

      queryClient.setQueriesData<DefaultResponse<Cart>>(
        { queryKey: ["cart"], exact: false },
        (old) => {
          if (!old) return prevCart;
          return {
            ...old,
            data: {
              ...old.data,
              user_carts: old.data.user_carts.filter(
                (userCart) => userCart.uuid !== variables?.["ids[0]"]
              ),
            },
          };
        }
      );
      return { prevCart };
    },
    onError: (err, variables, context) => {
      error(t("cant.open.group.order"));
      queryClient.setQueriesData({ queryKey: ["cart"], exact: false }, context?.prevCart);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(["cart"], { exact: false });
    },
  });

  const { mutate: clearAll, isLoading: isClearing } = useMutation({
    mutationFn: () => cartService.clearAll(),
    onSuccess: async () => {
      openCart();
      await queryClient.cancelQueries(["cart"], { exact: false });
      const prevCart = queryClient.getQueryData<DefaultResponse<Cart>>(["cart"], { exact: false });

      queryClient.setQueriesData<DefaultResponse<Cart>>(
        { queryKey: ["cart"], exact: false },
        (old) => {
          if (!old) return prevCart;
          return { ...old, data: { ...old.data, group: false } };
        }
      );
      return { prevCart };
    },
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });

  const handleDeleteMember = (uuid: string) => {
    const payload = {
      cart_id: cart?.data.id,
      "ids[0]": uuid,
    };
    memberDelete(payload);
  };

  const params = new URLSearchParams();

  if (cart?.data) {
    params.append("cart_id", cart?.data?.id.toString());
  }
  if (country) {
    params.append("country_id", country.id.toString());
    params.append("region_id", country.region_id.toString());
  }
  if (city) {
    params.append("city_id", city.id.toString());
  }
  if (user) {
    params.append("user_id", user?.id.toString());
  }
  const url = `${window.location.href}?${params.toString()}`;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(() => {
        error(t("error.occurred.while.copying"));
      });
  };

  const handleStart = () => {
    setGroup(cart?.data.id);
  };

  const handleStop = () => {
    clearAll();
  };

  useEffect(() => {
    if ((!cart || isCartError) && !openCartRequestSent.current) {
      openCart();
      openCartRequestSent.current = true;
    }
  }, [cart?.data.id, isCartError]);
  return (
    <Modal disableCloseOnOverlayClick withCloseButton isOpen onClose={() => router.back()}>
      <div className="md:px-5 px-2 py-5 relative">
        {(isCartLoading || isDeletingMember) && (
          <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-dark bg-opacity-30 dark:bg-opacity-30">
            <LoadingCard centered />
          </div>
        )}
        <span className="text-2xl font-semibold mb-4">
          {cart?.data.group ? t("manage.group.order") : t("group.order")}
        </span>
        <p className="text-sm text-gray-field my-2">{t("group.order.text")}</p>
        {cart?.data.group ? (
          <>
            <div className="flex items-center justify-between rounded-2xl border border-gray-border my-5 dark:border-gray-inputBorder py-3 px-2 gap-2">
              <span className="text-sm whitespace-nowrap overflow-x-auto no-scrollbar">{url}</span>
              <IconButton onClick={handleCopy}>
                {isCopied ? (
                  <span className="text-green">
                    <CheckLineIcon />
                  </span>
                ) : (
                  <FileCopyLineIcon />
                )}
              </IconButton>
            </div>
            <span className="text-base font-medium">{t("members")}</span>
            <div className="flex flex-col gap-2 my-2">
              {cart?.data && cart.data.owner_id === user?.id && (
                <CartMember name={user.firstname} img={user.img} isMine />
              )}
              {cart?.data.user_carts?.map((userCart) =>
                userCart.user_id !== user?.id ? (
                  <CartMember
                    name={userCart.name}
                    key={userCart.id}
                    onDelete={handleDeleteMember}
                    uuid={userCart.uuid}
                  />
                ) : null
              )}
            </div>
            <div className="mt-4">
              <Button loading={isClearing} onClick={handleStop} color="black" fullWidth>
                {t("cancel")}
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-4">
            <Button onClick={handleStart} loading={isCartChanging} fullWidth>
              {t("start")}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GroupOrderCreatePage;
