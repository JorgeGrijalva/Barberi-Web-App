"use client";

import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import LogoutIcon from "@/assets/icons/logout";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "@tanstack/react-query";
import useUserStore from "@/global-store/user";
import Store2LineIcon from "remixicon-react/Store2LineIcon";
import CalendarIcon from "@/assets/icons/calendar";
import Settings2LineIcon from "remixicon-react/Settings2LineIcon";
import BellIcon from "@/assets/icons/bell";
import PortfelIcon from "@/assets/icons/portfel";
import DiscountLineIcon from "@/assets/icons/discount-line";
import AppStoreIcon from "@/assets/icons/app-store";
import PlayMarketIcon from "@/assets/icons/play-market";
import { useSettings } from "@/hook/use-settings";
import { bookingService } from "@/services/booking";
import BagIcon from "@/assets/icons/bag";
import useAddressStore from "@/global-store/address";
import LocationIcon from "@/assets/icons/location";

interface ProfileSidebarProps {
  inDrawer?: boolean;
  onClose?: () => void;
  onLogoutButtonClick?: () => void;
}

const links = [
  {
    title: "shops",
    href: "/shops",
    icon: <Store2LineIcon size={20} />,
  },
  {
    title: "deals",
    href: "/shops?column=b_count&sort=desc",
    icon: <DiscountLineIcon />,
  },
  {
    title: "my.appointments",
    href: "/appointments",
    icon: <CalendarIcon />,
    requireAuth: true,
  },
  {
    title: "profile.settings",
    href: "/profile",
    icon: <Settings2LineIcon size={20} />,
    requireAuth: true,
  },
  {
    title: "notifications",
    href: "/notifications",
    icon: <BellIcon size={20} />,
    requireAuth: true,
  },
  {
    title: "cart",
    href: "/cart",
    icon: <BagIcon size={20} />,
    requireAuth: false,
  },
  {
    title: "for.business",
    href: "/for-business",
    icon: <PortfelIcon />,
    highLight: true,
  },
];

const ProfileSidebar = ({ inDrawer, onClose, onLogoutButtonClick }: ProfileSidebarProps) => {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const { settings, language } = useSettings();
  const { openCountrySelectModal, country } = useAddressStore();
  const pathname = usePathname();

  const { data } = useInfiniteQuery(
    ["appointments", language?.locale],
    ({ pageParam }) =>
      bookingService.getAll({
        lang: language?.locale,
        page: pageParam,
        statuses: ["new", "booked", "progress"],
      }),
    {
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
      enabled: !!user,
    }
  );
  const handleChangeLocation = () => {
    if (onClose) {
      onClose();
    }
    openCountrySelectModal();
  };
  const upcomingAppointmentsCount = data?.pages?.[0]?.meta.total ?? 0;
  const tempCount = upcomingAppointmentsCount > 99 ? "99+" : upcomingAppointmentsCount;

  const actualLinks = user ? links : links.filter((child) => !child.requireAuth);

  return (
    <div className="flex flex-col justify-between h-full">
      <div
        className={clsx(
          "flex flex-col gap-7",
          inDrawer && "pt-20",
          !inDrawer && "w-[290px] sticky top-2 pr-4 pb-4",
          settings?.ui_type === "3" &&
            "lg:bg-white lg:rounded-xl lg:pl-4 lg:pt-4 dark:bg-transparent dark:pl-0 dark:pt-0"
        )}
      >
        <div className="">
          {actualLinks.map((link) => (
            <div key={link.title} className="w-full">
              <Link
                onClick={onClose}
                className={clsx(
                  "w-full  py-5 px-4 inline-flex  text-sm font-medium hover:bg-gray-segment dark:hover:bg-gray-darkSegment dark:hover:text-white transition-all hover:text-dark border-b border-gray-link",
                  link.href === pathname &&
                    "bg-gray-segment font-semibold dark:bg-gray-darkSegment dark:text-white hover:bg-gray-segment ",
                  link.highLight && "text-primary"
                )}
                href={link.href === "/be-seller" && !user ? "/login" : link.href}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    {link.icon} {t(link.title)}
                  </div>
                  {upcomingAppointmentsCount !== 0 && link.href === "/appointments" && (
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
          ))}
          {!!country && (
            <button
              onClick={handleChangeLocation}
              className="w-full py-5 px-4 inline-flex  text-sm font-medium hover:bg-gray-segment dark:hover:bg-gray-darkSegment dark:hover:text-white transition-all hover:text-dark border-b border-gray-link"
            >
              <div className="flex items-center gap-3">
                <LocationIcon />
                {country?.translation?.title && (
                  <span className="text-sm font-medium">{country?.translation?.title}</span>
                )}
              </div>
            </button>
          )}
        </div>
      </div>
      {user && (
        <button
          onClick={() => {
            if (onLogoutButtonClick) {
              onLogoutButtonClick();
            }
            if (onClose) {
              onClose();
            }
          }}
          className={clsx(
            "inline-flex py-[14px] px-4 rounded-2xl items-center gap-3 text-sm font-medium hover:bg-gray-segment transition-all hover:text-dark dark:hover:bg-gray-darkSegment dark:hover:text-white"
          )}
        >
          <LogoutIcon /> {t("logout")}
        </button>
      )}

      <div className="px-4 py-10">
        <span className="text-sm font-medium">{t("there.is.more")}</span>
        <div className="flex items-center gap-2.5 mt-2.5">
          <div className="rounded-md py-2 px-2.5 bg-gray-link flex items-center flex-1 gap-1.5">
            <AppStoreIcon />
            <div>
              <div className="text-[10px] text-gray-field">Download on the</div>
              <div className="text-base font-semibold text-gray-field">App Store</div>
            </div>
          </div>
          <div className="rounded-md py-2 px-2.5 bg-gray-link flex items-center flex-1 gap-1.5">
            <PlayMarketIcon />
            <div>
              <div className="text-[10px] text-gray-field">Get it on</div>
              <div className="text-base font-semibold text-gray-field whitespace-nowrap">
                Google Play
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
