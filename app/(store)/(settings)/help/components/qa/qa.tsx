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

        {/*
      Use the `Transition` + `open` render prop argument to add transitions.
    */}
        <Transition
          show={open}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          {/*
        Don't forget to add `static` to your `Disclosure.Panel`!
      */}
          <Disclosure.Panel static>
            <div className="px-5 pb-6">{data.translation?.answer}</div>
          </Disclosure.Panel>
        </Transition>
      </div>
    )}
  </Disclosure>
);
