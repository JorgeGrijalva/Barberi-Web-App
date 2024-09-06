"use client";

import useUserStore from "@/global-store/user";
import { Button } from "@/components/button";
import { Translate } from "@/components/translate";
import Link from "next/link";
import LoginIcon from "@/assets/icons/login";
import { NotificationCenter } from "@/components/notification-center";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user";
import Image from "next/image";
import { ProfilePlaceholder } from "@/app/(store)/(booking)/components/profile-placeholder";
import { useSettings } from "@/hook/use-settings";
import { IconButton } from "@/components/icon-button";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import { Drawer } from "@/components/drawer";
import { useModal } from "@/hook/use-modal";
import { useMediaQuery } from "@/hook/use-media-query";
import CartIndicator from "../cart-indicator";

const Sidebar = dynamic(() => import("../profile-sidebar"), {
  loading: () => <LoadingCard />,
});

interface HeaderButtonProps {
  canOpenDrawer?: boolean;
  showBusinessButton?: boolean;
}

export const HeaderButtons = ({ canOpenDrawer, showBusinessButton = true }: HeaderButtonProps) => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const { settings } = useSettings();
  const [isSidebarOpen, openSidebar, closeSidebar] = useModal();
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userService.profile(),
    enabled: !!user,
  });
  const isSignedIn = !!user;
  if (!isSignedIn) {
    return (
      <div className="relative z-[4]">
        <div className="items-center gap-5 lg:flex hidden">
          <CartIndicator />
          {showBusinessButton && (
            <Button as={Link} href="/for-business" size="small" color="blackOutlined">
              <Translate value="for.business" />
            </Button>
          )}
          <Button
            as={Link}
            href="/login"
            size="small"
            color="blackOutlined"
            leftIcon={<LoginIcon />}
          >
            <Translate value="login" />
          </Button>
        </div>
        <div className="lg:hidden">
          <IconButton color="blackOutlined" size="medium" onClick={() => router.push("/login")}>
            <LoginIcon />
          </IconButton>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-5 relative z-[4]">
      <div className="xl:flex items-center hidden gap-5">
        <CartIndicator />
        {showBusinessButton && (
          <Button size="small" color="blackOutlined" as={Link} href="/for-business">
            <Translate value="for.business" />
          </Button>
        )}
        <NotificationCenter />
      </div>
      <button onClick={() => (isMobile && canOpenDrawer ? openSidebar() : router.push("/profile"))}>
        {profile?.data?.img && !!user ? (
          <div className="relative w-10 h-10 z-[-1]">
            <Image
              src={profile?.data?.img}
              alt="profile"
              className="rounded-full aspect-square object-cover w-10 h-10"
              fill
            />
          </div>
        ) : (
          <ProfilePlaceholder
            name={profile?.data && !!user ? profile?.data.firstname : settings?.title}
            size={40}
          />
        )}
      </button>
      {isMobile && canOpenDrawer && (
        <Drawer open={isSidebarOpen} onClose={closeSidebar} position="right">
          <div className="py-7">
            <Sidebar inDrawer onClose={closeSidebar} showLogoutButton={false} />
          </div>
        </Drawer>
      )}
    </div>
  );
};
