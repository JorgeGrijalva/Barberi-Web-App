"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewCreateFormValues, ReviewPermission } from "@/types/review";
import { reviewService } from "@/services/review";
import { useCallback } from "react";
import { DefaultResponse } from "@/types/global";
import dynamic from "next/dynamic";
import useUserStore from "@/global-store/user";

const ReviewCreate = dynamic(
  () => import("@/app/(store)/(booking)/components/reviews/create-review")
);

interface ProductReviewCreateProps {
  id?: number;
}

export const BlogReviewCreate = ({ id }: ProductReviewCreateProps) => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const { mutate, isLoading } = useMutation({
    mutationFn: (body: ReviewCreateFormValues) =>
      reviewService.createReview("blogs", id, { ...body, type: "blog" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviewList", String(id), "blogs"]);
      queryClient.invalidateQueries(["groupRating", "blogs", id]);
      queryClient.setQueryData<DefaultResponse<ReviewPermission> | undefined>(
        ["canReview", "blog", id],
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

  if (!user) return null;

  return (
    <ReviewCreate
      type="blog"
      isProduct={false}
      typeId={id}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
    />
  );
};

export default BlogReviewCreate;
