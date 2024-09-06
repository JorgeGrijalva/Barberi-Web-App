import React from "react";
import ReviewList from "@/app/(store)/(booking)/components/reviews/review-list";
import ReviewSummaryShort from "@/app/(store)/(booking)/components/reviews/review-summary-short";
import ShopReviewCreate from "../shop-reviw-create";

interface ShopReviewProps {
  id?: number;
}

const ShopReviewPanel = ({ id }: ShopReviewProps) => (
  <div className="grid grid-cols-7 gap-7 mb-4 mt-2">
    <div className="l:col-span-5 lg:col-span-4 col-span-7">
      <ReviewList title="reviews" type="shops" id={id?.toString()} />
    </div>
    <div className="lg:col-span-3 col-span-7 mb-8 md:mb-0">
      <ReviewSummaryShort type="shops" typeId={id} />
      <ShopReviewCreate id={id} />
    </div>
  </div>
);

export default ShopReviewPanel;
