"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import Link from "next/link";
import Image from "next/image";
import useUserStore from "@/global-store/user";

interface TopHeaderProps {
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

export const TopHeader = ({ title, description, link, buttonText }: TopHeaderProps) => {
  const { t } = useTranslation();
  const user = useUserStore((state) => state.user);

  return (
    <section className="flex items-center justify-center flex-col text-center xl:container px-4 md:pb-24 pb-16 relative pt-12 gap-4">
      <div className="absolute md:-top-1/4 top-0 left-0  w-[425px] h-[245px] scale-150 z-[-1]">
        <Image src="/img/fb_ellipse.png" alt="fb_ellipse" fill className="object-contain" />
      </div>
      <div className="absolute -top-1/2 md:right-72 right-0 md:w-[425px] w-[200px] h-[245px] scale-150 z-[-1]">
        <Image src="/img/fb_ellipse1.png" alt="fb_ellipse" fill className="object-contain" />
      </div>
      <h1 className="md:text-[65px] text-3xl font-semibold break-words">{t(title)}</h1>
      <span className="md:text-xl text-sm">{t(description)}</span>
      <Button as={Link} href={user ? link : "/login"} className="md:mt-10 mt-4">
        {t(buttonText)}
      </Button>
    </section>
  );
};
