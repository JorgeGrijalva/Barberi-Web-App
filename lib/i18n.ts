import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import I18NextChainedBackend from "i18next-chained-backend";
import { DefaultResponse } from "@/types/global";
import { getCookie } from "cookies-next";
import fetcher from "./fetcher";

const loadResources = async (locale: string) =>
  fetcher<DefaultResponse<Record<string, string>>>(`v1/rest/translations/paginate?lang=${locale}`, {
    headers: { "Access-Control-Allow-Origin": "*" },
  }).catch((error) => {
    console.log(error);
  });

i18n
  .use(I18NextChainedBackend)
  .use(initReactI18next)
  .init({
    debug: false,
    ns: "translation",
    fallbackLng: getCookie("lang")?.toString() || "en",
    defaultNS: "translation",
    react: {
      useSuspense: true,
    },
    backend: {
      backends: [HttpBackend],
      backendOptions: [
        {
          loadPath: "{{lng}}|{{ns}}",
          request: (
            options: unknown,
            url: string,
            payload: unknown,
            callback: (
              option: null,
              data: {
                status: number;
                data: Record<string, string> | undefined;
              }
            ) => void
          ) => {
            try {
              const [lng] = url.split("|");
              loadResources(lng).then((response) => {
                callback(null, {
                  data: response?.data,
                  status: 200,
                });
              });
            } catch (e) {
              callback(null, {
                data: {},
                status: 200,
              });
            }
          },
        },
      ],
    },
  });

export default i18n;
