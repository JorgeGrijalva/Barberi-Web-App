"use client";

import { Property } from "@/types/product";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { groupPropertiesToCompare } from "@/utils/group-properties-to-compare";
import { CompareAccordion } from "../accordion";

interface CompareAdditionalInfoProps {
  properties?: Property[];
  productIds?: number[];
}

export const AdditionalInfo = ({ properties, productIds }: CompareAdditionalInfoProps) => {
  const { t } = useTranslation();
  const groupedProperties = useMemo(() => groupPropertiesToCompare(properties), [properties]);
  const noInfo = t("no.info");

  if (properties && properties.length === 0) {
    return null;
  }

  return (
    <CompareAccordion title="additional.info">
      {groupedProperties?.map((groupedProperty) => (
        <div
          className="flex items-center gap-7 border-t border-gray-border py-2.5 dark:border-gray-bold overflow-x-auto"
          key={groupedProperty.group?.id}
        >
          <div>
            <span className="text-sm text-gray-field font-medium">
              {groupedProperty.group?.translation?.title}
            </span>
            <div className="flex items-center gap-7 mt-2">
              {productIds?.map((productId) => (
                <div className="max-w-compareWidth w-[200px]" key={productId}>
                  <span className="text-base font-medium">
                    {groupedProperty?.values?.[productId]?.value || noInfo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </CompareAccordion>
  );
};
