import useCartStore from "@/global-store/cart";
import useAddressStore from "@/global-store/address";
import { useQuery } from "@tanstack/react-query";
import { cartService } from "@/services/cart";
import { error } from "@/components/alert";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useSettings } from "@/hook/use-settings";

export const useMemberCart = () => {
  const updateLocalCart = useCartStore((state) => state.updateList);
  const deleteMemberData = useCartStore((state) => state.deleteMemberData);
  const { language } = useSettings();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const memberCartId = useCartStore((state) => state.memberCartId);
  const userCartUuid = useCartStore((state) => state.userCartUuid);
  const router = useRouter();
  const { t } = useTranslation();
  const params = {
    region_id: country?.region_id,
    country_id: country?.id,
    city_id: city?.id,
    lang: language?.locale,
    user_cart_uuid: userCartUuid,
  };
  return useQuery({
    queryKey: ["cart", params],
    queryFn: () => cartService.guestGet(Number(memberCartId), params),

    onSuccess: (res) => {
      const products = res.data?.user_carts
        ?.find((userCart) => userCart.uuid === userCartUuid)
        ?.cartDetails.flatMap((details) => details.cartDetailProducts)
        .map((product) => ({
          stockId: product.stock.id,
          quantity: product.quantity,
          cartDetailId: product.id,
        }));

      updateLocalCart(products || []);
    },

    onError: () => {
      updateLocalCart([]);
      deleteMemberData();
      error(t("you.kicked.from.group"));
      router.replace("/");
    },
    enabled: !!country,
    retry: false,
    refetchOnMount: "always",
    refetchInterval: 5000,
  });
};
