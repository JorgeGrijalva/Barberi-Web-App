import fetcher from "@/lib/fetcher";
import { Currency, DefaultResponse, Language, Setting } from "@/types/global";

export const globalService = {
  languages: () =>
    fetcher<DefaultResponse<Language[]>>("v1/rest/languages/active", { cache: "no-store" }),
  currencies: () =>
    fetcher<DefaultResponse<Currency[]>>("v1/rest/currencies/active", { cache: "no-store" }),
  settings: () => fetcher<DefaultResponse<Setting[]>>("v1/rest/settings", { cache: "no-store" }),
};
