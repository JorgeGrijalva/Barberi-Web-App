"use client";

import React from "react";
import { useLike } from "@/hook/use-like";
import { Heart } from "lucide-react";
import { IconButton } from "../icon-button";

interface ProductLikeProps {
  productId: number;
}

export const ProductLike = ({ productId }: ProductLikeProps) => {
  const { isLiked, handleLikeDisLike } = useLike("product", productId);
  return (
    <IconButton aria-label="like or dislike" onClick={() => handleLikeDisLike()}>
      {!isLiked ? (
        <Heart color="#ffffff" fill="#ffffff" />
      ) : (
        <Heart color="#E34F26" fill="#E34F26" size={26} />
      )}
    </IconButton>
  );
};
