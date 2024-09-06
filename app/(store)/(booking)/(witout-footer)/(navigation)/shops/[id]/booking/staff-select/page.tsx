import { cookies } from "next/headers";
import { shopService } from "@/services/shop";
import { Translate } from "@/components/translate";
import { BookingTotal } from "../../components/booking-total";
import { StaffSelect } from "./components/staff-select";
import { BookingBackButton } from "../booking-back-button";

const ShopBookingStaff = async ({ params }: { params: { id: string } }) => {
  const lang = cookies().get("lang")?.value;
  const currencyId = cookies().get("currency_id")?.value;
  const shop = await shopService.getBySlug(params.id, { lang, currency_id: currencyId });
  return (
    <section className="xl:container px-4 py-7">
      <BookingBackButton deleteStaff />
      <div className="grid md:grid-cols-3 grid-cols-1 gap-7 lg:mt-6">
        <div className="col-span-2">
          <h2 className="text-xl font-semibold">
            <Translate value="select.masters" />
          </h2>
          <StaffSelect shopId={shop?.data.id} />
        </div>
        <div>
          <div className="sticky top-6 flex flex-col gap-7">
            <BookingTotal data={shop} nextPage="/booking/staff" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopBookingStaff;
