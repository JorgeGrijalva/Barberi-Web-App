import { Cart, InsertCartPayload } from "@/types/cart";
import useAddressStore from "@/global-store/address";
import useCartStore from "@/global-store/cart";
import { DefaultResponse, LikeTypes } from "@/types/global";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cart";
import NetworkError from "@/utils/network-error";
import { error } from "@/components/alert";
import { likeService } from "@/services/like";
import useLikeStore from "@/global-store/like";
import { useSettings } from "@/hook/use-settings";

export const useSyncServer = () => {
  const { currency, language } = useSettings();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const localCart = useCartStore((state) => state.list);
  const queryClient = useQueryClient();
  const { list, setMany } = useLikeStore();
  const notSentList = {
    product: list.product.filter((listItem) => !listItem.sent),
    master: list.master.filter((listItem) => !listItem.sent),
    shop: list.shop.filter((listItem) => !listItem.sent),
  };
  const handleSaveMany = (type: LikeTypes) => {
    likeService
      .getAll({
        type,
        lang: language?.locale,
        currency_id: currency?.id,
      })
      .then((res) => {
        setMany(
          type,
          res.data.map((product) => ({ itemId: product.id, sent: true }))
        );
      });
  };
  const { mutate: likeMany } = useMutation(
    ["likeMany"],
    (type: LikeTypes) =>
      likeService.likeMany({
        types: notSentList[type].map((listItem) => ({
          type,
          type_id: listItem.itemId,
        })),
      }),
    {
      onSuccess: (_, type) => {
        handleSaveMany(type);
      },
    }
  );

  const { mutate: insertProductToServerCart } = useMutation({
    mutationFn: (data: InsertCartPayload) => cartService.insert(data),
    onError: (err: NetworkError) => error(err.message),
    onSuccess: (res) => {
      queryClient.setQueriesData<DefaultResponse<Cart> | undefined>(
        { queryKey: ["cart"], exact: false },
        () => res
      );
    },
  });
  const handleSync = () => {
    if (currency && country && localCart.length > 0) {
      const products = localCart.map((cartItem) => ({
        stock_id: cartItem.stockId,
        quantity: cartItem.quantity,
        images: cartItem.image ? [cartItem.image] : undefined,
      }));
      const body: InsertCartPayload = {
        currency_id: currency.id,
        rate: currency.rate,
        products,
        region_id: country?.region_id,
        country_id: country?.id,
      };
      if (city) {
        body.city_id = city.id;
      }
      insertProductToServerCart(body, {
        onSuccess: async (res) => {
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
    if (
      notSentList.product.length > 0 ||
      notSentList.master.length > 0 ||
      notSentList.shop.length > 0
    ) {
      if (notSentList.product.length > 0) likeMany("product");
      if (notSentList.master.length > 0) likeMany("master");
      if (notSentList.shop.length > 0) likeMany("shop");
    } else {
      handleSaveMany("product");
      handleSaveMany("master");
      handleSaveMany("shop");
    }
  };
  return { handleSync };
};
