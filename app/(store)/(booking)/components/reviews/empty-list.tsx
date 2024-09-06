import { useTranslation } from "react-i18next";
import AnimatedContent from "@/components/animated-content";
import * as animationData from "@/public/lottie/empty_review.json";
import React from "react";

export const EmptyList = ({ title }: { title?: string }) => {
  const { t } = useTranslation();
  return (
    <div>
      {!!title && <div className="text-lg font-semibold">{t(title)}</div>}
      <div className="flex justify-center">
        <div className="max-w-[300px]">
          <AnimatedContent width={300} animationData={animationData} />
        </div>
      </div>
    </div>
  );
};
