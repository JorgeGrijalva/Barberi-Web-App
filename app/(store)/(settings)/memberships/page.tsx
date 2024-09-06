"use client";

import React, { useState } from "react";
import { ProductCardUi1Loading } from "@/components/product-card/product-card-ui-1";
import { useInfiniteQuery } from "@tanstack/react-query";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { Empty } from "@/components/empty";
import useUserStore from "@/global-store/user";
import { useSettings } from "@/hook/use-settings";
import { useTranslation } from "react-i18next";
import { membershipService } from "@/services/membership";
import { MembershipCard } from "@/components/membership/membership-card";
import { MembershipBase } from "@/types/membership";
import { Modal } from "@/components/modal";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";

const MembershipDetail = dynamic(
  () =>
    import("@/components/membership/membership-detail").then((component) => ({
      default: component.MembershipDetail,
    })),
  {
    loading: () => <LoadingCard />,
  }
);

const Memberships = () => {
  const user = useUserStore((state) => state.user);
  const { language, currency } = useSettings();
  const [selectedMembership, setSelectedMembership] = useState<MembershipBase | undefined>();
  const { t } = useTranslation();

  const {
    data: memberships,
    isLoading: membershipsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError: listError,
  } = useInfiniteQuery(
    ["myMemberships", language?.locale, currency?.id],
    ({ pageParam }) =>
      membershipService.getMyAll({
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
  const membershipList = extractDataFromPagination(memberships?.pages);

  if ((membershipList && membershipList.length === 0) || listError) {
    return (
      <div className="h-full">
        <h1 className="tmd:text-head text-base font-semibold mb-6">{t("memberships")}</h1>
        <div className="flex justify-center relative h-full items-center">
          <Empty
            animated={false}
            text="empty.membership"
            imagePath="/img/empty_membership.png"
            description="membership.empty.description"
          />
        </div>
      </div>
    );
  }
  if (membershipsLoading) {
    return (
      <div>
        <h1 className="md:text-head text-base font-semibold mb-6">{t("memberships")}</h1>
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
      <h1 className="md:text-head text-base font-semibold mb-6">{t("memberships")}</h1>
      <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
        <div className="relative  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-7 sm:gap-4 gap-2">
          {membershipList?.map((membership, index) => (
            <MembershipCard
              data={membership.member_ship}
              key={membership.id}
              onClick={() =>
                setSelectedMembership({
                  ...membership.member_ship,
                  remainderSessions: membership.remainder,
                })
              }
              expirationDate={membership.expired_at}
              index={index}
              remainderSessions={membership.remainder}
            />
          ))}
        </div>
      </InfiniteLoader>
      <Modal
        isOpen={!!selectedMembership}
        onClose={() => setSelectedMembership(undefined)}
        withCloseButton
      >
        <MembershipDetail data={selectedMembership} showPayButton={false} />
      </Modal>
    </div>
  );
};

export default Memberships;
