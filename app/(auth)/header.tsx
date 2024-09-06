"use client";

import Link from "next/link";
import { Button } from "@/components/button";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

const AuthHeader = ({ settings }: { settings: Record<string, string> }) => {
  const pathname = usePathname();
  const { t } = useTranslation();
  return (
    <header className="px-4 pt-6 pb-5 flex items-center justify-between">
      <Link className="text-xl font-semibold" href="/">
        {settings.title}
      </Link>
      <div className="items-center flex gap-5">
        <Button as={Link} href="/for-business" size="small" color="blackOutlined">
          {t("for.business")}
        </Button>
        <Button
          as={Link}
          href={pathname.includes("/login") ? "/sign-up" : "/login"}
          size="small"
          color="blackOutlined"
        >
          {pathname.includes("/login") ? t("sign.up") : t("login")}
        </Button>
      </div>
    </header>
  );
};

export default AuthHeader;
