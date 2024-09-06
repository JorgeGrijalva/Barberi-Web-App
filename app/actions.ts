import { cookies } from "next/headers";

export const setCookie = async (options?: { lang?: string; currencyId?: number }) => {
  "use server";

  console.log(options);
  if (options?.lang) {
    cookies().set("lang", options.lang);
  }
  if (options?.currencyId) {
    cookies().set("currency_id", options.currencyId.toString());
  }
};
