"use client";

import { IconButton } from "@/components/icon-button";
import BellIcon from "@/assets/icons/bell";
import React, { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notification";
import useUserStore from "@/global-store/user";

const NotificationPanel = dynamic(
  () =>
    import("./notification-panel").then((component) => ({ default: component.NotificationPanel })),
  {
    loading: () => <LoadingCard />,
  }
);

export const NotificationCenter = () => {
  const user = useUserStore((state) => state.user);
  const { data: statistics } = useQuery(
    ["notificationStatistics"],
    () => notificationService.statistics(),
    {
      enabled: !!user,
      refetchOnWindowFocus: true,
    }
  );
  return (
    <Popover className="sm:relative">
      {({ open }) => (
        <>
          <Popover.Overlay className="fixed inset-0 bg-black opacity-30 z-20" />
          <Popover.Button as={Fragment}>
            <IconButton aria-label="notifications" size="small">
              <div className="relative">
                {!!statistics?.notification && statistics.notification > 0 && !!user && (
                  <div className="absolute w-2 h-2 bg-primary rounded-full top-0 right-0" />
                )}
                <BellIcon />
              </div>
            </IconButton>
          </Popover.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 sm:translate-y-1 translate-y-full"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 sm:translate-y-1 translate-y-full"
          >
            <Popover.Panel
              static
              className="sm:absolute fixed sm:bottom-auto bottom-0 right-0 rtl:left-0 rtl:right-auto z-30 mt-2  transform "
            >
              {({ close }) => (
                <div className="sm:rounded-3xl rounded-t-3xl ring-opacity-5 py-7 md:px-6 px-2 bg-white dark:bg-black sm:w-[400px] w-screen">
                  <NotificationPanel onCardClick={() => close()} />
                </div>
              )}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
