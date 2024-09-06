import "swiper/css";
import "remixicon/fonts/remixicon.css";
import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { parseSettings } from "@/utils/parse-settings";
import { cookies } from "next/headers";
import React from "react";
import clsx from "clsx";
import { globalService } from "@/services/global";
import { CountrySelect } from "@/components/country-select";
import NextTopLoader from "nextjs-toploader";
import { cityService, countryService } from "@/services/country";
import ThemeProvider from "./theme-provider";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await globalService.settings().catch((e) => console.log(e));
  const parsedSettings = parseSettings(settings?.data);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL),
    title: {
      template: `%s | ${parsedSettings.title}`,
      default: parsedSettings.title,
    },
    icons: parsedSettings.favicon,
    description: "Book beauty services in your city",
    openGraph: {
      images: [
        {
          url: parsedSettings.logo,
          width: 200,
          height: 200,
        },
      ],
      title: parsedSettings.title,
      description: "Book beauty services in your city",
      siteName: parsedSettings.title,
    },
  };
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const languages = await globalService.languages().catch((e) => console.log("language error", e));
  const currencies = await globalService
    .currencies()
    .catch((e) => console.log("currency error", e));
  const selectedLocale = cookies().get("lang")?.value || "en";
  const selectedDirection = cookies().get("dir")?.value;

  const defaultLanguage = languages?.data?.find((lang) => Boolean(lang?.default));
  const defaultCurrency = currencies?.data?.find((currency) => Boolean(currency?.default));
  const settings = await globalService
    .settings()
    .then((res) => res.data)
    .catch((e) => console.log("settings error", e));
  const parsedSettings = parseSettings(typeof settings === "object" ? settings : []);
  if (process.env.NEXT_PUBLIC_UI_TYPE) {
    parsedSettings.ui_type = process.env.NEXT_PUBLIC_UI_TYPE;
  }
  let defaultCountry;
  if (parsedSettings?.default_country_id?.length) {
    defaultCountry = await countryService
      .get(Number(parsedSettings.default_country_id))
      .then((res) => {
        if (parsedSettings?.default_city_id?.length) {
          return cityService.get(Number(parsedSettings.default_city_id)).then((city) => {
            res.data.city = city.data;
            return res.data;
          });
        }
        return res.data;
      });
  }

  return (
    <html
      lang={selectedLocale || defaultLanguage?.locale || "en"}
      dir={selectedDirection || (defaultLanguage?.backward ? "rtl" : "ltr")}
    >
      <body className={clsx(inter.className)}>
        <div id="portal" />
        <ThemeProvider attribute="class" defaultTheme="light">
          <Providers
            languages={languages?.data}
            currencies={currencies?.data}
            defaultLanguage={defaultLanguage}
            defaultCurrency={defaultCurrency}
            settings={parsedSettings}
            defaultCountry={defaultCountry}
          >
            {children}
            <CountrySelect settings={parsedSettings} />
          </Providers>
          <NextTopLoader color="#BB9B6A" showSpinner={false} />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
