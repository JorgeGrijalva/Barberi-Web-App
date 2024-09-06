"use client";

import { ExtraValue, ProductExpandedGallery } from "@/types/product";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Mousewheel, Scrollbar, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperType from "swiper";
import clsx from "clsx";
import { Modal } from "@/components/modal";
import dynamic from "next/dynamic";
import FrameIcon from "@/assets/icons/frame";
import { useTranslation } from "react-i18next";
import { MediaRender } from "@/components/media-render";

interface ProductGalleryProps {
  data?: ProductExpandedGallery[];
  selectedColor?: ExtraValue;
  categoryId?: number;
  shopId?: number;
  productId?: number;
}

const SimilarProducts = dynamic(() => import("./similar-products"));

export const ProductGallery = ({
  data,
  selectedColor,
  categoryId,
  shopId,
  productId,
}: ProductGalleryProps) => {
  const { t } = useTranslation();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const mainSwiperRef = useRef<{ swiper: SwiperType }>(null);
  const currentImageIndex = data?.findIndex(
    (galleryItem) => galleryItem.color?.value === selectedColor?.value
  );
  const [isSimilarProductsModalOpen, setIsSimilarProductsModalOpen] = useState(false);
  useEffect(() => {
    if (currentImageIndex && currentImageIndex >= 0) {
      mainSwiperRef.current?.swiper.slideTo(currentImageIndex);
      thumbsSwiper?.slideTo(currentImageIndex);
    } else {
      mainSwiperRef.current?.swiper.slideTo(0);
    }
  }, [selectedColor]);
  return (
    <div className="flex gap-7 md:h-[724px] h-96 xl:mr-20">
      <div className="min-w-0 w-full relative">
        <button
          onClick={() => setIsSimilarProductsModalOpen(true)}
          className="bg-dark bg-opacity-30 backdrop-blur-md dark:bg-white dark:bg-opacity-50 dark:text-dark rounded-full py-2.5 px-3 inline-flex items-center gap-2.5 text-sm font-medium absolute md:top-7 md:left-7 left-2 top-2 rtl:right-2 rtl:max-w-max z-[2] outline-none focus-ring"
        >
          <FrameIcon />
          {t("similar")}
        </button>
        <Swiper
          ref={mainSwiperRef}
          modules={[Thumbs, Mousewheel, Scrollbar]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          slidesPerView={1}
          mousewheel
          className="h-full"
          direction="vertical"
          initialSlide={currentImageIndex || 0}
          watchSlidesProgress
          scrollbar={{
            draggable: true,
            el: ".vertical-scroll",
            dragClass: "bg-gray-field",
            enabled: true,
            hide: false,
          }}
        >
          {data?.map((image) => (
            <SwiperSlide className="!h-full" key={image.stock.id}>
              <MediaRender
                preview={image.preview}
                src={image.img}
                alt={image.color?.value || "color"}
                className="rounded-2xl object-contain aspect-[690/724] h-full"
                fill
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="vertical-scroll h-full w-1 bg-gray-border rounded-full" />
      <div className="h-full">
        <Swiper
          className="product-detail h-full"
          modules={[Thumbs]}
          direction="vertical"
          onSwiper={setThumbsSwiper}
          slidesPerView="auto"
          spaceBetween={8}
        >
          {data?.map((image) => (
            <SwiperSlide className="!h-max" key={image.stock.id}>
              <Image
                src={image.preview || image.img}
                className={clsx("rounded-2xl aspect-square  object-cover ")}
                alt={image.color?.value || ""}
                width={90}
                height={124}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Modal
        isOpen={isSimilarProductsModalOpen}
        onClose={() => setIsSimilarProductsModalOpen(false)}
        withCloseButton
        size="xlarge"
      >
        <SimilarProducts productId={productId} categoryId={categoryId} shopId={shopId} />
      </Modal>
    </div>
  );
};
