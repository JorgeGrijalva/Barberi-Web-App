import { cookies } from "next/headers";
import { shopService } from "@/services/shop";
import { Translate } from "@/components/translate";
import { BookingTotal } from "../../components/booking-total";
import { LocationSelect } from "./location-select";
import { BookingBackButton } from "../booking-back-button";

const ShopBookingLocation = async ({ params }: { params: { id: string } }) => {
  const lang = cookies().get("lang")?.value;
  const shop = await shopService.getBySlug(params.id, { lang });
  return (
    <section className="xl:container px-2 py-7">
      <BookingBackButton deleteAddress />
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-7 lg:mt-6">
        <div className="col-span-2">
          <div className="border border-gray-link rounded-button col-span-2 py-6 px-5">
            <h2 className="text-2xl font-semibold">
              <Translate value="location" />
            </h2>
            <LocationSelect shopSlug={shop?.data.slug} />
          </div>
        </div>
        <div>
          <div className="sticky top-6 flex flex-col gap-7">
            <BookingTotal data={shop} checkLocation nextPage="/booking/note" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopBookingLocation;
