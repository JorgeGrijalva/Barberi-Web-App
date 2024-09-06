import React from "react";
import dynamic from "next/dynamic";
import fetcher from "@/lib/fetcher";
import { DefaultResponse, Setting } from "@/types/global";
import { parseSettings } from "@/utils/parse-settings";
import clsx from "clsx";
import { Header } from "@/components/header";

const ProfileSidebar = dynamic(() => import("@/components/profile-sidebar"));

const SettingsLayout = async ({
  children,
  info,
}: {
  children: React.ReactNode;
  info: React.ReactNode;
}) => {
  const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
    cache: "no-cache",
  });
  const parsedSettings = parseSettings(settings?.data);
  return (
    <>
      <Header showOnlyBackButton borderBottom settings={parsedSettings} />
      <main className="xl:container px-4">
        <div className={clsx("flex gap-12 ")}>
          <aside className="border-r border-gray-border dark:border-gray-bold min-h-[calc(100vh-100px)] hidden lg:block lg:pt-10 pt-4">
            <ProfileSidebar />
          </aside>
          {info}
          <div
            className={clsx(
              "pb-4 flex-1 lg:border border-gray-link rounded-button md:my-7 lg:py-10 py-4 lg:px-10 p-0"
            )}
          >
            {children}
          </div>
        </div>
      </main>
    </>
  );
};

export default SettingsLayout;
