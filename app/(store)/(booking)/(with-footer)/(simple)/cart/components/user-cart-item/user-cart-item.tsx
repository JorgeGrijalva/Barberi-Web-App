import { UserCart } from "@/types/cart";
import { Disclosure } from "@headlessui/react";
import ChevronRightIcon from "@/assets/icons/chevron-right";
import React from "react";
import useCartStore from "@/global-store/cart";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import clsx from "clsx";
import useUserStore from "@/global-store/user";
import { ProfilePlaceholder } from "@/components/profile-placeholder";
import { useSettings } from "@/hook/use-settings";
import { CartItem } from "../cart-item";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

interface UserCartItemProps {
  data: UserCart;
  ownerId?: number;
}

export const UserCartItem = ({ data, ownerId }: UserCartItemProps) => {
  const userCartUuid = useCartStore((state) => state.userCartUuid);
  const { t } = useTranslation();
  const productList = data?.cartDetails.flatMap((detail) => detail.cartDetailProducts);
  const { settings } = useSettings();
  const user = useUserStore((state) => state.user);
  return (
    <Disclosure defaultOpen={productList?.length !== 0}>
      {({ open }) => (
        <>
          <Disclosure.Button
            className={clsx(
              "flex w-full justify-between items-center rounded-lg bg-gray-bg px-4 py-2 text-left text-sm font-medium hover:brightness-90 transition-all focus-ring  dark:bg-gray-darkSegment",
              (settings?.ui_type === "3" || settings?.ui_type === "4") && "dark:bg-darkBg"
            )}
          >
            <div className="flex items-center gap-2">
              <ProfilePlaceholder size={40} name={data.name || ""} />
              <span>
                {data.name} {userCartUuid === data.uuid && `(${t("you")})`}{" "}
                {data?.user_id === ownerId && `(${t("owner")})`}
              </span>
            </div>
            <ChevronRightIcon
              className={`${open ? "-rotate-90 transform" : "rotate-90"} transition-all h-5 w-5`}
            />
          </Disclosure.Button>
          <Disclosure.Panel>
            <div className="flex flex-col lg:col-span-5 col-span-7 gap-7 ">
              {productList?.length === 0 ? (
                <Empty animated={false} />
              ) : (
                data.cartDetails.map((detail) => (
                  <CartItem
                    data={detail}
                    key={detail.id}
                    cartUuid={data.uuid}
                    userId={data.user_id}
                    showCoupon={user?.id === ownerId && user?.id === data?.user_id}
                  />
                ))
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
