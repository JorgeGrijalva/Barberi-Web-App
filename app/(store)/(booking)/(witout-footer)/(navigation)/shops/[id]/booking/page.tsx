import { cookies } from "next/headers";
import { shopService } from "@/services/shop";
import dynamic from "next/dynamic";
import { WorkingSchedule } from "../components/working-schedule";
import { BookingTotal } from "../components/booking-total";
import { BookingBackButton } from "./booking-back-button";
import { BuyOptions } from "../components/buy-options";

const Services = dynamic(
  () => import("../components/services").then((component) => ({ default: component.Services })),
  {
    loading: () => (
      <div className="border border-gray-link rounded-button py-6 px-5 animate-pulse col-span-2">
        <div className="h-6 rounded-button w-1/3 bg-gray-300" />
        <div className="mt-6">
          <div className="w-1/2 mb-2 rounded-full h-[18px] bg-gray-300" />
          <div className="w-full mb-1 rounded-full h-[14px] bg-gray-300" />
          <div className="w-1/4 rounded-full h-[14px] bg-gray-300" />
        </div>
        <div className="mt-6">
          <div className="w-1/2 mb-2 rounded-full h-[18px] bg-gray-300" />
          <div className="w-full mb-1 rounded-full h-[14px] bg-gray-300" />
          <div className="w-1/4 rounded-full h-[14px] bg-gray-300" />
        </div>
        <div className="mt-6">
          <div className="w-1/2 mb-2 rounded-full h-[18px] bg-gray-300" />
          <div className="w-full mb-1 rounded-full h-[14px] bg-gray-300" />
          <div className="w-1/4 rounded-full h-[14px] bg-gray-300" />
        </div>
      </div>
    ),
  }
);

const ShopBooking = async ({ params }: { params: { id: string } }) => {
  const lang = cookies().get("lang")?.value;
  const currencyId = cookies().get("currency_id")?.value;
  const shop = await shopService.getBySlug(params.id, { lang, currency_id: currencyId });
  return (
    <section className="xl:container px-4 py-7">
      <BookingBackButton resetAll />
      <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-x-7 gap-y-7 lg:mt-6">
        <div className="col-span-2">
          <Services isInBookingPage shopId={shop?.data?.id} />
        </div>
        <div>
          <div className="sticky top-6 flex flex-col gap-7">
            <BookingTotal data={shop} nextPage="/booking/staff-select" />
            <BuyOptions shopSlug={shop?.data.slug} shopId={shop?.data.id} />
            <WorkingSchedule data={shop?.data?.shop_working_days} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopBooking;
