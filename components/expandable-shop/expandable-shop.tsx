import { Shop } from "@/types/shop";
import { Disclosure } from "@headlessui/react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import ChevronRightIcon from "@/assets/icons/chevron-right";
import React from "react";
import { useTranslation } from "react-i18next";
import VerifiedIcon from "@/assets/icons/verified";

interface ExpandableShopProps extends React.PropsWithChildren {
  shop?: Shop;
  defaultOpen?: boolean;
  extra?: React.ReactElement;
  showEstimatedTime?: boolean;
}

export const ExpandableShop = ({
  shop,
  defaultOpen,
  children,
  extra,
  showEstimatedTime,
}: ExpandableShopProps) => {
  const { t } = useTranslation();
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={clsx(
              "flex w-full justify-between items-center rounded-xl  py-2 text-left text-sm font-medium hover:brightness-90 transition-all focus-ring "
            )}
          >
            <div className="flex gap-2 items-center">
              <Link href={`/shops/${shop?.slug}`} className="flex items-center gap-2">
                <div className="w-11 h-11 relative">
                  <Image
                    src={shop?.logo_img || ""}
                    alt={shop?.translation?.title || "shop"}
                    className="rounded-full object-cover w-11 h-11"
                    fill
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className={clsx(shop?.verify && "line-clamp-1")}>
                      {shop?.translation?.title}
                    </span>
                    {shop?.verify && (
                      <span>
                        <VerifiedIcon size={16} />
                      </span>
                    )}
                  </div>
                  {showEstimatedTime && shop?.delivery_time && (
                    <span className="text-xs text-gray-field">
                      ({t("est.from")} {shop?.delivery_time.from} {t("est.to")}{" "}
                      {shop?.delivery_time.to} {t(shop.delivery_time.type)})
                    </span>
                  )}
                </div>
              </Link>
              {extra}
            </div>
            <ChevronRightIcon
              className={`${open ? "-rotate-90 transform" : "rotate-90"} transition-all h-5 w-5`}
            />
          </Disclosure.Button>
          <Disclosure.Panel>{children}</Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
