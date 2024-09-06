"use client";

import { useModal } from "@/hook/use-modal";
import { IconButton } from "@/components/icon-button";
import { Drawer } from "@/components/drawer";
import dynamic from "next/dynamic";
import Menu2Icon from "@/assets/icons/menu-2";
import { ConfirmModal } from "@/components/confirm-modal";
import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hook/use-auth";

const ProfileSidebar = dynamic(() => import("./sidebar"));

const MobileSidebar = ({ isHidden = true }: { isHidden?: boolean }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isDrawerOpen, openDrawer, closeDrawer] = useModal();
  const isLoggingOut = Boolean(queryClient.isMutating({ mutationKey: ["logout"] }));
  const { logOut } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    router.replace("/");
  };
  return (
    <div className={`${isHidden ? "lg:hidden" : ""}`}>
      <div className="relative z-[9]">
        <IconButton
          onClick={() => (isDrawerOpen ? closeDrawer() : openDrawer())}
          size="small"
          rounded
        >
          <Menu2Icon />
        </IconButton>
      </div>
      <Drawer
        withCloseIcon={false}
        container={false}
        position="left"
        open={isDrawerOpen}
        onClose={closeDrawer}
      >
        <ProfileSidebar
          inDrawer
          onClose={closeDrawer}
          onLogoutButtonClick={() => setIsLogoutModalOpen(true)}
        />
      </Drawer>
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

export default MobileSidebar;
