"use client";

import { useMemo, useState } from "react";
import { ImageWithFallBack } from "@/components/image";
import { ProductGallery } from "@/types/product";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryContentProps {
  images?: ProductGallery[];
}

export const GalleryContent = ({ images }: GalleryContentProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageList = useMemo(() => images?.map((image) => image.preview || image.path), [images]);

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + (imageList?.length ?? 0)) % (imageList?.length ?? 0)
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (imageList?.length ?? 0));
  };

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
              setCurrentIndex(i);
              setIsOpenModal(true);
            }}
            className="w-full h-full"
          >
            <ImageWithFallBack
              src={galleryItem.preview || galleryItem.path}
              alt={galleryItem.title}
              fill
              className="object-cover"
            />
          </button>
        </div>
      ))}

      <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
        <DialogContent className="max-w-7xl  h-[80vh] w-[90%]">
          <div className="relative w-full h-full flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Button
              variant="ghost"
              size="icon"
              className="absolute z-50 left-2 top-1/2 -translate-y-1/2"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute z-50 right-2 top-1/2 -translate-y-1/2"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4 text-blue-500" />
            </Button>
            {imageList && (
              <div className="w-full h-full flex items-center justify-center">
                <ImageWithFallBack
                  src={imageList[currentIndex]}
                  alt={`Image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
