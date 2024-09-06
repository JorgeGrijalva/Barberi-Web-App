"use client";

import { ListHeader } from "@/components/list-header";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSettings } from "@/hook/use-settings";
import { useTranslation } from "react-i18next";
import { membershipService } from "@/services/membership";
import { extractDataFromPagination } from "@/utils/extract-data";
import React, { useState } from "react";
import { MembershipBase } from "@/types/membership";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import { Modal } from "@/components/modal";
import { MembershipCard } from "@/components/membership/membership-card";
import { InfiniteLoader } from "@/components/infinite-loader";
import { useRouter, useSearchParams } from "next/navigation";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

const MembershipDetail = dynamic(
  () =>
    import("@/components/membership/membership-detail").then((component) => ({
      default: component.MembershipDetail,
    })),
  {
    loading: () => <LoadingCard />,
  }
);

const MembershipList = ({ params }: { params: { id: string } }) => {
  const { language, currency } = useSettings();
  const searchParams = useSearchParams();
  const shopId = Number(searchParams.get("shopId"));
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isError, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      ["membershipList", shopId, language?.locale, currency?.id],
      ({ pageParam }) =>
        membershipService.getAll(shopId, {
          lang: language?.locale,
          page: pageParam,
          currency_id: currency?.id,
        }),
      {
        getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      }
    );
  const [selectedMembership, setSelectedMembership] = useState<MembershipBase | undefined>();
  const membershipList = extractDataFromPagination(data?.pages);

  if ((membershipList && membershipList.length === 0) || isError) {
    return (
      <Empty
        animated={false}
        text="empty.membership"
        imagePath="/img/empty_membership.png"
        description="membership.empty.description"
      />
    );
  }
  return (
    <div className="xl:container px-4 mt-7">
      <ListHeader title={t("membership.list")} />
      <InfiniteLoader hasMore={hasNextPage} loadMore={fetchNextPage} loading={isFetchingNextPage}>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-7 gap-2.5">
          {isLoading
            ? Array.from(Array(6).keys()).map((item) => (
                <div
                  className="aspect-[2/1.2] rounded-button bg-gray-300 animate-pulse"
                  key={item}
                />
              ))
            : membershipList?.map((membership, index) => (
                <MembershipCard
                  data={membership}
                  onClick={() =>
                    router.push(`/shops/${params.id}/memberships/${membership.id}?shopId=${shopId}`)
                  }
                  key={membership.id}
                  index={index}
                />
              ))}
        </div>
      </InfiniteLoader>
      <Modal
        isOpen={!!selectedMembership}
        onClose={() => setSelectedMembership(undefined)}
        withCloseButton
      >
        <MembershipDetail data={selectedMembership} />
      </Modal>
    </div>
  );
};

export default MembershipList;
