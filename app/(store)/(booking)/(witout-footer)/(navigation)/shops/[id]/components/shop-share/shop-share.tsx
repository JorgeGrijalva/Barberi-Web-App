"use client";

import { Shop } from "@/types/shop";
import { useTranslation } from "react-i18next";
import { ImageWithFallBack } from "@/components/image";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";

interface ShopShareProps {
  data?: Shop;
}

export const ShopShare = ({ data }: ShopShareProps) => {
  const { t } = useTranslation();
  const shareUrl = window.location.href;
  const title = data?.translation?.title;
  return (
    <div className="sm:px-6 py-6 px-4">
      <div className="md:text-head text-xl font-semibold">{t("share.this.shop")}</div>
      <div className="flex gap-2.5 my-7">
        <div className="relative w-24 h-24 aspect-square">
          <ImageWithFallBack
            src={data?.logo_img || ""}
            alt={data?.translation?.title || "shop"}
            fill
            className="rounded-button object-cover"
          />
        </div>
        <div>
          <div className="text-base font-medium">{data?.translation?.title}</div>
          <span className="text-gray-field text-sm">{data?.translation?.address}</span>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <div className="Demo__some-network">
          <FacebookShareButton url={shareUrl} className="Demo__some-network__share-button">
            <FacebookIcon size={32} round />
          </FacebookShareButton>
        </div>

        <div className="Demo__some-network">
          <TwitterShareButton
            url={shareUrl}
            title={title}
            className="Demo__some-network__share-button"
          >
            <XIcon size={32} round />
          </TwitterShareButton>
        </div>

        <div className="Demo__some-network">
          <TelegramShareButton
            url={shareUrl}
            title={title}
            className="Demo__some-network__share-button"
          >
            <TelegramIcon size={32} round />
          </TelegramShareButton>
        </div>

        <div className="Demo__some-network">
          <WhatsappShareButton
            url={shareUrl}
            title={title}
            separator=":: "
            className="Demo__some-network__share-button"
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>

        <div className="Demo__some-network">
          <LinkedinShareButton url={shareUrl} className="Demo__some-network__share-button">
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>

        <div className="Demo__some-network">
          <RedditShareButton
            url={shareUrl}
            title={title}
            windowWidth={660}
            windowHeight={460}
            className="Demo__some-network__share-button"
          >
            <RedditIcon size={32} round />
          </RedditShareButton>
        </div>

        <div className="Demo__some-network">
          <EmailShareButton
            url={shareUrl}
            subject={title}
            body="body"
            className="Demo__some-network__share-button"
          >
            <EmailIcon size={32} round />
          </EmailShareButton>
        </div>
      </div>
    </div>
  );
};
