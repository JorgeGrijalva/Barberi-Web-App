import { Service } from "@/types/service";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookingReviewFormValues } from "@/types/booking";
import { bookingService } from "@/services/booking";
import { error, success } from "@/components/alert";
import NetworkError from "@/utils/network-error";
import { useSettings } from "@/hook/use-settings";
import { Review, ReviewCreateFormValues, ReviewPermission } from "@/types/review";
import { reviewService } from "@/services/review";
import { DefaultResponse } from "@/types/global";
import { BookingReviewForm } from "./booking-review-form";

interface BookingReviewEditProps {
  service?: Service | null;
  bookingId?: number;
  onSuccess?: () => void;
  bookingParentId?: number;
  initialData: Review;
}

export const BookingReviewEdit = ({
  service,
  bookingId,
  onSuccess,
  bookingParentId,
  initialData,
}: BookingReviewEditProps) => {
  const { t } = useTranslation();
  const { language } = useSettings();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: (body: BookingReviewFormValues) => bookingService.createReview(bookingId, body),
    onSuccess: () => {
      success(t("review.successfully.changed"));
      queryClient.invalidateQueries(["appointment", bookingParentId, language?.locale]);
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });

  const { mutate: shopReviewCreate } = useMutation({
    mutationFn: (body: ReviewCreateFormValues) =>
      reviewService.createReview("shops", service?.shop_id, { ...body, type: "shop" }),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviewList", String(service?.shop_id), "shops"]);
      queryClient.invalidateQueries(["groupRating", "shops", service?.shop_id]);
      queryClient.setQueryData<DefaultResponse<ReviewPermission> | undefined>(
        ["canReview", "shop", service?.shop_id],
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

  const handleReviewCreate = (body: BookingReviewFormValues) => {
    mutate(body);
    shopReviewCreate(body);
  };
  return (
    <div>
      <div className="md:text-head text-xl font-semibold mb-7">{t("edit.review")}</div>
      <strong className="md:text-3xl text-2xl font-semibold">
        {t("rate.your.experience.at")} {service?.translation?.title}
      </strong>
      <BookingReviewForm
        isLoading={isLoading}
        onSubmit={handleReviewCreate}
        initialData={initialData}
      />
    </div>
  );
};
