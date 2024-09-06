"use client";

import { ShopSocial } from "@/types/shop";
import React from "react";
import { useTranslation } from "react-i18next";
import { socialIcons } from "@/config/social-icons";

interface ShopSocialsPanelProps {
  list?: ShopSocial[];
}

export const ShopSocialsPanel = ({ list }: ShopSocialsPanelProps) => {
  const { t } = useTranslation();
  return (
    <div className="md:px-5 py-5 px-2">
      <h5 className="text-[22px] font-semibold">{t("shop.socials")}</h5>
      <div className="grid md:grid-cols-5 grid-cols-4 gap-4 mt-6">
        {list?.map((social) => {
          const Icon = socialIcons[social.type];
          return (
            <a href={social.content} target="_blank" rel="noreferrer">
              <div key={social.id} className="flex flex-col items-center gap-1">
                <Icon />
                <span className="text-sm font-medium">{social.type}</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
