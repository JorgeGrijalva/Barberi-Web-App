"use client";

import React, { useState } from "react";
import StarIcon from "@/assets/icons/star";
import Link from "next/link";
import dynamic from "next/dynamic";
import DiscountIcon from "@/assets/icons/discount";
import clsx from "clsx";
import { Stock } from "@/types/product";
import SwiperType from "swiper";
import { useSettings } from "@/hook/use-settings";
import { ProductLike } from "../product-like";
import { ProductCardUIProps } from "./types";
import { MediaRender } from "../media-render";

const ProductCounter = dynamic(() => import("./product-counter"));
const ProductCardGallery = dynamic(() => import("./product-card-gallery"));

const ProductCardUi1 = ({
  data,
  onIncrementProductCount,
  onDecrementProductCount,
  cartQuantity,
  params,
  gallery,
  onColorClick,
  selectedStock,
  roundedColors,
  cartDetailId,
}: ProductCardUIProps) => {
  const { settings } = useSettings();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const handleColorClick = (stock: Stock, index: number) => {
    onColorClick(stock);
    if (swiper) {
      swiper.slideTo(index);
    }
  };
  const handleSlideChange = (slideIndex: number) => {
    if (gallery && gallery.length > 0) {
      onColorClick(gallery[slideIndex].stock);
    }
  };
  return (
    <div className="relative group">
      {selectedStock?.discount && (
        <div className="absolute top-4 right-4 z-[2] text-red">
          <DiscountIcon />
        </div>
      )}
      <div className="absolute top-4 left-4 z-[2]">
        <ProductLike productId={data.id} />
      </div>
      <Link
        href={`/products/${data.uuid}${
          // eslint-disable-next-line no-nested-ternary
          params && params.length > 0
            ? `?${params}${selectedStock ? `&stock_id=${selectedStock.id}` : ""}`
            : selectedStock && swiper?.realIndex !== 0
            ? `?stock_id=${selectedStock.id}`
            : ""
        }`}
      >
        <div className="relative rounded-button overflow-hidden aspect-[307/350] bg-gray-card">
          {gallery && gallery.length > 0 ? (
            <ProductCardGallery
              gallery={gallery}
              onSlideChange={handleSlideChange}
              onSwiper={(value) => setSwiper(value)}
            />
          ) : (
            <MediaRender
              preview={data.galleries?.[0].preview}
              src={data.img}
              alt={data.translation?.title || "product"}
              fill
              className="object-contain transition-all group-hover:brightness-110"
              sizes="(max-width: 376px) 160px, (max-width: 576px) 196px, (max-width: 768px) 190px, (max-width: 1200px) 150px, 180px"
            />
          )}
          {settings?.product_ui_type === "2" && (
            <ProductCounter
              count={cartQuantity}
              onMinusClick={onDecrementProductCount}
              onPlusClick={onIncrementProductCount}
              minQty={data?.min_qty}
              interval={data?.interval}
              cartDetailId={cartDetailId}
              price={selectedStock?.total_price}
            />
          )}
        </div>
        <div className="flex items-start justify-between mt-4 mb-2">
          <span className="md:text-base sm:text-sm text-xs font-medium line-clamp-2 uppercase">
            {data.translation?.title}
          </span>
          <div className="flex items-center gap-1">
            <StarIcon />
            <span className="text-xs font-semibold">{data.r_avg || 0}</span>
          </div>
        </div>
      </Link>
      <div className="flex flex-col flex-wrap">
        {gallery && gallery.length > 0 && (
          <div className="flex items-center gap-2 ">
            {gallery.map((galleryItem, index) =>
              galleryItem.color?.value ? (
                <button
                  key={galleryItem.img}
                  aria-label={galleryItem.color?.value}
                  onMouseEnter={() => handleColorClick(galleryItem.stock, index)}
                  onClick={() => handleColorClick(galleryItem.stock, index)}
                  style={{ backgroundColor: galleryItem.color?.value }}
                  className={clsx(
                    "w-4 h-4",
                    galleryItem.color?.value === "#ffffff" && "border border-gray-border",
                    roundedColors ? "rounded-full" : "rounded-md"
                  )}
                />
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const ProductCardUi1Loading = () => (
  <div className="relative">
    <div className="relative rounded-3xl bg-gray-300 overflow-hidden aspect-[210/280]" />
    <div className="flex items-center justify-between mt-4">
      <span className="h-4 rounded-full w-1/2" />
      <span className="h-3 rounded-full w-3/5" />
    </div>
  </div>
);

export default ProductCardUi1;
