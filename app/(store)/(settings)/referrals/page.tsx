"use client";

import { useQuery } from "@tanstack/react-query";
import { infoService } from "@/services/info";
import Image from "next/image";
import { userService } from "@/services/user";
import useUserStore from "@/global-store/user";
import { useTranslation } from "react-i18next";
import { Price } from "@/components/price";
import { Button } from "@/components/button";
import { error, success, warning } from "@/components/alert";
import Link from "next/link";
import { useSettings } from "@/hook/use-settings";

const ReferralsPage = () => {
  const { t } = useTranslation();
  const { language, currency } = useSettings();
  const user = useUserStore((state) => state.user);
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userService.profile(),
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: !!user,
  });
  const { data: referrals } = useQuery(
    ["referrals", language?.locale, currency?.id],
    () => infoService.referrals({ lang: language?.locale, currency_id: currency?.id }),
    {
      suspense: true,
    }
  );

  const copyToClipBoard = async () => {
    if (!user) {
      warning(t("login.first"));
      return;
    }
    try {
      await navigator.clipboard.writeText(user?.my_referral || "");
      success(t("copied"));
    } catch (err) {
      error("Failed to copy!");
    }
  };

  const shareReferral = async () => {
    if (!user) {
      warning(t("login.first"));
      return;
    }
    try {
      await navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_WEBSITE_URL}/sign-up?referral_code=${user?.my_referral}`
      );
      success(t("copied"));
    } catch (err) {
      error("Failed to copy!");
    }
  };

  return (
    <div className="grid sm:grid-cols-2 gap-7">
      <div className="relative h-96 w-full">
        <Image
          src={referrals?.data.img || "img"}
          alt={referrals?.data.translation?.title || "referral"}
          className="rounded-xl object-cover"
          fill
        />
      </div>
      <div className="flex flex-col justify-between gap-8">
        <div>
          <h1 className="text-3xl font-semibold">{referrals?.data.translation?.title}</h1>
          <p className="text-sm mt-2">
            {referrals?.data.translation?.description}{" "}
            <Link className="underline" href="/referral-terms">
              {t("referral.terms")}
            </Link>
          </p>
          <div className="h-px bg-gray-inputBorder w-full my-4" />
          <div className="flex flex-col gap-4">
            <span className="text-base font-medium">
              {t("balance")}: <Price number={profile?.data.referral_from_topup_price} />
            </span>
            <span className="text-base font-medium">
              {t("referrals")}: <Price number={profile?.data.referral_from_topup_count} />
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={copyToClipBoard} fullWidth>
            {t("share")}
          </Button>
          <Button onClick={shareReferral} fullWidth color="blackOutlined">
            {t("copy.code")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
