"use client";

import Image from "next/image";
import React, { useState } from "react";
import StarIcon from "@/assets/icons/star";
import FileCheckIcon from "@/assets/icons/file-check";
import Link from "next/link";
import DiscountIcon from "@/assets/icons/discount";
import { Product, ProductExpandedGallery, Stock } from "@/types/product";
import { useTranslation } from "react-i18next";
import { ProductLike } from "@/components/product-like";
import { Translate } from "@/components/translate";
import { Price } from "@/components/price";
import { Button } from "@/components/button";
import { useMutation } from "@tanstack/react-query";
import { productService } from "@/services/product";
import NetworkError from "@/utils/network-error";
import { error } from "@/components/alert";
// eslint-disable-next-line
import { saveAs } from "file-saver";

interface DigitalCardUiProps {
  data: Product;
  params?: string;
  gallery?: ProductExpandedGallery[];
  selectedStock: Stock;
  onColorClick: (stock: Stock) => void;
  digitalFileId: number;
}

const DigitalCardUi = ({
  data,
  params,
  gallery,
  onColorClick,
  selectedStock,
  digitalFileId,
}: DigitalCardUiProps) => {
  const { t } = useTranslation();
  const hasColors = gallery && gallery.length > 1;
  const [selectedImage, setSelectedImage] = useState(gallery?.[0].img || data.img);
  const handleHoverImage = (galleryItem: ProductExpandedGallery) => {
    onColorClick(galleryItem.stock);
    setSelectedImage(galleryItem.img);
  };
  const { mutate, isLoading } = useMutation({
    mutationFn: () => productService.downloadFile(digitalFileId),
    onSuccess: async (res) => {
      const stream = await res.blob();
      const blob = new Blob([stream], {
        type: "application/octet-stream",
      });
      const filename = "download.zip";
      saveAs(blob, filename);
    },
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });
  return (
    <div className="flex items-center justify-between border-b border-gray-border relative group  ">
      <div className="absolute right-0 top-0">
        <ProductLike productId={data.id} />
      </div>
      <Link
        href={`/products/${data.uuid}${
          // eslint-disable-next-line no-nested-ternary
          params && params.length > 0
            ? `?${params}${selectedStock ? `&stock_id=${selectedStock.id}` : ""}`
            : selectedStock
            ? `?stock_id=${selectedStock.id}`
            : ""
        }`}
        className="flex items-center gap-7 h-full flex-1"
        scroll={false}
      >
        <div className="relative overflow-hidden rounded-3xl h-full md:aspect-[250/320] md:max-h-[320px] md:max-w-[250px] max-w-[150px] min-h-[220px] md:min-h-[320px]">
          <Image
            src={selectedImage}
            alt={data.translation?.title || "product"}
            className="object-cover block  transition-all group-hover:brightness-110 md:max-h-[320px]"
            height={320}
            width={250}
          />

          {selectedStock?.discount && (
            <div className="absolute top-4 left-4 z-[2] text-red">
              <DiscountIcon />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="md:text-[22px] text-lg font-medium line-clamp-1">
            {data.translation?.title}
          </div>
          <span className="md:text-base text-sm text-gray-field line-clamp-2 mt-3 md:h-12">
            {data.translation?.description}
          </span>
          <div className="flex items-center gap-3 mt-[18px]">
            <span className="md:text-base text-sm font-medium">
              <Translate value="reviews" /> ({data.r_count || 0})
            </span>
            <div className="flex items-center gap-1">
              <StarIcon />
              <span className="md:text-base text-sm font-semibold">{data.r_avg || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <strong className="text-xl font-semibold">
              <Price number={selectedStock?.total_price} />
            </strong>
            {selectedStock?.discount && (
              <span className="text-primary text-sm font-semibold line-through">
                <Price number={selectedStock?.price} />
              </span>
            )}
          </div>
          {hasColors && (
            <div className="hidden lg:block">
              <div className="text-lg font-medium mb-6 mt-5">
                <Translate value="colours" />
              </div>
              <div className="flex items-center gap-2.5">
                {gallery?.map((galleryItem) => (
                  <button
                    key={galleryItem.stock.id}
                    onMouseEnter={() => handleHoverImage(galleryItem)}
                  >
                    <Image
                      src={galleryItem.img}
                      alt={galleryItem.color?.value || ""}
                      width={90}
                      height={114}
                      className="rounded-[20px] object-contain w-[90px] h-[114px]"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Link>
      <div className="flex-col items-center gap-7 mt-7 hidden sm:flex">
        <div className="flex flex-col items-center">
          <strong className="text-[28px] font-bold">
            <Price number={selectedStock?.total_price} />
          </strong>
          {selectedStock?.discount && (
            <span className="text-primary text-xl font-semibold line-through">
              <Price number={selectedStock?.price} />
            </span>
          )}
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs font-medium">
            {t("sku")}: {selectedStock?.sku}
          </div>
          <div className="flex items-center gap-3">
            <FileCheckIcon />
            <span className="text-sm font-medium">
              {selectedStock?.quantity} <Translate value="in.stock" />
            </span>
          </div>
        </div>

        <Button loading={isLoading} onClick={() => mutate()} fullWidth color="black">
          {t("download")}
        </Button>
      </div>
    </div>
  );
};

export default DigitalCardUi;
