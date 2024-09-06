"use client";

import React, { useState } from "react";
import { ProductCardUi1Loading } from "@/components/product-card/product-card-ui-1";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { Empty } from "@/components/empty";
import useUserStore from "@/global-store/user";
import { useSettings } from "@/hook/use-settings";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/modal";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import { GiftCart } from "@/types/gift-card";
import { giftCardService } from "@/services/gift-card";
import { GiftCartItem } from "@/components/gift-cart/gift-cart";
import dayjs from "dayjs";
import { useModal } from "@/hook/use-modal";

const GiftCartDetail = dynamic(
  () =>
    import("@/components/gift-cart/gift-cart-detail").then((component) => ({
      default: component.GiftCartDetail,
    })),
  {
    loading: () => <LoadingCard />,
  }
);
const GiftCartSendToFriend = dynamic(
  () =>
    import("@/components/gift-cart/gift-cart-send-friend").then((component) => ({
      default: component.GiftCartSendToFriend,
    })),
  {
    loading: () => <LoadingCard />,
  }
);

const GiftCarts = () => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);
  const { language, currency } = useSettings();
  const queryClient = useQueryClient();
  const [selectedGiftCart, setSelectedGiftCart] = useState<GiftCart | undefined>();
  const [isGiftCardDetailsModalOpen, openGiftCardDetailsModal, closeGiftCardDetailsModal] =
    useModal();
  const [isSendFriendModalOpen, openSendFriendModal, closeSendFriendModal] = useModal();

  const {
    data: giftcarts,
    isLoading: giftCartsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError: listError,
  } = useInfiniteQuery(
    ["mygiftCarts", language?.locale, currency?.id],
    ({ pageParam }) =>
      giftCardService.getMyAll({
        lang: language?.locale,
        page: pageParam,
        currency_id: currency?.id,
      }),
    {
      enabled: !!user,
      staleTime: 0,
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      refetchOnWindowFocus: false,
    }
  );
  const giftCartList = extractDataFromPagination(giftcarts?.pages);

  const handleOpenCartDetails = (giftCart: GiftCart) => {
    setSelectedGiftCart(giftCart);
    openGiftCardDetailsModal();
  };

  const handleOpenSendFriendModal = () => {
    closeGiftCardDetailsModal();
    openSendFriendModal();
  };

  const handleCloseSendFriendModal = () => {
    setSelectedGiftCart(undefined);
    closeSendFriendModal();
  };

  if ((giftCartList && giftCartList.length === 0) || listError) {
    return (
      <div className="h-full">
        <h1 className="tmd:text-head text-base font-semibold mb-6">{t("gift.carts")}</h1>
        <div className="flex justify-center relative h-full items-center">
          <Empty
            animated={false}
            text="empty.gift.cart"
            imagePath="/img/empty_gift_card.png"
            description="gift.cart.empty.description"
          />
        </div>
      </div>
    );
  }
  if (giftCartsLoading) {
    return (
      <div>
        <h1 className="md:text-head text-base font-semibold mb-6">{t("gift.carts")}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-7 sm:gap-4 gap-2">
          {Array.from(Array(6).keys()).map((item) => (
            <ProductCardUi1Loading key={item} />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1 className="md:text-head text-base font-semibold mb-6">{t("gift.carts")}</h1>
      <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
        <div className="relative  grid grid-cols-1 xl:grid-cols-2 md:gap-7 sm:gap-4 gap-2">
          {giftCartList?.map((giftCart, index) => (
            <GiftCartItem
              index={index}
              data={{
                ...giftCart.giftCart,
                price: giftCart?.price,
                time: dayjs(giftCart.expired_at).format("YYYY-MM-DD HH:mm"),
                user_gift_cart_id: giftCart.id,
              }}
              key={giftCart.id}
              onClick={() =>
                handleOpenCartDetails({
                  ...giftCart.giftCart,
                  price: giftCart?.price,
                  time: dayjs(giftCart.expired_at).format("YYYY-MM-DD HH:mm"),
                  user_gift_cart_id: giftCart.id,
                })
              }
            />
          ))}
        </div>
      </InfiniteLoader>
      <Modal
        isOpen={isGiftCardDetailsModalOpen}
        onClose={closeGiftCardDetailsModal}
        withCloseButton
      >
        <GiftCartDetail
          data={selectedGiftCart}
          showPayButton={false}
          showSendFriendButton
          openSendFriendModal={handleOpenSendFriendModal}
        />
      </Modal>
      <Modal isOpen={isSendFriendModalOpen} onClose={handleCloseSendFriendModal} withCloseButton>
        <GiftCartSendToFriend
          giftCartId={selectedGiftCart?.user_gift_cart_id}
          onSuccess={() => {
            queryClient.invalidateQueries(["mygiftCarts", language?.locale, currency?.id]);
            handleCloseSendFriendModal();
          }}
        />
      </Modal>
    </div>
  );
};

export default GiftCarts;
