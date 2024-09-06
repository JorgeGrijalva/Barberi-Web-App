"use client";

import useCompareStore from "@/global-store/compare";
import { Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface ProductNotifierProps {
  id?: number;
}

const ProductCompareNotifier = ({ id }: ProductNotifierProps) => {
  const { t } = useTranslation();
  const compareList = useCompareStore((state) => state.ids);
  const isInList = compareList.includes(id || -1);
  return (
    <Transition
      show={isInList}
      enter="transform transition duration-[400ms]"
      enterFrom="opacity-0  -translate-y-2"
      enterTo="opacity-100 -translate-y-0"
      leave="transform duration-200 transition ease-in-out"
      leaveFrom="opacity-100  -translate-y-0"
      leaveTo="opacity-0 -translate-y-2"
    >
      <div className="bg-primary py-1  mb-6">
        <div className="flex items-center gap-4 xl:container px-2 md:px-4 justify-between">
          <span className="text-white text-sm font-medium">{t("item.added.to.compare.list")}</span>
          <Link href="/compare" className="text-white text-base underline">
            {t("see")}
          </Link>
        </div>
      </div>
    </Transition>
  );
};

export default ProductCompareNotifier;
