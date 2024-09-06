"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import LogoutIcon from "@/assets/icons/logout";
import { useAuth } from "@/hook/use-auth";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { Price } from "@/components/price";
import { ConfirmModal } from "@/components/confirm-modal";
import useUserStore from "@/global-store/user";
import { Button } from "@/components/button";
import { useSettings } from "@/hook/use-settings";
import links from "./sidebar-links";

interface ProfileSidebarProps {
  inDrawer?: boolean;
  onClose?: () => void;
  showLogoutButton?: boolean;
}

const ProfileSidebar = ({ inDrawer, onClose, showLogoutButton = true }: ProfileSidebarProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { settings } = useSettings();
  const [mounted, setMounted] = useState(false);
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userService.profile(),
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: !!user,
  });
  const pathname = usePathname();
  const { logOut } = useAuth();

  const isLoggingOut = Boolean(queryClient.isMutating({ mutationKey: ["logout"] }));

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if ((isFetching && isLoading) || !mounted) {
    return (
      <div className="flex flex-col gap-7 animate-pulse w-[290px] pr-4">
        <div className="flex items-center gap-6 w-full">
          <div className="w-[100px] h-[100px] rounded-full bg-gray-300" />
          <div className="flex flex-col flex-1 gap-1">
            <div className="h-5 w-4/5 rounded-full bg-gray-300" />
            <div className="h-4 w-3/5 rounded-full bg-gray-300" />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="h-4 w-3/5 rounded-full bg-gray-300" />
          <div className="h-4 w-3/5 rounded-full bg-gray-300" />
          <div className="h-4 w-3/5 rounded-full bg-gray-300" />
          <div className="h-4 w-2/5 rounded-full bg-gray-300" />
          <div className="h-4 w-2/5 rounded-full bg-gray-300" />
          <div className="h-4 w-2/5 rounded-full bg-gray-300" />
          <div className="h-4 w-2/5 rounded-full bg-gray-300" />
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logOut();
    router.replace("/");
  };

  return (
    <div
      className={clsx(
        "flex flex-col gap-7",
        inDrawer && "px-2 pb-20",
        !inDrawer && "w-[290px] sticky top-2 pr-4 pb-4",
        settings?.ui_type === "3" &&
          "lg:bg-white lg:rounded-xl lg:pl-4 lg:pt-4 dark:bg-transparent dark:pl-0 dark:pt-0"
      )}
    >
      {data && user ? (
        <Link
          href="/wallet"
          onClick={onClose}
          className="flex items-center justify-center py-3 bg-gray-segment dark:bg-gray-50 dark:text-dark rounded-2xl brightness-90 text-sm hover:brightness-100 transition-all"
        >
          {t("wallet")}:{" "}
          <Price
            number={data.data?.wallet?.price}
            customCurrency={{
              id: 1,
              rate: 1,
              title: data.data.wallet?.symbol || "",
              symbol: data.data.wallet?.symbol || "",
              position: "after",
              active: true,
              default: true,
              updated_at: "",
            }}
          />
        </Link>
      ) : (
        <Button fullWidth size="small" as={Link} href="/login">
          {t("login")}
        </Button>
      )}
      {links.map((link) => {
        const actualList = user
          ? link.children
          : link.children.filter((child) => !child.requireAuth);
        return (
          <div key={link.title}>
            <div className="flex flex-col gap-1">
              {actualList.map((child) => {
                if (
                  (child.checkForSetting && settings?.[child.settingsKey] === "1") ||
                  !child.checkForSetting
                ) {
                  return (
                    <Link
                      onClick={onClose}
                      key={child.title}
                      scroll={typeof child.scroll === "undefined"}
                      className={clsx(
                        "inline-flex py-[14px] px-4 rounded-2xl items-center gap-3 text-sm font-medium hover:bg-gray-segment dark:hover:bg-gray-darkSegment dark:hover:text-white transition-all hover:text-dark",
                        pathname.includes(child.path) &&
                          "bg-gray-segment text-dark dark:bg-gray-darkSegment dark:text-white"
                      )}
                      href={child.path}
                    >
                      {child.icon} {t(child.title)}
                    </Link>
                  );
                }
                return null;
              })}
            </div>
          </div>
        );
      })}
      {user && showLogoutButton && (
        <button
          onClick={() => {
            setIsLogoutModalOpen(true);
          }}
          className={clsx(
            "inline-flex py-[14px] px-4 rounded-2xl items-center gap-3 text-sm font-medium hover:bg-gray-segment transition-all hover:text-dark dark:hover:bg-gray-darkSegment dark:hover:text-white"
          )}
        >
          <LogoutIcon /> {t("logout")}
        </button>
      )}
      <ConfirmModal
        loading={isLoggingOut}
        isOpen={isLogoutModalOpen}
        text="are.you.sure.want.to.logout"
        onCancel={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        confirmText="logout"
      />
    </div>
  );
};

export default ProfileSidebar;
