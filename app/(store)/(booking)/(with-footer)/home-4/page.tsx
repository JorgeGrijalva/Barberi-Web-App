import { Translate } from "@/components/translate";
import { cookies } from "next/headers";
import { shopService } from "@/services/shop";
import { globalService } from "@/services/global";
import { parseSettings } from "@/utils/parse-settings";
import React from "react";
import dynamic from "next/dynamic";
import { SearchField } from "@/components/main-search-field";
import { Header } from "@/components/header";
import { FindBestSalon } from "@/components/find-best-salon";
import { SlidableProductList } from "@/components/slidable-product-list";
import storyService from "@/services/story";

const Stories = dynamic(() => import("../../components/stories"), {
  ssr: false,
  loading: () => (
    <div className=" mt-10">
      <div className="flex sm:gap-4 gap-2.5 animate-pulse overflow-x-hidden flex-nowrap">
        {Array.from(Array(8).keys()).map((item) => (
          <div className="bg-gray-300 rounded-full min-w-[140px] aspect-square" key={item} />
        ))}
      </div>
    </div>
  ),
});
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
      <div className="relative bg-ui-2-bg bg-no-repeat bg-clip-content bg-center bg-contain bg-gray-ui4bg  lg:h-[605px] h-[605px] aspect-[11 / 5]">
        <Header showLinks={false} settings={parsedSettings} isHidden={false} />
        <section className="w-full absolute left-[50%] translate-x-[-50%] bottom-[-30px] flex justify-center items-center flex-col px-4 md:px-8 lg:px-0">
          <h1 className="md:text-[60px] text-center text-shadow mb-5 break-all">
            <Translate value="book.beauty.services" />
          </h1>
          <div className="w-full lg:w-auto drop-shadow-search">
            <SearchField />
          </div>
        </section>
      </div>
      <main>
        {!!stories?.length && (
          <section className="mt-10">
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
        <section>
          <Recommended data={shops} />
          <Masters />
        </section>
        <section className="xl:container">
          <div className="md:my-20 my-7 bg-gray-faq rounded-button md:px-6 px-5 md:py-9 py-7">
            <SlidableProductList title="products" link="/products" visibleListCount={4} />
          </div>
        </section>
        <section>
          <NearYou data={shops} />
        </section>
        <section className="xl:container px-4">
          <FindBestSalon />
        </section>
      </main>
    </>
  );
};

export default HomePage;
