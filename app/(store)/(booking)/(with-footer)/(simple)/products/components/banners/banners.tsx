"use client";

import { Banner } from "@/types/banner";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import React, { useState } from "react";
import "swiper/css/pagination";
import { MediaRender } from "@/components/media-render";
import { Modal } from "@/components/modal";
import { Button } from "@/components/button";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { bannerService } from "@/services/banner";
import { Paginate } from "@/types/global";
import { ImageWithFallBack } from "@/components/image";
import AnchorLeftIcon from "@/assets/icons/anchor-left";
import { useSettings } from "@/hook/use-settings";

export const Banners = ({ banners }: { banners?: Paginate<Banner> }) => {
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const { t } = useTranslation();
  const { language, currency } = useSettings();
  const { data: actualBanners, isLoading } = useQuery(
    ["banners", language?.locale, currency?.id],
    () => bannerService.getAll({ lang: language?.locale, currency_id: currency?.id }),
    {
      initialData: banners,
    }
  );
  if (isLoading) {
    return (
      <div className="relative rounded-3xl md:h-[350px] h-60 w-full bg-gray-300 animate-pulse" />
    );
  }
  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation]}
        loop
        centeredSlides
        spaceBetween={30}
        slidesPerView="auto"
        navigation={{ nextEl: ".banner-next", prevEl: ".banner-prev" }}
      >
        {actualBanners?.data?.map((banner) => {
          const image = banner.galleries?.[0].preview || banner.galleries?.[0].path || banner.img;
          return (
            <SwiperSlide key={banner.id} className="xl:max-w-[1340px]">
              <button
                onClick={() => setSelectedBanner(banner)}
                className="relative rounded-button md:h-[330px] h-60 w-full overflow-hidden"
              >
                <ImageWithFallBack
                  src={image}
                  alt={banner.translation?.title || "banner"}
                  className="object-cover w-full h-full"
                  fill
                  priority
                  sizes="(max-width: 376px) 340px, (max-width: 568px) 550px, (768px) 740px, (max-width: 992px) 960px, (max-width:1200px) 1160px, 1440px"
                />
              </button>
            </SwiperSlide>
          );
        })}
        <button className="banner-prev w-10 h-10 rounded-button bg-dark text-white flex items-center justify-center z-10 absolute top-1/2 transform -translate-y-5 left-[16px]">
          <AnchorLeftIcon />
        </button>
        <button className="banner-next rotate-180  w-10 h-10 rounded-button bg-dark text-white flex items-center justify-center z-10 absolute top-1/2 transform -translate-y-5 right-[16px]">
          <AnchorLeftIcon />
        </button>
      </Swiper>
      <Modal onClose={() => setSelectedBanner(null)} isOpen={!!selectedBanner}>
        <div className="sm:py-8 sm:px-8 py-4 px-4">
          <div className="relative h-[315px]">
            <MediaRender
              src={selectedBanner?.galleries?.[0].path || ""}
              preview={selectedBanner?.galleries?.[0].preview}
              alt="banner"
              fill
              className="rounded-3xl aspect-[1.5/1] object-cover h-full w-full"
            />
          </div>
          <div className="text-base mt-6 mb-2">{selectedBanner?.translation?.title}</div>
          <span className="text-sm">{selectedBanner?.translation?.description}</span>
          <Button
            as={Link}
            href={{ pathname: "/products", query: { bannerId: selectedBanner?.id } }}
            color="black"
            className="mt-7"
            fullWidth
          >
            {t("view.product")}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
