"use client";

import ChevronRightIcon from "@/assets/icons/chevron-right";
import { Faq } from "@/types/info";
import { Disclosure, Transition } from "@headlessui/react";
import clsx from "clsx";
import React from "react";

interface QaProps {
  data: Faq;
}

export const Qa = ({ data }: QaProps) => (
  <Disclosure>
    {({ open }) => (
      <div className={clsx("w-full border-b border-gray-link")}>
        <Disclosure.Button className="text-start flex items-center justify-between w-full md:py-7 py-4 md:text-head text-sm font-medium">
          {data.translation?.question}
          <div className={clsx(open ? "rotate-[270deg]" : "rotate-90", "transition-all")}>
            <ChevronRightIcon />
          </div>
        </Disclosure.Button>
        <Transition
          show={open}
          enter="transition ease duration-500 transform"
          enterFrom="opacity-0 -translate-y-12"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease duration-300 transform"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-12"
        >
          <Disclosure.Panel static>
            <div className="pb-6 text-gray-field md:font-xl text-sm">
              {data.translation?.answer}
            </div>
          </Disclosure.Panel>
        </Transition>
      </div>
    )}
  </Disclosure>
);
