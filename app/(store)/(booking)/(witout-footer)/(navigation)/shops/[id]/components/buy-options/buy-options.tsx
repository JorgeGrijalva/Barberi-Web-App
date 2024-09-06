"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import PresentIcon from "@/assets/icons/present";
import MarkIcon from "@/assets/icons/mark";
import Link from "next/link";

export const BuyOptions = ({ shopSlug, shopId }: { shopSlug?: string; shopId?: number }) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-button py-5 px-5 border border-gray-link">
      <h2 className="text-[22px] font-semibold">{t("buy.options")}</h2>
      <div className="flex items-cetner gap-2.5 mt-5">
        <Button
          fullWidth
          color="blackOutlined"
          size="medium"
          leftIcon={<PresentIcon />}
          as={Link}
          href={`/shops/${shopSlug}/gift-cards?shopId=${shopId}`}
        >
          {t("gift.card")}
        </Button>

        <Button
          fullWidth
          color="blackOutlined"
          size="medium"
          leftIcon={<MarkIcon />}
          as={Link}
          href={`/shops/${shopSlug}/memberships?shopId=${shopId}`}
        >
          {t("membership")}
        </Button>
      </div>
    </div>
  );
};
