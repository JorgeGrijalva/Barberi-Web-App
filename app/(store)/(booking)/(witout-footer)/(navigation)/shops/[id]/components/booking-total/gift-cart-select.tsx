import { useInfiniteQuery } from "@tanstack/react-query";
import { extractDataFromPagination } from "@/utils/extract-data";
import { useSettings } from "@/hook/use-settings";
import { useTranslation } from "react-i18next";
import { InfiniteLoader } from "@/components/infinite-loader";
import React from "react";
import { useBooking } from "@/context/booking";
import { Types } from "@/context/booking/booking.reducer";
import dynamic from "next/dynamic";
import { giftCardService } from "@/services/gift-card";
import { GiftCartItem } from "@/components/gift-cart/gift-cart";
import { GiftCart } from "@/types/gift-card";
import dayjs from "dayjs";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

interface GiftCartSelectProps {
  shopId?: number;
  onSelect: () => void;
}

export const GiftCartSelect = ({ shopId, onSelect }: GiftCartSelectProps) => {
  const { language, currency } = useSettings();
  const { t } = useTranslation();
  const { dispatch, state } = useBooking();
  const {
    data: giftCarts,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError: listError,
  } = useInfiniteQuery(
    ["myGiftCarts", shopId],
    ({ pageParam }) =>
      giftCardService.getMyAll({
        lang: language?.locale,
        page: pageParam,
        shop_id: shopId,
        currency: currency?.id,
      }),
    {
      staleTime: 0,
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      refetchOnWindowFocus: false,
      suspense: true,
      enabled: !!shopId,
    }
  );
  const giftCartList = extractDataFromPagination(giftCarts?.pages);
  const handleSelectGiftCart = (giftCart: GiftCart) => {
    if (!shopId) return;
    dispatch({
      type: Types.SelectGiftCart,
      payload: giftCart,
    });
    onSelect();
  };
  return (
    <div className="pt-10 pb-6 px-6">
      <h2 className="text-xl font-semibold">{t("select.gift.cart")}</h2>
      {giftCartList && giftCartList.length !== 0 && !listError ? (
        <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
          <div className="relative grid grid-cols-1 md:gap-7 sm:gap-4 gap-2 mt-6">
            {giftCartList?.map((giftCart, index) => (
              <GiftCartItem
                index={index}
                isSelected={state.giftCart?.id === giftCart.giftCart.id}
                data={{
                  ...giftCart.giftCart,
                  price: giftCart?.price,
                  time: dayjs(giftCart.expired_at).format("YYYY-MM-DD HH:mm"),
                }}
                key={giftCart.id}
                onClick={() =>
                  handleSelectGiftCart({ ...giftCart.giftCart, shopGiftCartId: giftCart.id })
                }
              />
            ))}
          </div>
        </InfiniteLoader>
      ) : (
        <Empty
          animated={false}
          text="empty.gift.cart"
          imagePath="/img/empty_gift_card.png"
          description="gift.cart.empty.description"
        />
      )}
    </div>
  );
};
