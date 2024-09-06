"use client";

import { Page, Paginate } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { useSettings } from "@/hook/use-settings";
import { infoService } from "@/services/info";
import Image from "next/image";
import { ImageWithFallBack } from "@/components/image";
import Link from "next/link";
import clsx from "clsx";

interface AboutPageContentProps {
  initialData?: Paginate<Page>;
}

export const AboutPageContent = ({ initialData }: AboutPageContentProps) => {
  const { language } = useSettings();
  const { data } = useQuery(
    ["about", language?.locale],
    () =>
      infoService.getPages({
        type: "all_about",
        lang: language?.locale,
      }),
    {
      initialData,
    }
  );

  const mainSection = data?.data?.find((page) => page.type === "about");
  const otherSections = data?.data.filter((page) => page.type !== "about");

  return (
    <section className="xl:container px-4 py-7">
      <h1 className="md:text-head text-xl font-semibold">{mainSection?.translation?.title}</h1>
      <div className="py-3 mb-7">
        <div className="relative aspect-[2/1] mb-3">
          <ImageWithFallBack
            src={mainSection?.img || ""}
            alt={mainSection?.translation?.title || "mainSection"}
            fill
            className="object-cover rounded-button"
          />
        </div>
        <div>
          <div
            dangerouslySetInnerHTML={{ __html: mainSection?.translation?.description || "" }}
            className="text-base"
          />
        </div>
      </div>
      {otherSections?.map((section, i) => (
        <div
          className={clsx("grid md:grid-cols-2 gap-3", i % 2 === 0 ? "py-7" : "py-12")}
          key={section.id}
        >
          <div className={clsx("relative aspect-[2/1]", i === 0 && "md:order-2")}>
            <ImageWithFallBack
              src={section?.img || ""}
              alt={section?.translation?.title || "mainSection"}
              fill
              className="object-cover rounded-button"
            />
          </div>
          <div>
            <h2 className="md:text-xl text-lg font-semibold">{section.translation?.title}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: section?.translation?.description || "" }}
              className="text-base my-3"
            />
            <div className="flex items-center gap-3">
              {section.buttons?.app_store_button_link && (
                <Link href={section.buttons.app_store_button_link}>
                  <Image src="/img/apple_store.png" alt="applestore" width={147} height={55} />
                </Link>
              )}
              {section.buttons?.google_play_button_link && (
                <Link href={section.buttons.google_play_button_link}>
                  <Image src="/img/play_market.png" alt="playmarket" width={147} height={55} />
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};
