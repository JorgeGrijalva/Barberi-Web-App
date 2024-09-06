import { ParamsType } from "@/types/global";

export const buildUrlQueryParams = (url: string, params?: ParamsType) => {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && typeof value !== "undefined") {
        if (Array.isArray(value)) {
          value.forEach((valueItem, index) => {
            if (typeof valueItem === "object") {
              Object.entries(valueItem).forEach(([childKey, childValue]) => {
                if (childValue !== null && typeof childValue !== "undefined") {
                  queryParams.set(`${key}[${index}][${childKey}]`, String(childValue));
                }
              });
            } else {
              queryParams.set(`${key}[${index}]`, String(valueItem));
            }
          });
        } else {
          queryParams.set(key, String(value));
        }
      }
    });
  }
  return `${url}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
};
