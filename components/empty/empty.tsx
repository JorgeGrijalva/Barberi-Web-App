"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import animationData from "@/public/lottie/empty_review.json";
import Image from "next/image";
import dynamic from "next/dynamic";
import clsx from "clsx";

const AnimatedContent = dynamic(() => import("../animated-content"));

interface EmptyProps {
  text?: string;
  animated?: boolean;
  imagePath?: string;
  description?: string;
  smallText?: boolean;
}

export const Empty = ({ text, imagePath, description, animated = true, smallText }: EmptyProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center py-4">
      <div className="max-w-2xl flex flex-col items-center gap-3">
        {animated ? (
          <AnimatedContent animationData={animationData} />
        ) : (
          <Image
            src={imagePath || "/img/empty_salon.png"}
            alt="empty_cart"
            className="max-w-[400px]"
            width={300}
            height={400}
          />
        )}
        <p className={clsx("font-semibold", smallText ? "text-xl" : "text-4xl")}>
          {t(text || "there.is.no.items")}
        </p>
        {!!description && <span className="text-lg">{t(description)}</span>}
      </div>
    </div>
  );
};
