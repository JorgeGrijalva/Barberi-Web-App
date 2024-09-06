"use client";

import { useState } from "react";
import { ChatFloatButton } from "@/components/chat/chat-float-button";
import { Drawer } from "@/components/drawer";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import fetcher from "@/lib/fetcher";
import { DefaultResponse } from "@/types/global";
import { UserDetail } from "@/types/user";
import useUserStore from "@/global-store/user";

const Chat = dynamic(() => import("@/components/chat"));

export const GeneralChat = () => {
  const user = useUserStore((state) => state.user);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const { data } = useQuery(
    ["adminInfo"],
    () => fetcher<DefaultResponse<UserDetail>>("v1/dashboard/user/admin-info"),
    {
      enabled: !!user,
    }
  );

  return (
    <>
      <Drawer
        container={false}
        position="right"
        open={isChatDrawerOpen}
        onClose={() => setIsChatDrawerOpen(false)}
      >
        <Chat recieverId={data?.data.id} />
      </Drawer>

      {data?.data.id && <ChatFloatButton onClick={() => setIsChatDrawerOpen(true)} />}
    </>
  );
};
