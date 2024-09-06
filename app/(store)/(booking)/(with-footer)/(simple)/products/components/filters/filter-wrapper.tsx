import { Translate } from "@/components/translate";
import React from "react";

interface FilterWrapperProps extends React.PropsWithChildren {
  title: string;
  subTitle?: string;
}

export const FilterWrapper = ({ title, subTitle, children }: FilterWrapperProps) => (
  <div className="border border-gray-border dark:border-gray-inputBorder rounded-2xl py-5 px-4">
    <div className="mb-4 flex flex-col">
      <strong className="text-base font-semibold">
        <Translate value={title} />
      </strong>
      <span className="text-xs text-field font-medium text-gray-field">
        <Translate value={subTitle || ""} />
      </span>
    </div>
    {children}
  </div>
);
