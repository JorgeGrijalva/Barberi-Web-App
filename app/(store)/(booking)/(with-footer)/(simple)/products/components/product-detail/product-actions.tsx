import { Button } from "@/components/button";
import CompareIcon from "@/assets/icons/compare";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLike } from "@/hook/use-like";
import useCompareStore from "@/global-store/compare";
import { Heart } from "lucide-react";

export const ProductActions = ({ id }: { id?: number }) => {
  const { isLiked, handleLikeDisLike } = useLike("product", id);
  const addToOrRemoveFromCompareList = useCompareStore((state) => state.addOrRemove);
  const { t } = useTranslation();
  if (!id) {
    return null;
  }
  return (
    <div className="flex items-center justify-end gap-3 lg:mb-10 lg:mt-0 mt-4 mb-4">
      <Button
        onClick={() => handleLikeDisLike()}
        color="gray"
        size="xsmall"
        leftIcon={
          isLiked ? (
            <Heart color="#ffffff" fill="#ffffff" />
          ) : (
            <Heart color="#E34F26" fill="#E34F26" size={26} />
          )
        }
      >
        {t("favorites")}
      </Button>
      <Button
        size="xsmall"
        color="gray"
        leftIcon={<CompareIcon />}
        onClick={() => addToOrRemoveFromCompareList(id)}
      >
        {t("compare")}
      </Button>
    </div>
  );
};
