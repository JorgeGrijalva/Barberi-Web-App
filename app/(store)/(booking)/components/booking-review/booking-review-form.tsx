import { useForm } from "react-hook-form";
import { Rating } from "react-simple-star-rating";
import StarSmileIcon from "@/assets/icons/star-smile";
import { TextArea } from "@/components/text-area";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/button";
import { BookingReviewFormValues } from "@/types/booking";
import { Review } from "@/types/review";
import Image from "next/image";
import clsx from "clsx";

type Feature = Record<
  string,
  {
    icon: string;
    selected?: boolean;
  }
>;

const features: Feature = {
  cleanliness: { icon: "/icons/clean.svg" },
  masters: { icon: "/icons/masters.svg" },
  location: { icon: "/icons/location.svg" },
  price: { icon: "/icons/price.svg" },
  interior: { icon: "/icons/interior.svg" },
  service: { icon: "/icons/quality.svg" },
  communication: { icon: "/icons/communication.svg" },
  equipment: { icon: "/icons/equipment.svg" },
};

const schema = yup.object({
  comment: yup.string().required(),
  rating: yup.number().required(),
});

interface BookingReviewFormProps {
  onSubmit: (values: BookingReviewFormValues) => void;
  isLoading?: boolean;
  initialData?: Review | null;
}

export const BookingReviewForm = ({ onSubmit, isLoading, initialData }: BookingReviewFormProps) => {
  const { t } = useTranslation();
  const [featureList, setFeatureList] = useState(
    initialData
      ? {
          cleanliness: { icon: "/icons/clean.svg", selected: initialData.cleanliness },
          masters: { icon: "/icons/masters.svg", selected: initialData.masters },
          location: { icon: "/icons/location.svg", selected: initialData.location },
          price: { icon: "/icons/price.svg", selected: initialData.price },
          interior: { icon: "/icons/interior.svg", selected: initialData.interior },
          service: { icon: "/icons/quality.svg", selected: initialData.service },
          communication: { icon: "/icons/communication.svg", selected: initialData.communication },
          equipment: { icon: "/icons/equipment.svg", selected: initialData.equipment },
        }
      : features
  );
  const {
    setValue,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<BookingReviewFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      rating: initialData?.rating || 0,
      comment: initialData?.comment,
    },
  });

  const handleFormComplete = (values: BookingReviewFormValues) => {
    const tempValues = {
      ...values,
      cleanliness: featureList.cleanliness.selected,
      masters: featureList.masters.selected,
      location: featureList.location.selected,
      price: featureList.price.selected,
      interior: featureList.interior.selected,
      service: featureList.service.selected,
      communication: featureList?.communication.selected,
      equipment: featureList.equipment.selected,
    };
    onSubmit(tempValues);
  };
  const handleRating = (rate: number) => {
    setValue("rating", rate);
  };

  const handleSelectFeature = (feature: keyof typeof features) => {
    setFeatureList((oldValues) => ({
      ...oldValues,
      [feature]: { ...oldValues[feature], selected: !oldValues[feature].selected },
    }));
  };
  return (
    <form onSubmit={handleSubmit(handleFormComplete)}>
      <div className="flex flex-col justify-center items-center w-full my-5">
        <Rating
          onClick={handleRating}
          emptyStyle={{ display: "flex", gap: "15px" }}
          fillStyle={{ display: "flex", gap: "15px" }}
          initialValue={initialData?.rating || 0}
          fillIcon={
            <div className="text-yellow">
              <StarSmileIcon size={25} />
            </div>
          }
          emptyIcon={<StarSmileIcon size={25} />}
        />
      </div>
      <div className="grid grid-cols-3 md:gap-5 gap-2 my-7">
        {Object.entries(featureList).map(([key, value]) => (
          <button
            key={key}
            type="button"
            onClick={() => handleSelectFeature(key)}
            className={clsx(
              "rounded-button flex flex-col items-center gap-2.5 p-2.5 bg-gray-link hover:bg-gray-segment",
              value.selected && "bg-yellow hover:bg-yellow"
            )}
          >
            <Image src={value.icon} alt={key} width={40} height={40} />
            <span className="text-sm">{t(key)}</span>
          </button>
        ))}
      </div>
      <TextArea
        {...register("comment")}
        placeholder={t("comment")}
        rows={3}
        error={errors.comment?.message}
      />
      <Button className="mt-5" fullWidth loading={isLoading}>
        {t("save")}
      </Button>
    </form>
  );
};
