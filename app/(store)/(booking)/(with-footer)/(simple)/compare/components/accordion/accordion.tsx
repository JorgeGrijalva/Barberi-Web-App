"use client";

import React from "react";
import { Disclosure } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import AnchorDownIcon from "@/assets/icons/anchor-down";
import clsx from "clsx";

interface CompareAccordionProps extends React.PropsWithChildren {
  title: string;
}
export const CompareAccordion = ({ title, children }: CompareAccordionProps) => {
  const { t } = useTranslation();
  return (
    <Disclosure defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button className="py-2 inline-flex items-center mb-4 text-lg gap-2">
            {t(title)}{" "}
            <AnchorDownIcon className={clsx(open && "rotate-180 transform", "transition-all")} />
          </Disclosure.Button>
          <Disclosure.Panel>{children}</Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
