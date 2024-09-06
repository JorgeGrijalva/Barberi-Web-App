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
      <div className={clsx("bg-gray-faq dark:bg-gray-darkSegment rounded-2xl w-full ")}>
        <Disclosure.Button className="text-start py-6 px-5 flex items-center justify-between w-full text-sm">
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
            <div className="px-5 pb-6">{data.translation?.answer}</div>
          </Disclosure.Panel>
        </Transition>
      </div>
    )}
  </Disclosure>
);
