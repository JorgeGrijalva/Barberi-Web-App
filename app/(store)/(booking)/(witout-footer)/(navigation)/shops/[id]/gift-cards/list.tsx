"use client";

import { GiftCartItem } from "@/components/gift-cart/gift-cart";
import { InfiniteLoader } from "@/components/infinite-loader";
import { useBooking } from "@/context/booking";
import { Types } from "@/context/booking/booking.reducer";
import { useSettings } from "@/hook/use-settings";
import { giftCardService } from "@/services/gift-card";
import { extractDataFromPagination } from "@/utils/extract-data";
import { useInfiniteQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

export const GiftCardList = () => {
  const { language, currency } = useSettings();
  const { state, dispatch } = useBooking();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const shopId = Number(searchParams.get("shopId"));
  const { data, isError, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      ["gift-carts", shopId, language?.locale, currency?.id],
      ({ pageParam }) =>
        giftCardService.getAll(shopId, {
          lang: language?.locale,
          page: pageParam,
          shop_id: shopId,
          currency_id: currency?.id,
        }),
      {
        getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      }
    );
  const giftCartList = extractDataFromPagination(data?.pages);

  if ((giftCartList && giftCartList.length === 0) || isError) {
    return (
      <Empty
        animated={false}
        text="empty.gift.cart"
        imagePath="/img/empty_gift_card.png"
        description="gift.cart.empty.description"
      />
    );
  }
  return (
    <>
      <div className="text-xl font-semibold mb-6">{t("choose.amount")}</div>
      <InfiniteLoader hasMore={hasNextPage} loadMore={fetchNextPage} loading={isFetchingNextPage}>
        <div className="grid md:grid-cols-2 grid-cols-1 md:gap-6 gap-2.5">
          {isLoading
            ? Array.from(Array(6).keys()).map((item) => (
                <div
                  className="aspect-[410/180] rounded-button bg-gray-300 animate-pulse"
                  key={item}
                />
              ))
            : giftCartList?.map((giftCard, index) => (
                <GiftCartItem
                  data={giftCard}
                  index={index}
                  isSelected={giftCard.id === state.giftCardForPurchase?.id}
                  onClick={() =>
                    dispatch({ type: Types.SelectPurchaseGiftCard, payload: giftCard })
                  }
                  key={giftCard.id}
                />
              ))}
        </div>
      </InfiniteLoader>
    </>
  );
};
