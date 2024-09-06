"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/review";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { useSettings } from "@/hook/use-settings";
import { ReviewCard } from "./review-card";

interface ReviewListProps {
  type: string;
  id?: string;
  title?: string;
}

const EmptyList = dynamic(() =>
  import("./empty-list").then((component) => ({ default: component.EmptyList }))
);

const ReviewList = ({ id, type, title }: ReviewListProps) => {
  const { t } = useTranslation();
  const { currency } = useSettings();
  const { data, isLoading } = useQuery(
    ["reviewList", id, type],
    () => reviewService.getAllReviews(type, id, { column: "user", currency_id: currency?.id }),
    {
      enabled: !!id,
    }
  );
  if (data?.data && data.data.length === 0) {
    return <EmptyList title={title} />;
  }
  if (isLoading) {
    return (
      <div className="animate-pulse">
        {!!title && <div className="text-lg font-semibold">{t(title)}</div>}
        <div>
          <div className="flex items-center gap-2.5 mt-4">
            <div className="w-11 h-11 rounded-full bg-gray-300" />
            <div>
              <div className="h-4 rounded-full w-60 bg-gray-300" />
              <div className="h-3 mt-2 rounded-full w-40 bg-gray-300" />
            </div>
          </div>
          <div className="h-3 rounded-full bg-gray-300 w-full mt-3" />
          <div className="h-3 rounded-full bg-gray-300 w-3/5 mt-2" />
        </div>
        <div>
          <div className="flex items-center gap-2.5 mt-4">
            <div className="w-11 h-11 rounded-full bg-gray-300" />
            <div>
              <div className="h-4 rounded-full w-60 bg-gray-300" />
              <div className="h-3 mt-2 rounded-full w-40 bg-gray-300" />
            </div>
          </div>
          <div className="h-3 rounded-full bg-gray-300 w-full mt-3" />
          <div className="h-3 rounded-full bg-gray-300 w-3/5 mt-2" />
        </div>
      </div>
    );
  }
  return (
    <div>
      {!!title && (
        <div className="text-lg font-semibold ">
          {t(title)} {data?.data.length || 0}
        </div>
      )}
      <div className="flex flex-col gap-1">
        {data?.data.map((review) => (
          <ReviewCard data={review} key={review.id} />
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
