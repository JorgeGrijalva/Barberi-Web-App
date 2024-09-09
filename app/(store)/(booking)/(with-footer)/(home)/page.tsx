import { Translate } from "@/components/translate";
import { cookies } from "next/headers";
import { categoryService } from "@/services/category";
import { shopService } from "@/services/shop";
import { globalService } from "@/services/global";
import { parseSettings } from "@/utils/parse-settings";
import React from "react";
import dynamic from "next/dynamic";
// import { brandService } from "@/services/brand";
import storyService from "@/services/story";
import { MobileCard } from "@/app/(store)/(booking)/components/mobile-card";
import { SearchField } from "@/components/main-search-field";
import { Header } from "@/components/header";
// import { SlidableProductList } from "@/components/slidable-product-list";
// import { Brands } from "./components/brands";

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
const Salons = dynamic(() =>
  import("./components/salons").then((component) => ({ default: component.Salons }))
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
  const settings = await globalService.settings();
  // const brands = await brandService.getAll();
  const parsedSettings = parseSettings(settings?.data);
  const recommendedShops = await shopService.getAll({
    lang,
    perPage: 8,
    column: "r_avg",
    sort: "desc",
    country_id: countryId,
    city_id: cityId,
  });
  const dealShops = await shopService.getAll({
    lang,
    perPage: 8,
    column: "b_count",
    sort: "desc",
    country_id: countryId,
    city_id: cityId,
  });
  const nearByShops = await shopService.getAll({
    lang,
    perPage: 8,
    country_id: countryId,
    city_id: cityId,
  });
  const stories = await storyService.getAll({ lang });
  return (
    <div className="overflow-x-hidden w-screen">
      <div className="overflow-x-hidden">
        <div className="relative ">
          <div
            aria-hidden="true"
            className="absolute left-[calc(50%-36rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] xl:left-[calc(50%-24rem)]"
          >
            <div
              style={{
                clipPath:
                  "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
              }}
              className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#0033FF] to-[#0033FF] opacity-20"
            />
          </div>
        </div>
        <Header showLinks settings={parsedSettings} />
        <section className="flex justify-center items-center flex-col my-32 px-4 md:px-8 lg:px-0">
          <h1 className="md:text-[65px] text-3xl font-semibold text-center my-10">
            <Translate value="find.services" />
          </h1>
          <div className="z-[2] w-full lg:w-auto">
            <SearchField />
          </div>
        </section>
        <section>
          <Services data={services} />
        </section>
      </div>

      <main>
        <section className="mb-16">
          <Recommended data={recommendedShops} />
          <Masters />
        </section>
        {!!stories?.length && (
          <section className="my-10 bg-stories-bg bg-no-repeat bg-cover">
            <div className="flex items-center pt-12 pb-9 flex-col">
              <div className="text-4xl font-semibold">
                <Translate value="stories.widget" />
              </div>
              <span className="text-xl">
                <Translate value="view.the.stories" />
              </span>
            </div>
            <div className="xl:container pb-12">
              <Stories data={stories} />
            </div>
          </section>
        )}

        <section>
          <Deals data={dealShops} />
        </section>
        {/* <section>
          <Brands data={brands} />
        </section> */}
        <section className="xl:container px-4">
          <Salons />
        </section>
        {/* <section className="xl:container">
          <div className="md:my-20 my-7 bg-gray-faq rounded-button md:px-6 px-5 md:py-9 py-7">
            <SlidableProductList title="products" link="/products" visibleListCount={4} />
          </div>
        </section> */}
        <section>
          <NearYou data={nearByShops} />
        </section>
        <section className="xl:container px-4">
          <div className="grid md:grid-cols-2 gap-7 my-14">
            <MobileCard
              img="/img/mobile-card-2.png"
              title="find.and.book.appointment"
              description="app.movile.client.description"
            />
            <MobileCard
              img="/img/mobile-card-1.png"
              title="for.business"
              description="Gestiona tu negocio de belleza y barbería de manera fácil y rápida."
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
