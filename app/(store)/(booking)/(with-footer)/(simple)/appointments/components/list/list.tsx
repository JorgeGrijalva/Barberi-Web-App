"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSettings } from "@/hook/use-settings";
import { bookingService } from "@/services/booking";
import { extractDataFromPagination } from "@/utils/extract-data";
import { BookingCard } from "@/app/(store)/(booking)/components/booking-card";
import { Booking } from "@/types/booking";
import { BookingCardLoading } from "@/app/(store)/(booking)/components/booking-card/loading";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { InfiniteLoader } from "@/components/infinite-loader";

const Empty = dynamic(() =>
  import("@/components/empty").then((components) => ({ default: components.Empty }))
);

interface AppointmentsListProps {
  selectedBooking?: Booking;
  onSelectBooking: (value: Booking) => void;
  onError: () => void;
}

export const AppointmentsList = ({
  selectedBooking,
  onSelectBooking,
  onError,
}: AppointmentsListProps) => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const {
    data: upcomingAppointments,
    isLoading: upcomingAppointmentsLoading,
    hasNextPage: hasNextUpcomingPage,
    fetchNextPage: fetchNextUpcomingPage,
    isFetchingNextPage: isFetchingNextUpcomingPage,
  } = useInfiniteQuery(
    ["appointments", language?.locale],
    ({ pageParam }) =>
      bookingService.getAll({
        lang: language?.locale,
        page: pageParam,
        parent: 1,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      onSuccess: (res) => {
        if (!selectedBooking) {
          onSelectBooking(res.pages[0].data?.[0]);
        }
      },
      onError,
    }
  );
  const upcomingAppointmentList = extractDataFromPagination(upcomingAppointments?.pages);
  const upcomingAppointmentsCount = upcomingAppointments?.pages?.[0]?.meta.total ?? 0;
  const tempUpcomingCount = upcomingAppointmentsCount > 99 ? "99+" : upcomingAppointmentsCount;

  return (
    <div className="border border-gray-link rounded-button p-5">
      <div>
        <div className="flex items-center gap-2.5 mb-6">
          <h2 className="lg:text-[22px] text-lg font-semibold ">{t("appointments")}</h2>
          {upcomingAppointmentsCount !== 0 && (
            <div
              className={clsx(
                "py-1 bg-dark flex items-center justify-center rounded-full ",
                upcomingAppointmentsCount < 10 && "px-2",
                upcomingAppointmentsCount >= 10 && "px-1"
              )}
            >
              <span className="text-xs font-semibold text-white">{tempUpcomingCount}</span>
            </div>
          )}
        </div>
        {upcomingAppointmentList?.length !== 0 ? (
          <InfiniteLoader
            hasMore={hasNextUpcomingPage}
            loadMore={fetchNextUpcomingPage}
            loading={isFetchingNextUpcomingPage}
          >
            <div className="flex flex-col gap-3">
              {upcomingAppointmentsLoading
                ? Array.from(Array(6).keys()).map((item) => <BookingCardLoading key={item} />)
                : upcomingAppointmentList?.map((booking) => (
                    <BookingCard
                      data={booking}
                      key={booking.id}
                      isPast={selectedBooking?.id !== booking.id}
                      onClick={() => onSelectBooking(booking)}
                      onCancelSuccessful={() => {
                        if (selectedBooking?.id === booking.id) {
                          onSelectBooking({ ...selectedBooking, status: "canceled" });
                        }
                      }}
                    />
                  ))}
            </div>
          </InfiniteLoader>
        ) : (
          <Empty animated={false} smallText />
        )}
      </div>
    </div>
  );
};
