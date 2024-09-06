"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import DiscountIcon from "@/assets/icons/discount";
import SwiperType from "swiper";
import { useSettings } from "@/hook/use-settings";
import { Price } from "../price";
import { ProductCardUIProps } from "./types";
import { MediaRender } from "../media-render";

const ProductCounter = dynamic(() => import("./product-counter"));
const ProductCardGallery = dynamic(() => import("./product-card-gallery"));

const ProductCardUiMini = ({
  data,
  onIncrementProductCount,
  onDecrementProductCount,
  cartQuantity,
  params,
  gallery,
  onColorClick,
  selectedStock,
}: ProductCardUIProps) => {
  const { settings } = useSettings();
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const handleSlideChange = (slideIndex: number) => {
    if (gallery && gallery.length > 0) {
      onColorClick(gallery[slideIndex].stock);
    }
  };
  return (
    <div className="relative group">
      {selectedStock?.discount && (
        <div className="absolute top-4 left-4 z-[2] text-red">
          <DiscountIcon />
        </div>
      )}
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
        <div className="relative rounded-3xl overflow-hidden aspect-[210/280] bg-white">
          {gallery && gallery.length > 0 ? (
            <ProductCardGallery
              gallery={gallery}
              onSwiper={(value) => setSwiper(value)}
              onSlideChange={handleSlideChange}
            />
          ) : (
            <MediaRender
              preview={data.galleries?.[0].preview}
              src={data.img}
              alt={data.translation?.title || "product"}
              fill
              className="object-cover transition-all group-hover:brightness-110"
            />
          )}
          {settings?.product_ui_type === "2" && (
            <ProductCounter
              count={cartQuantity}
              onMinusClick={onDecrementProductCount}
              onPlusClick={onIncrementProductCount}
              minQty={data?.min_qty}
              interval={data?.interval}
            />
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="md:text-base sm:text-sm text-xs font-medium line-clamp-2">
            {data.translation?.title}
          </span>
        </div>
      </Link>
      <div className="flex flex-col flex-wrap">
        <div className="flex items-center gap-2">
          <strong className="sm:text-xl text-sm font-semibold whitespace-nowrap">
            <Price number={selectedStock?.total_price} />
          </strong>
          {selectedStock?.discount && (
            <span className="text-primary text-sm font-semibold line-through whitespace-nowrap">
              <Price number={selectedStock?.price} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProductCardUiMiniLoading = () => (
  <div className="relative">
    <div className="relative rounded-3xl bg-gray-300 overflow-hidden aspect-[210/280]" />
    <div className="flex items-center justify-between mt-4">
      <span className="h-4 rounded-full w-1/2" />
      <span className="h-3 rounded-full w-3/5" />
    </div>
  </div>
);

export default ProductCardUiMini;
