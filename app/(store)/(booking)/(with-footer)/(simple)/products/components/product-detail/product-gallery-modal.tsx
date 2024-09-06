"use client";

import { ExtraValue, ProductExpandedGallery } from "@/types/product";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Keyboard, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperType from "swiper";
import clsx from "clsx";
import { ProductLike } from "@/components/product-like";
import { MediaRender } from "@/components/media-render";

interface ProductGalleryModalProps {
  data?: ProductExpandedGallery[];
  productId?: number;
  selectedColor?: ExtraValue;
}

export const ProductGalleryModal = ({
  data,
  productId,
  selectedColor,
}: ProductGalleryModalProps) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const slidesLength = data && data?.length >= 5 ? 5 : data?.length;
  const mainSwiperRef = useRef<{ swiper: SwiperType }>(null);
  const currentImageIndex = data?.findIndex(
    (galleryItem) => galleryItem.color?.value === selectedColor?.value
  );
  useEffect(() => {
    if (typeof currentImageIndex !== "undefined" && currentImageIndex >= 0) {
      mainSwiperRef.current?.swiper.slideTo(currentImageIndex);
      thumbsSwiper?.slideTo(currentImageIndex);
    } else {
      mainSwiperRef.current?.swiper.slideTo(0);
    }
  }, [selectedColor]);
  return (
    <div className="relative">
      <div className="relative">
        {!!productId && (
          <div className="absolute top-4 right-4 z-[2]">
            <ProductLike productId={productId} />
          </div>
        )}
        <Swiper
          modules={[Thumbs, Keyboard]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          slidesPerView={1}
          initialSlide={currentImageIndex || 0}
          ref={mainSwiperRef}
          keyboard={{ enabled: true }}
        >
          {data?.map((image) => (
            <SwiperSlide key={image.img}>
              <div className="flex justify-center">
                <MediaRender
                  src={image.img}
                  preview={image.preview}
                  alt={image.color?.value || ""}
                  width={411}
                  className="rounded-2xl md:aspect-[411/609] aspect-[1/3] max-h-96 sm:max-h-none md:w-auto object-contain w-full"
                  height={609}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute z-[1] w-full bottom-4 left-0 flex justify-center">
          <div
            className="rounded-full bg-dark bg-opacity-20 backdrop-blur-lg overflow-hidden"
            style={{
              width: `calc(${(slidesLength || 1) * 44}px + ${((slidesLength || 1) + 1) * 8}px)`,
            }}
          >
            <Swiper
              className="product-modal"
              modules={[Thumbs]}
              watchSlidesProgress
              onSwiper={setThumbsSwiper}
              slidesPerView="auto"
            >
              {data?.map((image, i) => (
                <SwiperSlide className="max-w-max" key={image.img}>
                  <Image
                    src={image.preview || image.img}
                    className={clsx(
                      "rounded-full aspect-square w-11 h-11 object-contain my-2 mr-2 flex justify-center",
                      i === 0 && "ml-2"
                    )}
                    alt={image.color?.value || ""}
                    width={44}
                    height={44}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};
