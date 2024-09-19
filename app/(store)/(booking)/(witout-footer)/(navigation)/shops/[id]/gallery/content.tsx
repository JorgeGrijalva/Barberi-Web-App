"use client";

// import { useMemo, useState } from "react";
import { ProductGallery } from "@/types/product";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { DefaultResponse } from "@/types/global";
import { ShopGallery } from "@/types/shop";

interface GalleryContentProps {
  images?: ProductGallery[];
  gallery: DefaultResponse<ShopGallery>;
}

const GalleryContent = ({ images, gallery }: GalleryContentProps) => {
  console.log(images, gallery);
  return (
    <div className="grid grid-cols-6 xl:gap-7 md:gap-4 gap-2 pb-7">
      {images?.map((galleryItem, i) => (
        <div
          className={cn(
            "relative rounded-button overflow-hidden",
            i % 4 === 0 && "col-span-4 row-span-2 aspect-[881/564]",
            i % 4 === 1 && "col-span-2 row-span-2",
            i % 4 === 2 && "col-span-2 aspect-[427/378]",
            i % 4 === 3 && "col-span-4"
          )}
          key={galleryItem.id}
        >
          <button
            onClick={() => {
              // setCurrentIndex(i);
              // setIsOpenModal(true);
            }}
            className="w-full h-full"
          >
            <Image
              src={galleryItem.preview || galleryItem.path}
              alt={galleryItem.title}
              fill
              className="object-cover"
            />
          </button>
        </div>
      ))}
    </div>
  );
};

export default GalleryContent;
