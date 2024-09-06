import { Translate } from "@/components/translate";
import { cookies } from "next/headers";
import { categoryService } from "@/services/category";
import { shopService } from "@/services/shop";
import { globalService } from "@/services/global";
import { parseSettings } from "@/utils/parse-settings";
import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import clsx from "clsx";
import { Header } from "@/components/header";
import { FindBestSalon } from "@/components/find-best-salon";
import { SlidableProductList } from "@/components/slidable-product-list";
import { SearchField } from "./components/search-field";
import { Services } from "./components/services";
import { MobileCard } from "./components/mobile-card";

const NearYou = dynamic(
  () =>
    import("./components/near-you").then((component) => ({
      default: component.NearYou,
    })),
  {
    ssr: false,
    loading: () => (
      <div className=" my-7">
        <div className="h-6 mb-4 rounded-full w-44 bg-gray-300 mx-4 xl:mx-0" />
        <div className="pr-4 pl-4 xl:pr-0 xl:pl-0 flex lg:gap-7 sm:gap-4 gap-2.5 animate-pulse overflow-x-hidden flex-nowrap">
          {Array.from(Array(8).keys()).map((item) => (
            <div className="bg-gray-300 rounded-button min-w-[312px]  h-80" key={item} />
          ))}
        </div>
      </div>
    ),
  }
);
const Salons = dynamic(() =>
  import("./components/salons").then((component) => ({
    default: component.Salons,
  }))
);

const Recommended = dynamic(
  () => import("./components/recomended").then((component) => ({ default: component.Recommended })),
  {
    ssr: false,
    loading: () => (
      <div className=" my-7">
        <div className="h-6 mb-4 rounded-full w-44 bg-gray-300 mx-4 xl:mx-0" />
        <div className="pr-4 pl-4 xl:pr-0 xl:pl-0 flex lg:gap-7 sm:gap-4 gap-2.5 animate-pulse overflow-x-hidden flex-nowrap">
          {Array.from(Array(8).keys()).map((item) => (
            <div className="bg-gray-300 rounded-button min-w-[312px]  h-80" key={item} />
          ))}
        </div>
      </div>
    ),
  }
);

const userImages = [
  "/img/user1.png",
  "/img/user2.png",
  "/img/user3.png",
  "/img/user4.png",
  "/img/user5.png",
  "/img/user6.png",
];

const HomePage = async () => {
  const lang = cookies().get("lang")?.value || "en";
  const countryId = cookies().get("country_id")?.value || undefined;
  const cityId = cookies().get("city_id")?.value || undefined;
  const services = await categoryService.getAll({
    lang,
    type: "sub_main",
    perPage: 11,
    column: "input",
    sort: "asc",
  });
  const shops = await shopService.getAll({
    lang,
    perPage: 8,
    country_id: countryId,
    city_id: cityId,
  });
  const settings = await globalService.settings();
  const parsedSettings = parseSettings(settings?.data);
  return (
    <>
      <Header settings={parsedSettings} />
      <main>
        <section className="flex flex-col items-center justify-center xl:container mb-24">
          <div className="grid md:grid-cols-2 lg:gap-48 mb-10">
            <div className="px-4 xl:px-0">
              <h1 className="lg:text-[65px] md:text-5xl text-3xl break-words leading-normal text-center md:text-start">
                <span className="font-bold text-giantsOrange">
                  <Translate value="book.service" />
                </span>{" "}
                <Translate value="in.the.best.salon.near.you" />
              </h1>
              <p className="text-xl my-5 hidden md:block">
                <Translate value="home-2.hero.description" />
              </p>
              <div className="hidden md:flex items-center gap-2 pb-32">
                <div className="flex items-center">
                  {userImages.map((img, i) => (
                    <Image
                      src={img}
                      alt={`user-${i}`}
                      width={36}
                      height={36}
                      className={clsx("w-9 h-9 rounded-full", i !== 0 && "-ml-3")}
                      key={img}
                    />
                  ))}
                </div>
                <span className="text-gray-field text-xl">
                  {10} <Translate value="people.booked" />
                </span>
              </div>
            </div>
            <div className="relative h-[300px] md:h-full px-4 xl:px-0 mt-10 md:mt-0 mb-32 md:mb-0">
              <div className="hero-1 relative h-full w-1/2" />
              <div className="hero-2 absolute w-44 aspect-square top-0 rounded-full z-[2]" />
              <div className="hero-3 absolute aspect-[1/1.5] w-36 top-48 z-[2]" />
              <div className="hero-4 absolute aspect-square w-28 top-16 z-[2] rounded-full" />
            </div>
          </div>
          <SearchField />
        </section>
        <section className="xl:container px-4">
          <Recommended data={shops} />
        </section>

        <section className="xl:container px-4">
          <Services data={services} />
        </section>

        <section className="xl:container px-4">
          <NearYou data={shops} />
        </section>
        <section className="xl:container">
          <div className="md:my-20 my-7 bg-gray-faq rounded-button md:px-6 px-5 md:py-9 py-7">
            <SlidableProductList title="products" link="/products" visibleListCount={4} />
          </div>
        </section>
        <section className="xl:container px-4">
          <Salons />
        </section>
        <section className="xl:container px-4">
          <div className="grid md:grid-cols-2 gap-7 my-14">
            <MobileCard title="best.masters" description="mobile.card.description" />
            <MobileCard img="/img/mobile-card-3.png" />
          </div>
        </section>
        <section className="xl:container px-4">
          <FindBestSalon />
        </section>
      </main>
    </>
  );
};

export default HomePage;
