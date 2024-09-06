import fetcher from "@/lib/fetcher";
import { DefaultResponse, Setting } from "@/types/global";
import { parseSettings } from "@/utils/parse-settings";
import React from "react";
import { Translate } from "@/components/translate";
import AuthHeader from "./header";

export default async ({ children }: { children: React.ReactNode }) => {
  const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", {
    cache: "no-cache",
  });
  const parsedSettings = parseSettings(settings?.data);
  return (
    <>
      <AuthHeader settings={parsedSettings} />
      <main className="xl:container px-4 flex items-center gap-10 auth-body">
        <div className="auth-body sm:bg-auth-pattern bg-cover bg-no-repeat h-full flex-1 hidden lg:flex px-10 pb-12 flex-col justify-end text-white">
          <h1 className="text-6xl font-semibold">
            <Translate value="online.booking" />
          </h1>
          <p className="text-lg">
            <Translate value="project.description" />
          </p>
        </div>
        <div className="sm:min-w-[450px] lg:max-w-[450px] w-full">{children}</div>
      </main>
    </>
  );
};
