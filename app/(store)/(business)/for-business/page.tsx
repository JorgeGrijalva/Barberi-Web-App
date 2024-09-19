import CalendarCheckIcon from "@/assets/icons/calendar-check";
import ProgressIcon from "@/assets/icons/progress";
import MoneyOutlinedIcon from "@/assets/icons/money-outlined";
import BellOutlinedIcon from "@/assets/icons/bell-outlined";
import { Translate } from "@/components/translate";
import Image from "next/image";
import dynamic from "next/dynamic";
import React from "react";
import storyService from "@/services/story";
import { cookies } from "next/headers";
import { TopHeader } from "../components/top-header";
import { AppList } from "../components/app-list";
// import { Brands } from "../components/brands";

const Services = dynamic(
  () =>
    import("@/app/(store)/(booking)/components/services").then((component) => ({
      default: component.Services,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="xl:container mt-10 md:mt-0">
        <div className="pr-4 pl-4 xl:pr-0 xl:pl-0 xl:grid flex grid-cols-6 lg:gap-7 sm:gap-4 gap-2.5 animate-pulse overflow-x-hidden flex-nowrap">
          {Array.from(Array(12).keys()).map((item) => (
            <div className="bg-gray-300 rounded-button xl:min-w-full h-40 " key={item} />
          ))}
        </div>
      </div>
    ),
  }
);

const Stories = dynamic(() => import("@/app/(store)/(booking)/components/stories"), {
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

const StoriesComponent = async () => {
  const lang = cookies().get("lang")?.value || "es";
  const stories = await storyService.getAll({ lang });

  return <Stories data={stories} />;
};
const features = [
  {
    icon: <CalendarCheckIcon size={40} />,
    title: "online.booking",
    description: "online.booking.description",
  },
  {
    icon: <ProgressIcon />,
    title: "management",
    description: "management.description",
  },

  {
    icon: <MoneyOutlinedIcon />,
    title: "payments",
    description: "payment.description",
  },
  {
    icon: <BellOutlinedIcon />,
    title: "notifications",
    description: "notifications.description",
  },
];

const ForBusinessPage = () => (
  <main>
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute left-[calc(50%-36rem)] -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] xl:left-[calc(50%-24rem)]"
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
    <TopHeader
      title="business.section.title"
      description="business.section.description"
      buttonText="get.started"
      link="/be-seller"
    />

    <section className="bg-gray-bg lg:py-12 md:py-8 py-5">
      <div className="xl:container px-4 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 md:gap-7 gap-2.5">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-10 rounded-button bg-white flex flex-col gap-5 items-center text-center group hover:bg-primary hover:shadow-fixedBooking hover:text-white transition-all"
          >
            <div className="w-20 h-20 aspect-square flex items-center justify-center rounded-full bg-primary text-white group-hover:bg-white group-hover:bg-opacity-30">
              {feature.icon}
            </div>
            <h2 className="text-head font-semibold">
              <Translate value={feature.title} />
            </h2>
            {feature.description && (
              <span className="text-sm">
                <Translate value={feature.description} />
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
    <section className="md:pt-24 pt-14">
      <h3 className="md:text-5xl text-3xl font-semibold text-center">
        <Translate value="stay.in.control" />
      </h3>
      <p className="md:text-xl text-sm text-center md:mb-44 mb-24">
        <Translate value="intuitive.software" />
      </p>
      <div className="bg-gray-bg">
        <div className="xl:container px-4 flex justify-center">
          <div className="relative w-full -top-[140px]  md:h-[700px] h-[205px]">
            <Image
              src="/img/manager_dashboard.png"
              alt="dashboard"
              className="object-contain md:w-4/5  w-full md:!h-full !h-[345px] aspect-[1136/697]"
              fill
            />
          </div>
        </div>
      </div>
    </section>
    <section className="md:py-24 py-14">
      <h3 className="md:text-5xl text-3xl font-semibold text-center">
        <Translate value="run.your.business" />
      </h3>
      <p className="md:text-xl text-sm text-center md:mb-10 mb-0">
        <Translate value="choose.category" />
      </p>
      <Services showTitle={false} />
    </section>
    <section className="md:py-24 py-14 bg-gray-bg">
      <h3 className="md:text-5xl text-3xl font-semibold text-center">
        <Translate value="download.the.app" />
      </h3>
      <p className="md:text-xl text-sm text-center mb-10">
        <Translate value="application.description" />
      </p>
      <div className="xl:container px-4 grid md:grid-cols-2">
        <AppList />
        <div className="relative aspect-square left-0 md:scale-150">
          <Image src="/img/mobile_app.png" alt="mobile_app" fill className="object-contain" />
        </div>
      </div>
    </section>
    <section className="md:py-24 py-14">
      <h3 className="md:text-5xl text-3xl font-semibold px-8  text-center  break-words">
        <Translate value="fastest.growing.companies" />
      </h3>

      <div className="flex flex-col xl:container px-16 md:px-8 mt-16 md:gap-7 gap-3">
        {/* <Suspense fallback="Loading...">
          <Brands />
        </Suspense>
        <Suspense fallback="Loading...">
          <Brands reverse slower />
        </Suspense> */}
        <StoriesComponent />
      </div>
    </section>
    <section className="md:py-24 py-14 bg-gray-bg md:mb-24 mb-14">
      <h3 className="md:text-5xl text-3xl font-semibold text-center">
        <Translate value="grow.your.business" />
      </h3>
      <p className="md:text-xl text-sm text-center md:mb-20 mb-10">
        <Translate value="grow.your.business.desc" />
      </p>
      <div className="xl:container px-4 grid md:grid-cols-3 gap-y-16">
        <div className="text-center">
          <h4 className="text-6xl font-semibold">+100%</h4>
          <p className="text-lg">
            <Translate value="visibility.customers" />
          </p>
        </div>
        <div className="text-center">
          <h4 className="text-6xl font-semibold">24/7</h4>
          <p className="text-lg">
            <Translate value="appointment.managment.all.day" />
          </p>
        </div>
        <div className="text-center">
          <h4 className="text-6xl font-semibold">-35%</h4>
          <p className="text-lg">
            <Translate value="less.booking.cancel" />
          </p>
        </div>
      </div>
    </section>
  </main>
);

export default ForBusinessPage;
