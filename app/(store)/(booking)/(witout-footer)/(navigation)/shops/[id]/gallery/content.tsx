"use client";

import { useModal } from "@/hook/use-modal";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { ImageWithFallBack } from "@/components/image";
import { ProductGallery } from "@/types/product";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

interface GalleryContentProps {
  images?: ProductGallery[];
}

export const GalleryContent = ({ images }: GalleryContentProps) => {
  const [isFullScreen, openFullScreen, closeFullScreen] = useModal();
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageList = useMemo(() => images?.map((image) => image.preview || image.path), [images]);

  return (
    <div className="grid grid-cols-6 xl:gap-7 md:gap-4 gap-2 pb-7">
      {images?.map((galleryItem, i) => (
        <div
          className={clsx(
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
              openFullScreen();
              setCurrentIndex(i);
            }}
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

      {isFullScreen && imageList && (
        <Lightbox
          mainSrc={imageList[currentIndex]}
          nextSrc={imageList[(currentIndex + 1) % imageList.length]}
          prevSrc={imageList[(currentIndex + imageList.length - 1) % imageList.length]}
          onCloseRequest={closeFullScreen}
          onMovePrevRequest={() =>
            setCurrentIndex((currentIndex + imageList.length - 1) % imageList.length)
          }
          onMoveNextRequest={() => setCurrentIndex((currentIndex + 1) % imageList.length)}
        />
      )}
    </div>
  );
};
