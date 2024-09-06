import { ExtraGroup, ExtraValue, Stock } from "@/types/product";

interface GroupedExtras {
  group: ExtraGroup;
  values: { data: ExtraValue; stock: Stock }[];
}

export const groupExtras = (stocks?: Stock[], selectedStock?: Stock) => {
  const groupedExtras: GroupedExtras[] = [];
  const combinations: ExtraValue[] = [];

  stocks?.forEach((stock) => {
    stock.extras.forEach((extra, i) => {
      const stockImage = stocks?.find((stockItem) =>
        stockItem?.extras?.some((extraItem) => extraItem.extra_value_id === extra.extra_value_id)
      )?.galleries?.[0]?.path;
      const tempExtraValue = extra.value;
      if (stockImage) {
        tempExtraValue.img = stockImage;
      }
      const includesGroupIndex = groupedExtras.findIndex(
        (groupedExtra) => groupedExtra.group.id === extra.extra_group_id
      );
      if (i === 0) {
        if (groupedExtras.some((groupedExtra) => groupedExtra.group.id === extra.extra_group_id)) {
          if (
            !groupedExtras[includesGroupIndex].values.some(
              (includesValue) => includesValue.data?.id === extra.extra_value_id
            )
          ) {
            groupedExtras[includesGroupIndex].values.push({ data: tempExtraValue, stock });
          }
        } else {
          groupedExtras.push({
            group: extra.group,
            values: [{ data: tempExtraValue, stock }],
          });
        }
      } else if (
        selectedStock?.extras.some(
          (selectedExtra) => selectedExtra.extra_value_id === stock.extras?.[0]?.extra_value_id
        )
      ) {
        if (!combinations.some((combination) => combination.id === tempExtraValue.id)) {
          combinations.push(tempExtraValue);
          if (
            groupedExtras.some((groupedExtra) => groupedExtra.group.id === extra.extra_group_id)
          ) {
            groupedExtras[includesGroupIndex].values.push({ data: tempExtraValue, stock });
          } else {
            groupedExtras.push({
              group: extra.group,
              values: [{ data: tempExtraValue, stock }],
            });
          }
        }
      }
    });
  });

  return groupedExtras;
};
