"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import Link from "next/link";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="xl:container px-4 h-screen flex items-center justify-center flex-col gap-12">
      <Image src="/img/404.png" alt="not_found" width={300} height={300} />
      <div className="text-center">
        <strong className="text-3xl font-semibold">{t("some.thing.wrong")}</strong>
        <p className="text-lg">{t("page.doest.exist")}</p>
      </div>
      <Button as={Link} href="/" color="black">
        {t("go.to.home")}
      </Button>
    </div>
  );
};

export default NotFound;
