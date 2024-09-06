import { Translate } from "@/components/translate";
import React from "react";
import { Disclosure, Transition } from "@headlessui/react";
import AnchorDownIcon from "@/assets/icons/anchor-down";

interface FilterWrapperProps extends React.PropsWithChildren {
  title: string;
  subTitle?: string;
  defaultOpen?: boolean;
}

export const ExpandableFilterWrapper = ({
  title,
  subTitle,
  children,
  defaultOpen,
}: FilterWrapperProps) => (
  <div className="border border-gray-link dark:border-gray-inputBorder rounded-2xl py-[18px] px-[14px] overflow-hidden">
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <Disclosure.Button className="flex w-full justify-between rounded-lg outline-none focus-ring ring-offset-2">
            <div className="mb-4 flex flex-col items-start">
              <strong className="text-base font-semibold">
                <Translate value={title} />
              </strong>
              <span className="text-xs text-field font-medium text-gray-field">
                <Translate value={subTitle || ""} />
              </span>
            </div>
            <AnchorDownIcon
              className={`${open ? "rotate-180 transform" : ""} h-5 w-5 transition-all`}
            />
          </Disclosure.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel static>
              <div className="max-h-80 overflow-y-auto relative">{children}</div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  </div>
);
