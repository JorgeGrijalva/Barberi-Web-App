"use client";

import { Review } from "@/types/review";
import Image from "next/image";
import dayjs from "dayjs";
import StarIcon from "@/assets/icons/star";
import { useModal } from "@/hook/use-modal";
import { useMemo, useState } from "react";
import ImageViewer from "react-simple-image-viewer";
import { ProfilePlaceholder } from "../profile-placeholder";

export const ReviewCard = ({ data }: { data: Review }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageList = useMemo(
    () => data?.galleries?.map((image) => image.preview || image?.path) || [],
    [data?.galleries]
  );
  const [isPreviewModalOpen, openPreviewModal, closePreviewModal] = useModal();
  const handleOpenImagePreview = (index: number) => {
    setCurrentIndex(index);
    openPreviewModal();
  };

  return (
    <div className="pt-5 mb-6">
      <div className="flex items-center gap-2 mb-2.5">
        {data?.user?.img ? (
          <Image
            src={data.user?.img || ""}
            alt={data.user?.firstname || "user"}
            width={50}
            height={50}
            className="w-[50px] h-[50px] rounded-button object-cover"
          />
        ) : (
          <ProfilePlaceholder name={data?.user?.firstname} size={44} />
        )}
        <div>
          <span className="text-base font-medium">
            {data?.user?.firstname} {data?.user?.lastname}
          </span>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-gray-field">
              {dayjs(data.created_at).format("DD.MM.YYYY")}
            </span>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1">
              <span className="text-yellow">
                <StarIcon size={16} />
              </span>
              <span className="text-xs font-medium">{data?.rating}</span>
            </div>
          </div>
        </div>
      </div>
      <span className="text-base leading-7">{data?.comment}</span>
      <div className="flex items-center gap-3 mb-2.5">
        {data?.galleries?.map((img, i) => (
          <button type="button" onClick={() => handleOpenImagePreview(i)}>
            <Image
              key={img.id}
              src={img.path}
              alt={img.title || "review.img"}
              width={70}
              height={70}
              className="aspect-square object-contain"
            />
          </button>
        ))}
      </div>
      {isPreviewModalOpen && !!imageList?.length && (
        <ImageViewer
          src={imageList}
          onClose={closePreviewModal}
          disableScroll={false}
          currentIndex={currentIndex}
          closeOnClickOutside
          backgroundStyle={{ backgroundColor: "rgba(0, 0, 0, 0.9)" }}
        />
      )}
    </div>
  );
};
