"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { bookingService } from "@/services/booking";
import { useSettings } from "@/hook/use-settings";
import Link from "next/link";
import { Translate } from "@/components/translate";
import useUserStore from "@/global-store/user";
import clsx from "clsx";

export const HeaderLinks = () => {
  const { language } = useSettings();
  const user = useUserStore((state) => state.user);
  const { data } = useInfiniteQuery(
    ["appointments", language?.locale],
    ({ pageParam }) =>
      bookingService.getAll({
        lang: language?.locale,
        page: pageParam,
        parent: 1,
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      enabled: !!user,
    }
  );
  const upcomingAppointmentsCount = data?.pages?.[0]?.meta.total ?? 0;
  const tempCount = upcomingAppointmentsCount > 99 ? "99+" : upcomingAppointmentsCount;

  return (
    <div className="lg:flex items-center gap-14 hidden">
      <Link href="/shops" className="text-base font-medium">
        <Translate value="shops" />
      </Link>
      <Link href="/shops?column=b_count&sort=desc" className="text-base font-medium">
        <Translate value="deals" />
      </Link>
      <Link href={user ? "/appointments" : "/login"} className="text-base font-medium">
        <div className="flex items-center gap-1.5">
          <Translate value="my.appointments" />
          {upcomingAppointmentsCount !== 0 && user && (
            <div
              className={clsx(
                "py-1 bg-dark flex items-center justify-center rounded-full ",
                upcomingAppointmentsCount < 10 && "px-2",
                upcomingAppointmentsCount >= 10 && "px-1"
              )}
            >
              <span className="text-xs font-semibold text-white">{tempCount}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
