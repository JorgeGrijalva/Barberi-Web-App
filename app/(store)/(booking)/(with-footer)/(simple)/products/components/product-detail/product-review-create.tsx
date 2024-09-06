import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewCreateFormValues, ReviewPermission } from "@/types/review";
import { reviewService } from "@/services/review";
import ReviewCreate from "@/app/(store)/(booking)/components/reviews/create-review";
import { useCallback } from "react";
import { DefaultResponse } from "@/types/global";

interface ProductReviewCreateProps {
  id?: number;
  uuid?: string;
}

export const ProductReviewCreate = ({ id, uuid }: ProductReviewCreateProps) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: (body: ReviewCreateFormValues) =>
      reviewService.createReview("products", uuid, { ...body, type: "product" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviewList", uuid, "products"]);
      queryClient.invalidateQueries(["groupRating", "products", id]);
      queryClient.setQueryData<DefaultResponse<ReviewPermission> | undefined>(
        ["canReview", "product", id],
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
    <ReviewCreate type="product" typeId={id} onSubmit={handleSubmit} isSubmitting={isLoading} />
  );
};

export default ProductReviewCreate;
