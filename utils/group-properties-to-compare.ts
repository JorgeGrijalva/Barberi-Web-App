import { Property, PropertyGroup, PropertyValue } from "@/types/product";

interface GroupedProperty {
  group: PropertyGroup;
  values: Record<number, PropertyValue>;
}
export const groupPropertiesToCompare = (properties?: Property[]) => {
  if (typeof properties === "undefined") {
    return [];
  }
  const groupedProperties: GroupedProperty[] = [];
  properties.forEach((property) => {
    const propertyIndexInList = groupedProperties.findIndex(
      (groupedProperty) => groupedProperty.group.id === property.property_group_id
    );
    if (propertyIndexInList < 0) {
      groupedProperties.push({
        group: property.group,
        values: { [property.product_id]: property.value },
      });
    } else if (!groupedProperties[propertyIndexInList].values[property.product_id]) {
      groupedProperties[propertyIndexInList].values[property.product_id] = property.value;
    }
  });
  return groupedProperties;
};
