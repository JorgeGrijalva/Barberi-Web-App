import { cookies } from "next/headers";
import { shopService } from "@/services/shop";
import { Translate } from "@/components/translate";
import { BookingNotes } from "./notes";
import { BookingBackButton } from "../booking-back-button";
import PaymentFinish from "./components/payment-finish";

const ShopBookingNote = async ({ params }: { params: { id: string } }) => {
  const lang = cookies().get("lang")?.value;
  const currencyId = cookies().get("currency_id")?.value;
  const shop = await shopService.getBySlug(params.id, { lang, currency_id: currencyId });
  return (
    <section className="xl:container px-4 py-7">
      <BookingBackButton deleteNotes />
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-7 lg:mt-6">
        <div className="col-span-2">
          <div className="md:border border-gray-link rounded-button col-span-2 md:py-6 md:px-5">
            <h2 className="text-2xl font-semibold">
              <Translate value="notes.and.instructions" />
            </h2>
            <BookingNotes shopSlug={shop?.data.slug} />
          </div>
        </div>
        <div>
          <div className="sticky top-6 flex flex-col gap-7">
            <PaymentFinish shop={shop} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopBookingNote;
