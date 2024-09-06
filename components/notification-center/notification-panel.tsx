"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import DoubleCheck from "@/assets/icons/double-check";
import { InfiniteData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { Notification, Statistics } from "@/types/notification";
import { Paginate } from "@/types/global";
import useUserStore from "@/global-store/user";
import { NotificationList } from "./notification-list";

type TabType = {
  label: string;
  type: keyof Statistics;
};

interface NotificationPanelProps {
  onCardClick?: () => void;
  limitHeight?: boolean;
}

const tabs: TabType[] = [
  {
    label: "all",
    type: "notification",
  },
  {
    label: "news",
    type: "news_publish",
  },
  {
    label: "orders",
    type: "status_changed",
  },
];

export const NotificationPanel = ({ onCardClick, limitHeight = true }: NotificationPanelProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const { data: statistics, isLoading } = useQuery(
    ["notificationStatistics"],
    () => notificationService.statistics(),
    {
      enabled: !!user,
    }
  );
  const { mutate: readAll } = useMutation({
    mutationFn: () => notificationService.readAll(),
    onMutate: async () => {
      const prevStatistics = queryClient.getQueryData<Statistics>(["notificationStatistics"]);
      const prevNotifications = queryClient.getQueryData<InfiniteData<Paginate<Notification>>>(
        ["notifications"],
        { exact: false }
      );

      queryClient.setQueryData<Statistics | undefined>(["notificationStatistics"], (old) => {
        if (!old) return prevStatistics;
        return {
          notification: 0,
          status_changed: 0,
          news_publish: 0,
          new_order: 0,
          new_user_by_referral: 0,
          transaction: 0,
        };
      });
      queryClient.setQueriesData<InfiniteData<Paginate<Notification>> | undefined>(
        { queryKey: ["notifications"], exact: false },
        (old) => {
          if (!old) return prevNotifications;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data?.map((notification) => ({
                ...notification,
                read_at: new Date(Date.now()).toISOString(),
              })),
            })),
          };
        }
      );
      return { prevStatistics, prevNotifications };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["notificationStatistics"], context?.prevStatistics);
      queryClient.setQueriesData(
        { queryKey: ["notifications"], exact: false },
        context?.prevNotifications
      );
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(["notificationStatistics"]);
      await queryClient.invalidateQueries(["notifications"]);
    },
  });
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[22px] font-semibold">{t("notifications")}</span>
        {!isLoading && (
          <button onClick={() => readAll()} className="focus-ring">
            <div className="flex items-center gap-2 border-b border-dark dark:border-white">
              <DoubleCheck />
              <span className="text-xs font-semibold">{t("mark.as.read")}</span>
            </div>
          </button>
        )}
      </div>
      <Tab.Group>
        <Tab.List className="flex gap-5 space-x-1 mt-7 border-b border-gray-border">
          {({ selectedIndex }) => (
            <>
              {tabs.map((tab, currentIndex) => (
                <Tab
                  key={tab.type}
                  className={({ selected }) =>
                    clsx(
                      "focus-ring outline-none flex items-center gap-2.5 ring-offset-2",
                      selected
                        ? "border-b-2 border-dark dark:border-white"
                        : "text-gray-disabledTab pb-px"
                    )
                  }
                >
                  <span className="text-base font-medium">{t(tab.label)}</span>
                  {!!statistics?.[tab.type] && statistics?.[tab.type] !== 0 && user && (
                    <div
                      className={clsx(
                        "h-4 p-1 flex items-center justify-center rounded-full ",
                        selectedIndex === currentIndex
                          ? "bg-dark dark:bg-white"
                          : "bg-gray-disabledTab"
                      )}
                    >
                      <span className="text-xs text-white dark:text-dark">
                        {statistics?.[tab.type]}
                      </span>
                    </div>
                  )}
                </Tab>
              ))}
            </>
          )}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {tabs.map((tab) => (
            <Tab.Panel key={tab.type} className="mt-4">
              <NotificationList
                type={tab.type}
                onCardClick={onCardClick}
                limitHeight={limitHeight}
              />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
