import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { MediaRender } from "@/components/media-render";
import React from "react";
import { ProductExpandedGallery } from "@/types/product";
import SwiperType from "swiper";
import "swiper/css/pagination";

interface ProductCardGalleryProps {
  gallery: ProductExpandedGallery[];
  onSlideChange: (value: number) => void;
  onSwiper: (swiper: SwiperType) => void;
}

const ProductCardGallery = ({ gallery, onSlideChange, onSwiper }: ProductCardGalleryProps) => (
  <Swiper
    onSwiper={onSwiper}
    pagination={{
      clickable: true,
      el: ".gallery-pagination",
      bulletClass: "w-8 h-0.5 !bg-gray-200 rounded-full transition-all",
      bulletActiveClass: "!bg-gray-field",
      enabled: true,
    }}
    modules={[Pagination]}
    className="w-full h-full"
    onSlideChange={(swiper) => onSlideChange(swiper.realIndex)}
  >
    {gallery.map((galleryItem) => (
      <SwiperSlide key={galleryItem.img}>
        <MediaRender
          preview={galleryItem.preview}
          src={galleryItem.img}
          alt={galleryItem.color?.value || "product"}
          fill
          className="object-contain transition-all group-hover:brightness-110"
          sizes="(max-width: 376px) 160px, (max-width: 576px) 196px, (max-width: 768px) 190px, (max-width: 1200px) 150px, 180px"
        />
      </SwiperSlide>
    ))}
    <div
      className="gallery-pagination opacity-0 transition-all group-hover:opacity-100 absolute z-[2] !top-1 left-1 right-1 flex justify-center gap-2.5"
      style={{ bottom: "unset" }}
    />
  </Swiper>
);

export default ProductCardGallery;
