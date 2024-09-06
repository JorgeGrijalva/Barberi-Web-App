"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewCreateFormValues, ReviewPermission } from "@/types/review";
import { reviewService } from "@/services/review";
import { useCallback } from "react";
import { DefaultResponse } from "@/types/global";
import ReviewCreate from "@/app/(store)/(booking)/components/reviews/create-review";

interface ShopReviewCreateProps {
  id?: number;
}

export const ShopReviewCreate = ({ id }: ShopReviewCreateProps) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: (body: ReviewCreateFormValues) =>
      reviewService.createReview("shops", id, { ...body, type: "shop" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviewList", String(id), "shops"]);
      queryClient.invalidateQueries(["groupRating", "shops", id]);
      queryClient.setQueryData<DefaultResponse<ReviewPermission> | undefined>(
        ["canReview", "shop", id],
        (old) => {
          if (!old)
            return {
              data: { ordered: true, added_review: true },
              message: "success",
              status: true,
              timestamp: "",
            };
          return { ...old, data: { ordered: true, added_review: true } };
        }
      );
    },
  });

  const handleSubmit = useCallback((body: ReviewCreateFormValues) => {
    mutate(body);
  }, []);

  return (
    <ReviewCreate
      type="shop"
      isProduct={false}
      typeId={id}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
    />
  );
};

export default ShopReviewCreate;
