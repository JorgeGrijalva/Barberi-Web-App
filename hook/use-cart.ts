"use client";

import useCartStore from "@/global-store/cart";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "@/hook/use-debounce";
import { cartService } from "@/services/cart";
import useAddressStore from "@/global-store/address";
import { error } from "@/components/alert";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Cart, InsertCartPayload } from "@/types/cart";
import { DefaultResponse } from "@/types/global";
import NetworkError from "@/utils/network-error";
import useUserStore from "@/global-store/user";
import { useRouter } from "next/navigation";
import { extractProductsFromCart } from "@/utils/extract-products-from-cart";
import { useSettings } from "@/hook/use-settings";

interface CartOptions {
  stockId: number;
  minQty: number;
  maxQty: number;
  onCounterClick: () => void;
  productQty: number;
  cartDetailId?: number;
  image?: string;
}

export const useCart = ({
  stockId,
  minQty = 1,
  maxQty = 1,
  onCounterClick,
  productQty = 0,
  cartDetailId,
  image,
}: Partial<CartOptions>) => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const localCartList = useCartStore((state) => state.list);
  const [isSent, setIsSent] = useState(false);
  const addToCartLocal = useCartStore((state) => state.addProduct);
  const incrementCartLocal = useCartStore((state) => state.increment);
  const decrementCartLocal = useCartStore((state) => state.decrement);
  const clearCartLocal = useCartStore((state) => state.clear);
  const updateCartLocal = useCartStore((state) => state.updateList);
  const deleteCartLocal = useCartStore((state) => state.delete);
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const memberCartId = useCartStore((state) => state.memberCartId);
  const userCartUuid = useCartStore((state) => state.userCartUuid);
  const router = useRouter();
  const { currency } = useSettings();
  const isMemberOfAnotherCart = !!memberCartId && !!userCartUuid;
  const { mutate: insertProductToServerCart, isLoading: isInserting } = useMutation({
    mutationFn: (data: InsertCartPayload) => cartService.insert(data),
    onError: (err: NetworkError) => error(err.message),
    onSuccess: (res) => {
      queryClient.setQueriesData<DefaultResponse<Cart> | undefined>(
        { queryKey: ["cart"], exact: false },
        () => res
      );
      const products = extractProductsFromCart(res.data, user?.id);
      updateCartLocal(products);
    },
  });
  const { mutate: insertProductToMemberCart, isLoading: isInsertingToMemberCart } = useMutation({
    mutationFn: (data: InsertCartPayload) => cartService.insertGuest(data),
    onError: (err: NetworkError) => error(err.message),
    onSuccess: (res) => {
      queryClient.setQueriesData<DefaultResponse<Cart> | undefined>(
        { queryKey: ["cart"], exact: false },
        () => res
      );
      const products = extractProductsFromCart(res.data, userCartUuid);
      updateCartLocal(products);
    },
  });
  const { mutate: deleteProductsFromServerCart, isLoading: isDeleting } = useMutation({
    mutationFn: (data: Record<string, number>) => cartService.delete(data),
    onSuccess: onCounterClick,
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
                cartDetails: userCart.cartDetails.map((detial) => ({
                  ...detial,
                  cartDetailProducts: detial.cartDetailProducts.filter(
                    (product) => product.id !== cartDetailId
                  ),
                })),
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
  const { mutate: deleteProductsFromMemberCartCart, isLoading: isDeletingMemberCartItem } =
    useMutation({
      mutationFn: (data: { cart_id: number; ids: number[] }) =>
        cartService.deleteGuestProducts(data),
      onSuccess: onCounterClick,
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ["cart"], exact: false });
        const prevCart = queryClient.getQueryData<DefaultResponse<Cart>>(["cart"], {
          exact: false,
        });

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
                  cartDetails: userCart.cartDetails.map((detial) => ({
                    ...detial,
                    cartDetailProducts: detial.cartDetailProducts.filter(
                      (product) => product.id !== cartDetailId
                    ),
                  })),
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
      },
    });
  const stockInLocalCart = localCartList?.find(
    (localCartProduct) => localCartProduct.stockId === stockId
  );
  const debouncedQuantity = useDebounce(stockInLocalCart?.quantity);

  const handleIncrement = useCallback(
    (quantity = 1) => {
      if (stockId) {
        if (
          stockInLocalCart &&
          stockInLocalCart.quantity < maxQty &&
          stockInLocalCart.quantity < productQty
        ) {
          if (user || isMemberOfAnotherCart) {
            setIsSent(true);
          }
          incrementCartLocal(stockId, quantity);
        } else {
          error(`${t("you.cannot.add.more.than")} ${maxQty} ${t("products")}`);
        }
      }
    },
    [stockId, stockInLocalCart?.quantity, incrementCartLocal, maxQty, productQty]
  );

  const handleAddToCart = useCallback(() => {
    if (stockId) {
      if (stockInLocalCart) {
        handleIncrement();
        return;
      }
      if (user || isMemberOfAnotherCart) {
        setIsSent(true);
      }

      addToCartLocal(stockId, minQty || 1, image);
    }
  }, [stockId, stockInLocalCart]);

  const handleDelete = useCallback(async () => {
    if (stockId) {
      deleteCartLocal(stockId);

      if (cartDetailId && user) {
        deleteProductsFromServerCart({ "ids[0]": cartDetailId });
        return;
      }
      if (cartDetailId && isMemberOfAnotherCart) {
        deleteProductsFromMemberCartCart({ ids: [cartDetailId], cart_id: memberCartId });
      }
    }
  }, [stockId, cartDetailId]);

  const handleDecrement = useCallback(() => {
    if (stockId) {
      if (stockInLocalCart && stockInLocalCart.quantity > minQty) {
        if (user || isMemberOfAnotherCart) {
          setIsSent(true);
        }
        decrementCartLocal(stockId);
        return;
      }
      handleDelete();
    }
  }, [stockId, stockInLocalCart, cartDetailId]);
  const handleClearCart = useCallback(() => {
    clearCartLocal();
  }, []);

  const handleUpdateCart = useCallback(
    (
      products: {
        stockId: number;
        quantity: number;
        image?: string;
        cartDetailId?: number;
      }[]
    ) => {
      updateCartLocal(products);
    },
    []
  );

  const handleBuyNow = useCallback(
    (callback: () => void) => {
      if (currency && country && stockId) {
        const body: InsertCartPayload = {
          currency_id: currency.id,
          rate: currency.rate,
          products: [{ stock_id: stockId, quantity: !minQty ? 1 : minQty }],
          region_id: country?.region_id,
          country_id: country?.id,
          city_id: city?.id,
        };
        if (image) {
          body.products[0].images = [image];
        }

        if (isMemberOfAnotherCart) {
          body.cart_id = memberCartId;
          body.user_cart_uuid = userCartUuid;
          insertProductToMemberCart(body, {
            onSuccess: async (res) => {
              const products = extractProductsFromCart(res.data, userCartUuid);
              updateCartLocal(products);
              callback();
              queryClient.setQueriesData<DefaultResponse<Cart> | undefined>(
                {
                  queryKey: ["cart"],
                  exact: false,
                },
                () => res
              );
            },
          });
          return;
        }

        if (!user) {
          addToCartLocal(stockId, minQty);
          router.push("/cart");
          return;
        }

        insertProductToServerCart(body, {
          onSuccess: async (res) => {
            const products = extractProductsFromCart(res.data, user?.id);
            updateCartLocal(products);
            callback();
            queryClient.setQueriesData<DefaultResponse<Cart> | undefined>(
              {
                queryKey: ["cart"],
                exact: false,
              },
              () => res
            );
          },
        });
      }
    },
    [stockId]
  );

  useEffect(() => {
    if (debouncedQuantity && stockInLocalCart && currency && isSent && country) {
      const body: InsertCartPayload = {
        currency_id: currency.id,
        rate: currency.rate,
        products: [{ stock_id: stockInLocalCart.stockId, quantity: debouncedQuantity }],
        region_id: country?.region_id,
        country_id: country?.id,
        city_id: city?.id,
      };
      if (image) {
        body.products[0].images = [image];
      }
      if (isMemberOfAnotherCart) {
        body.cart_id = memberCartId;
        body.user_cart_uuid = userCartUuid;
        insertProductToMemberCart(body, {
          onSuccess: async () => {
            if (onCounterClick) {
              onCounterClick();
            }
          },
        });
        return;
      }
      if (user) {
        insertProductToServerCart(body, {
          onSuccess: async () => {
            if (onCounterClick) {
              onCounterClick();
            }
          },
        });
      }
    }
  }, [debouncedQuantity, currency?.id, currency?.rate, country?.id]);

  return {
    handleAddToCart,
    handleDecrement,
    handleIncrement,
    handleClearCart,
    handleUpdateCart,
    handleDelete,
    cartQuantity: stockInLocalCart?.quantity,
    isCounterLoading:
      isInserting || isDeleting || isInsertingToMemberCart || isDeletingMemberCartItem,
    handleBuyNow,
  };
};
