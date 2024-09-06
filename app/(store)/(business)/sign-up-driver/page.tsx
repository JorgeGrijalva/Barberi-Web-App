import Image from "next/image";
import React from "react";
import { cookies } from "next/headers";
import { infoService } from "@/services/info";
import { Translate } from "@/components/translate";
import { TopHeader } from "../components/top-header";
import { Qa } from "../components/qa";
import { MobileLinks } from "../components/mobile-links";

const features = [
  {
    img: "/img/driver_f1.png",
    title: "fast.delivery",
  },
  {
    img: "/img/driver_f2.png",
    title: "safe.shortcuts",
  },

  {
    img: "/img/driver_f3.png",
    title: "know.your.schedule",
  },
  {
    img: "/img/driver_f4.png",
    title: "become.expert",
  },
];

const SignUpDriverPage = async () => {
  const lang = cookies().get("lang")?.value;
  const faqs = await infoService.faq({ lang });
  return (
    <main>
      <TopHeader
        title="driver.section.title"
        description="driver.section.description"
        buttonText="download.app"
        link="/be-seller"
      />
      <section className="xl:container px-4 grid md:grid-cols-7 grid-cols-1 lg:gap-7 md:gap-4 gap-2.5 lg:mb-24 mb-16">
        <div className="relative md:col-span-4 rounded-button md:aspect-[739/520] aspect-[364/345] overflow-hidden">
          <Image src="/img/driver_bg1.png" alt="driver_bg" fill className="object-cover" />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-transparent to-dark lg:p-10 md:p-8 p-5 text-white">
            <strong className="md:text-5xl text-3xl font-semibold">
              <Translate value="get.paid" />
            </strong>
            <p className="md:text-lg text-sm">
              <Translate value="payment.description" />
            </p>
          </div>
        </div>

        <div className="relative md:col-span-3 rounded-button md:h-full h-[320px] w-full overflow-hidden">
          <Image src="/img/driver_bg2.png" alt="driver_bg_1" fill className="object-cover" />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-transparent to-dark lg:p-10 md:p-8 p-5 text-white">
            <strong className="md:text-5xl text-3xl font-semibold">
              <Translate value="track.earnings" />
            </strong>
            <p className="md:text-lg text-sm">
              <Translate value="earnings.description" />
            </p>
          </div>
        </div>
      </section>
      <section className="bg-gray-bg lg:py-12 md:py-8 py-5">
        <div className="xl:container px-4 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 md:gap-7 gap-2.5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-10 rounded-button bg-white flex flex-col gap-5 items-center text-center group hover:bg-primary hover:shadow-fixedBooking hover:text-white transition-all"
            >
              <div className="relative  max-h-[172px] w-4/5 h-[172px]">
                <Image src={feature.img} alt={feature.title} fill className="object-contain" />
              </div>
              <h2 className="text-head font-semibold">
                <Translate value={feature.title} />
              </h2>
            </div>
          ))}
        </div>
      </section>

      <section className="md:py-40 py-14">
        <div className="bg-gray-bg relative">
          <div className="xl:container px-0 grid md:grid-cols-2">
            <div className="pt-10 md:pt-0">
              <div className="md:pt-20 pt-7 pb-40 md:pb-20 relative flex flex-col justify-between h-full">
                <div className="relative z-[1] text-center md:text-start px-0 sm:px-4">
                  <strong className="md:text-5xl text-3xl font-semibold">
                    <Translate value="download.the.app" />
                  </strong>
                  <p className="md:text-xl text-sm">
                    <Translate value="driver.app.description" />
                  </p>
                </div>
                <Image
                  src="/img/driver_app_curve.png"
                  alt="curve"
                  fill
                  className="object-contain select-none"
                />
                <div className="hidden md:block">
                  <MobileLinks />
                </div>
              </div>
            </div>
            <div className="relative h-[550px]">
              <Image src="/img/map.png" alt="map" fill className="object-cover" />
              <Image
                src="/img/driver_app_bg.png"
                alt="bg"
                fill
                className="object-cover rotate-90 md:rotate-0 !top-0 md:top-auto hidden md:block"
              />
              <Image
                src="/img/driver_app_element1.png"
                alt="app_element_1"
                fill
                className="object-contain !h-16 -translate-x-1/2 !bottom-28 !inset-auto"
              />
              <Image
                src="/img/driver_app_element2.png"
                alt="app_element_2"
                fill
                className="object-contain !h-[60px] -translate-x-1/3 !top-28 !inset-auto"
              />

              <Image
                src="/img/driver_app.png"
                alt="mobile_app"
                fill
                className="object-contain -translate-y-20 md:!h-full !h-[380px]"
              />
              <div className="md:hidden">
                <MobileLinks />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="xl:container px-4 mb-10">
        <h3 className="md:text-5xl text-3xl font-semibold text-center">
          <Translate value="faq" />
        </h3>
        <div className="py-10">
          {faqs?.data.map((faq) => (
            <Qa data={faq} key={faq.id} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default SignUpDriverPage;
