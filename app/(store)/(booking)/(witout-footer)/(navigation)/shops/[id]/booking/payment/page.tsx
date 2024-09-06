import { cookies } from "next/headers";
import { shopService } from "@/services/shop";
import { Translate } from "@/components/translate";
import { PaymentFinish } from "./components/payment-finish";
import { ProtectedPayment } from "./protected-payment";
import { BookingBackButton } from "../booking-back-button";

const ShopBookingPayment = async ({ params }: { params: { id: string } }) => {
  const lang = cookies().get("lang")?.value;
  const shop = await shopService.getBySlug(params.id, { lang });
  return (
    <section className="xl:container px-2 py-7">
      <BookingBackButton deletePayment />
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-7 lg:mt-6">
        <div className="lg:col-span-2">
          <div className="border border-gray-link rounded-button col-span-2 py-6 px-5">
            <h2 className="text-2xl font-semibold">
              <Translate value="payments" />
            </h2>
            <div className="text-base mt-5 mb-10">
              <Translate value="payment.description" />
            </div>
            <ProtectedPayment shopSlug={shop?.data.slug} />
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

export default ShopBookingPayment;
