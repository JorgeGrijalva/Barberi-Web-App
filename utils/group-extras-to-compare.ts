import { Stock, ExtraGroup, ExtraValue } from "@/types/product";

interface GroupedExtra {
  group: ExtraGroup;
  values: Record<number, ExtraValue[]>;
}
export const groupExtrasToCompare = (stocks?: Stock[]) => {
  if (typeof stocks === "undefined") {
    return [];
  }
  const groupedExtras: GroupedExtra[] = [];
  stocks.forEach((stock) => {
    stock.stock_extras?.forEach((extra) => {
      const extraIndexInList = groupedExtras.findIndex(
        (groupedExtra) => groupedExtra.group.id === extra.extra_group_id
      );
      if (extraIndexInList < 0) {
        groupedExtras.push({ group: extra.group, values: { [stock.product_id]: [extra.value] } });
      } else if (groupedExtras[extraIndexInList].values[stock.product_id]) {
        if (
          !groupedExtras[extraIndexInList].values[stock.product_id].some(
            (value) => value.id === extra.extra_value_id
          )
        ) {
          groupedExtras[extraIndexInList].values[stock.product_id].push(extra.value);
        }
      } else {
        groupedExtras[extraIndexInList].values[stock.product_id] = [extra.value];
      }
    });
  });
  return groupedExtras;
};
