"use client";

import StarSmileIcon from "@/assets/icons/star-smile";
import { Button } from "@/components/button";
import { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/review";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ReviewCreateFormValues } from "@/types/review";
import { TextArea } from "@/components/text-area";
import { ImageUpload } from "@/components/image-upload";
import { ImageTypes } from "@/types/global";
import UploadLineIcon from "remixicon-react/UploadLineIcon";
import Image from "next/image";
import { IconButton } from "@/components/icon-button";
import TrashIcon from "@/assets/icons/trash";
import useUserStore from "@/global-store/user";
import { useSettings } from "@/hook/use-settings";

interface ReviewCreateProps {
  type: string;
  typeId?: number;
  onSubmit: (data: ReviewCreateFormValues) => void;
  isSubmitting?: boolean;
  buttonText?: string;
  buttonIcon?: React.ReactElement;
  isProduct?: boolean;
}

const schema = yup.object({
  comment: yup.string().required(),
  rating: yup.number().required(),
  images: yup.array().of(yup.string().required()),
});

const ReviewCreate = ({
  typeId,
  type,
  onSubmit,
  isSubmitting,
  buttonText = "send.review",
  buttonIcon,
  isProduct = true,
}: ReviewCreateProps) => {
  const { t } = useTranslation();
  const { currency } = useSettings();
  const user = useUserStore((state) => state.user);
  const { isLoading, isError, data } = useQuery(["canReview", type, typeId], () =>
    reviewService.checkCanReview({ type, type_id: typeId, currency_id: currency?.id })
  );
  const [isImageUploading, setIsImageUploading] = useState(false);
  const {
    register,
    setValue,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<ReviewCreateFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      rating: 0,
    },
  });

  if (!user) {
    return null;
  }

  if (isLoading || isError) {
    return null;
  }

  if (data?.data && data?.data.ordered && data?.data.added_review) {
    return null;
  }

  if (data?.data && !isProduct && data.data.added_review) {
    return null;
  }

  const handleRating = (rate: number) => {
    setValue("rating", rate);
  };
  const handleFormSubmit = (values: ReviewCreateFormValues) => {
    onSubmit(values);
  };
  const handleDelete = (key: number) => {
    setValue(
      "images",
      watch("images")?.filter((img, idx) => key !== idx)
    );
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="my-4 flex flex-col gap-4">
        <div className="flex items-center justify-between border border-gray-border dark:border-gray-bold rounded-2xl p-5">
          <span className="text-sm font-medium">
            {t("your.rating")} - {watch("rating") || 0} {t("out.of")} 5
          </span>
          <Rating
            onClick={handleRating}
            emptyStyle={{ display: "flex", gap: "15px" }}
            fillStyle={{ display: "flex", gap: "15px" }}
            initialValue={0}
            fillIcon={
              <div className="text-yellow">
                <StarSmileIcon size={25} />
              </div>
            }
            emptyIcon={<StarSmileIcon size={25} />}
          />
        </div>
        <TextArea
          {...register("comment")}
          placeholder={t("comment")}
          rows={3}
          error={errors.comment?.message}
        />
        <ImageUpload
          onChange={(image) =>
            setValue("images", watch("images") ? [...(watch("images") || []), image] : [image])
          }
          type={ImageTypes.REVIEW}
          setIsImageUploading={setIsImageUploading}
        >
          {({ handleClick, isLoading: isUploading }) => (
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={handleClick}
                className="border-gray-inputBorder rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-darkSegment md:aspect-[4/1] sm:aspect-[3/1] aspect-[2/1] border-dashed border flex items-center justify-center flex-col underline text-sm"
              >
                <UploadLineIcon />
                {t("upload.review.photo")}
              </button>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {watch("images")?.map((image, idx) => (
                  <div className="group relative rounded-md overflow-hidden" key={image}>
                    <div className="aspect-square">
                      <Image alt={image} src={image || ""} fill className="object-contain" />
                    </div>
                    <div className="absolute select-none opacity-0 group-hover:select-all group-hover:opacity-100 group-hover:z-10 top-0 left-0  w-full h-full flex items-center justify-center group-hover:bg-black group-hover:bg-opacity-20">
                      <IconButton color="white" size="small" onClick={() => handleDelete(idx)}>
                        <TrashIcon />
                      </IconButton>
                    </div>
                  </div>
                ))}
                {isUploading && (
                  <div className="aspect-square rounded-md bg-gray-200 animate-pulse" />
                )}
              </div>
            </div>
          )}
        </ImageUpload>
        <Button
          disabled={isImageUploading}
          leftIcon={buttonIcon}
          loading={isSubmitting}
          type="submit"
          color="black"
        >
          {t(buttonText)}
        </Button>
      </div>
    </form>
  );
};

export default ReviewCreate;
