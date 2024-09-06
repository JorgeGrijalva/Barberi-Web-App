import { useInfiniteQuery } from "@tanstack/react-query";
import { membershipService } from "@/services/membership";
import { extractDataFromPagination } from "@/utils/extract-data";
import { useSettings } from "@/hook/use-settings";
import { useTranslation } from "react-i18next";
import { InfiniteLoader } from "@/components/infinite-loader";
import { MembershipCard } from "@/components/membership/membership-card";
import React from "react";
import { Membership } from "@/types/membership";
import { useBooking } from "@/context/booking";
import { Types } from "@/context/booking/booking.reducer";
import dynamic from "next/dynamic";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

interface MembershipSelectProps {
  serviceId?: number;
  onSelect: () => void;
}

export const MembershipSelect = ({ serviceId, onSelect }: MembershipSelectProps) => {
  const { language, currency } = useSettings();
  const { t } = useTranslation();
  const { dispatch, state } = useBooking();
  const {
    data: memberships,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError: listError,
  } = useInfiniteQuery(
    ["myMemberships", serviceId],
    ({ pageParam }) =>
      membershipService.getMyAll({
        lang: language?.locale,
        page: pageParam,
        service_id: serviceId,
        currency_id: currency?.id,
      }),
    {
      staleTime: 0,
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      refetchOnWindowFocus: false,
      suspense: true,
      enabled: !!serviceId,
    }
  );
  const membershipList = extractDataFromPagination(memberships?.pages);
  const handleSelectMembership = (membership: Membership, userMembershipId: number) => {
    if (!serviceId) return;
    dispatch({
      type: Types.SelectMembership,
      payload: { serviceId, membership, userMembershipId },
    });
    onSelect();
  };
  return (
    <div className="pt-10 pb-6 px-6">
      <h2 className="text-xl font-semibold">{t("select.membership")}</h2>
      {membershipList && membershipList.length !== 0 && !listError ? (
        <InfiniteLoader loadMore={fetchNextPage} hasMore={hasNextPage} loading={isFetchingNextPage}>
          <div className="relative  grid grid-cols-1 md:grid-cols-2 md:gap-7 sm:gap-4 gap-2 mt-6">
            {membershipList?.map((membership, index) => (
              <MembershipCard
                isSelected={
                  !!state.services.find(
                    (service) =>
                      service.membership?.id === membership.member_ship.id &&
                      service.id === serviceId
                  )
                }
                data={membership.member_ship}
                key={membership.id}
                onClick={() => handleSelectMembership(membership.member_ship, membership.id)}
                expirationDate={membership.expired_at}
                index={index}
              />
            ))}
          </div>
        </InfiniteLoader>
      ) : (
        <Empty
          animated={false}
          text="empty.membership"
          imagePath="/img/empty_membership.png"
          smallText
        />
      )}
    </div>
  );
};
