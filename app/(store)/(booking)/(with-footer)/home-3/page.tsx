import { Translate } from "@/components/translate";
import { cookies } from "next/headers";
import { categoryService } from "@/services/category";
import { shopService } from "@/services/shop";
import { globalService } from "@/services/global";
import { parseSettings } from "@/utils/parse-settings";
import React from "react";
import dynamic from "next/dynamic";
import { MobileCard } from "@/app/(store)/(booking)/components/mobile-card";
import { SlidableProductList } from "@/components/slidable-product-list";
import storyService from "@/services/story";
import { SearchField } from "./components/search-field";
import { Canvas } from "./components/canvas";

const Header = dynamic(() =>
  import("@/components/header").then((component) => ({ default: component.Header }))
);
const Stories = dynamic(() => import("../../components/stories"), {
  ssr: false,
  loading: () => (
    <div className=" mt-10">
      <div className="flex lg:gap-7 sm:gap-4 gap-2.5 animate-pulse overflow-x-hidden flex-nowrap">
        {Array.from(Array(8).keys()).map((item) => (
          <div className="bg-gray-300 rounded-button min-w-[170px]  h-80" key={item} />
        ))}
      </div>
    </div>
  ),
});
const Deals = dynamic(
  () => import("./components/deals").then((component) => ({ default: component.Deals })),
  {
    ssr: false,
    loading: () => (
      <div className="xl:container mt-10">
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
const NearYou = dynamic(
  () => import("./components/near-you").then((component) => ({ default: component.NearYou })),
  {
    ssr: false,
    loading: () => (
      <div className="xl:container mt-10">
        <div className="h-6 mb-4 rounded-full w-44 bg-gray-300 mx-4 xl:mx-0" />
        <div className="pr-4 pl-4 xl:pr-0 xl:pl-0 xl:grid flex grid-cols-4 lg:gap-7 sm:gap-4 gap-2.5 animate-pulse overflow-x-hidden flex-nowrap">
          {Array.from(Array(8).keys()).map((item) => (
            <div
              className="bg-gray-300 rounded-button md:min-w-[312px] min-w-[240px] xl:min-w-full md:h-96 h-80"
              key={item}
            />
          ))}
        </div>
      </div>
    ),
  }
);
const Masters = dynamic(
  () => import("./components/masters").then((component) => ({ default: component.Masters })),
  {
    ssr: false,
    loading: () => (
      <div className="xl:container mt-10">
        <div className="h-6 mb-4 rounded-full w-44 bg-gray-300 mx-4 xl:mx-0" />
        <div className="pr-4 pl-4 xl:pr-0 xl:pl-0 flex lg:gap-7 sm:gap-4 gap-2.5 animate-pulse overflow-x-hidden flex-nowrap">
          {Array.from(Array(8).keys()).map((item) => (
            <div className="bg-gray-300 rounded-button min-w-[200px]  h-99" key={item} />
          ))}
        </div>
      </div>
    ),
  }
);
const Services = dynamic(
  () => import("../../components/services").then((component) => ({ default: component.Services })),
  {
    ssr: false,
    loading: () => (
      <div className="xl:container mt-10 md:mt-0">
        <div className="h-6 mb-4 rounded-full w-36 bg-gray-300 mx-4 xl:mx-0" />
        <div className="pr-4 pl-4 xl:pr-0 xl:pl-0 xl:grid flex grid-cols-6 lg:gap-7 sm:gap-4 gap-2.5 animate-pulse overflow-x-hidden flex-nowrap">
          {Array.from(Array(12).keys()).map((item) => (
            <div
              className="bg-gray-300 rounded-button min-w-[200px] xl:min-w-full h-40 xl:aspect-[200/152]"
              key={item}
            />
          ))}
        </div>
      </div>
    ),
  }
);
const Recommended = dynamic(
  () => import("./components/recomended").then((component) => ({ default: component.Recommended })),
  {
    ssr: false,
    loading: () => (
      <div className="xl:container mt-10">
        <div className="h-6 mb-4 rounded-full w-44 bg-gray-300 mx-4 xl:mx-0" />
        <div className="pr-4 pl-4 xl:pr-0 xl:pl-0 xl:grid flex grid-cols-4 lg:gap-7 sm:gap-4 gap-2.5 animate-pulse overflow-x-hidden flex-nowrap">
          {Array.from(Array(8).keys()).map((item) => (
            <div
              className="bg-gray-300 rounded-button md:min-w-[312px] min-w-[240px] xl:min-w-full md:h-96 h-80"
              key={item}
            />
          ))}
        </div>
      </div>
    ),
  }
);

const HomePage = async () => {
  const lang = cookies().get("lang")?.value || "en";
  const countryId = cookies().get("country_id")?.value || undefined;
  const cityId = cookies().get("city_id")?.value || undefined;
  const services = await categoryService.getAll({
    lang,
    type: "service",
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
  const stories = await storyService.getAll({ lang });
  const parsedSettings = parseSettings(settings?.data);
  return (
    <>
      <section className="lg:h-full relative pb-12 mb-10">
        <Canvas />
        <Header showLinks settings={parsedSettings} />
        <div className="flex justify-center items-center flex-col px-4">
          <h1 className="md:text-[65px] text-white text-3xl font-semibold text-center my-10 max-w-[702px] leading-tight">
            <Translate value="service.ui3.text" />
          </h1>
          <SearchField />
        </div>
      </section>
      <main>
        <section>
          <Services data={services} />
        </section>
        <section>
          <Recommended data={shops} />
          <Masters />
        </section>
        {!!stories?.length && (
          <section className="my-10">
            <div className="flex items-center pt-12 pb-9 flex-col">
              <div className="text-4xl font-semibold">
                <Translate value="stories.widget" />
              </div>
              <span className="text-xl">
                <Translate value="view.the.stories" />
              </span>
            </div>
            <div className="xl:container pb-12">
              <Stories data={stories} buttonVariant="2" />
            </div>
          </section>
        )}
        <section className="xl:container px-4">
          <div className="grid md:grid-cols-2 gap-7 my-14">
            <MobileCard
              img="/img/mobile-card-1.png"
              title="find.and.book.appointment"
              description="mobile.card.description.1"
            />
            <MobileCard
              img="/img/mobile-card-2.png"
              title="for.business"
              description="mobile.card.description.2"
            />
          </div>
        </section>
        <section>
          <Deals data={shops} />
        </section>
        <section className="xl:container">
          <div className="md:my-20 my-7 bg-gray-faq rounded-button md:px-6 px-5 md:py-9 py-7">
            <SlidableProductList title="products" link="/products" visibleListCount={4} />
          </div>
        </section>
        <section>
          <NearYou data={shops} />
        </section>
      </main>
    </>
  );
};

export default HomePage;
