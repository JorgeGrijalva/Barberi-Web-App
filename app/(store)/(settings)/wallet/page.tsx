"use client";

import { useTranslation } from "react-i18next";
import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { extractDataFromPagination } from "@/utils/extract-data";
import { Empty } from "@/components/empty";
import { Price } from "@/components/price";
import dayjs from "dayjs";
import { InfiniteLoader } from "@/components/infinite-loader";
import { Button } from "@/components/button";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import { Modal } from "@/components/modal";
import { useModal } from "@/hook/use-modal";

const WalletTopUp = dynamic(
  () => import("./components/topup").then((component) => ({ default: component.WalletTopUp })),
  {
    loading: () => <LoadingCard />,
  }
);
const SendMoney = dynamic(
  () => import("./components/send-money").then((component) => ({ default: component.SendMoney })),
  {
    loading: () => <LoadingCard />,
  }
);

const WalletPage = () => {
  const { t } = useTranslation();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } = useInfiniteQuery(
    ["walletHistory"],
    ({ pageParam }) => userService.getWalletHistory({ page: pageParam }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      suspense: true,
      refetchOnWindowFocus: true,
    }
  );
  const [topupModalOpen, openTopupModal, closeTopupModal] = useModal();
  const [sendMoneyOpen, openSendMoneyModal, closeSendMoneyModal] = useModal();
  const walletHistory = extractDataFromPagination(data?.pages);
  const onSendMoneySuccess = () => {
    refetch();
    closeSendMoneyModal();
  };
  return (
    <div className="flex-1">
      <div className="border border-gray-inputBorder rounded-2xl overflow-x-hidden max-h-screen relative overflow-y-auto">
        <div className="px-5 py-3 sticky top-0 bg-white z-[2] dark:bg-dark flex items-center justify-between">
          <h1 className="text-lg font-semibold">{t("wallet.history")}</h1>
          <div className="flex items-center gap-2.5">
            <Button size="small" onClick={openSendMoneyModal} color="black">
              {t("send")}
            </Button>
            <Button size="small" onClick={openTopupModal}>
              {t("add")}
            </Button>
          </div>
        </div>
        {walletHistory && walletHistory.length === 0 ? (
          <Empty text="you.dont.have.any.wallet.transactions.yet" />
        ) : (
          <InfiniteLoader
            loadMore={fetchNextPage}
            hasMore={hasNextPage}
            loading={isFetchingNextPage}
          >
            {walletHistory?.map((historyItem) => (
              <div
                key={historyItem.id}
                className="px-5 py-3 hover:bg-gray-card border-t border-gray-inputBorder dark:hover:bg-gray-bold"
              >
                <span className="text-xs text-gray-field sm:hidden">
                  {dayjs(historyItem.created_at).format("DD.MM.YY HH:mm")}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 items-center justify-between">
                  <div className="sm:flex flex-col hidden">
                    <span className="text-base font-medium">#{historyItem.id}</span>
                    <span className="text-xs text-gray-field">{t("transaction.id")}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-medium">
                      {historyItem.author?.firstname} {historyItem.author?.lastname}
                    </span>
                    <span className="text-xs text-gray-field">{t("sender")}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-medium">
                      <Price
                        number={(historyItem.type === "withdraw" ? -1 : 1) * historyItem.price}
                      />
                    </span>
                    <span className="text-xs text-gray-field">{t("price")}</span>
                  </div>
                  <div className="sm:flex flex-col hidden">
                    <span className="text-base font-medium">
                      {dayjs(historyItem.created_at).format("DD.MM.YY HH:mm")}
                    </span>
                    <span className="text-xs text-gray-field">{t("created.at")}</span>
                  </div>
                  <div className="flex flex-col ">
                    <span className="text-base font-medium line-clamp-1">
                      {historyItem.transaction?.payment_system.tag}
                    </span>
                    <span className="text-xs text-gray-field">{t("type")}</span>
                  </div>
                </div>
              </div>
            ))}
          </InfiniteLoader>
        )}
      </div>
      <Modal isOpen={topupModalOpen} onClose={closeTopupModal} withCloseButton>
        <WalletTopUp />
      </Modal>
      <Modal isOpen={sendMoneyOpen} onClose={closeSendMoneyModal} withCloseButton>
        <SendMoney onSuccess={onSendMoneySuccess} />
      </Modal>
    </div>
  );
};

export default WalletPage;
