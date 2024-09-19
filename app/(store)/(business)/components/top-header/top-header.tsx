"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import Link from "next/link";
import Image from "next/image";
import useUserStore from "@/global-store/user";
import { Badge } from "@/components/ui/badge";

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
      <Badge className="text-white">BÀRBERI APP</Badge>

      <div className="flex flex-col gap-4 ">
        {/* <span className="bg-gradient-to-br py-8 font-semibold text-4xl md:text-[65px] from-primary to-primary/50 bg-clip-text text-transparent">
        </span> */}
        <h1 className="lg:text-5xl md:text-4xl text-3xl font-semibold break-words leading-normal">
          {`${t(title)}`}
        </h1>
      </div>
      <div className="lg:max-w-3xl md:max-w-lg max-w-sm">
        <span className="lg:text-base md:text-sm text-xs">{t(description)}</span>
      </div>
      <Button as={Link} href={user ? link : "/sign-up"} className="md:mt-10 mt-4">
        {t(buttonText)}
      </Button>
    </section>
  );
};
