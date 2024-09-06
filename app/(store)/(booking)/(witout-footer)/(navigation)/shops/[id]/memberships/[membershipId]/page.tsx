import { BackButton } from "@/components/back-button";
import { membershipService } from "@/services/membership";
import { cookies } from "next/headers";
import { Translate } from "@/components/translate";
import { MembershipPurchase } from "./purchase";
import { MembershipDetailRender } from "./detail";

const MembershipDetailPage = async ({
  params,
  searchParams,
}: {
  params: { id: string; membershipId: string };
  searchParams: { shopId: string };
}) => {
  const lang = cookies().get("lang")?.value;
  const currencyId = cookies().get("currency_id")?.value;
  const data = await membershipService.getById(searchParams.shopId, params.membershipId, {
    lang,
    currency_id: currencyId,
  });
  return (
    <section className="xl:container px-4 md:py-7">
      <div className="hidden lg:block">
        <BackButton />
      </div>
      <div className="grid lg:grid-cols-3 gap-7 mt-6">
        <div className="lg:col-span-2 rounded-button md:border border-gray-link md:px-5 md:py-6">
          <div className="font-semibold text-xl">
            <Translate value="additional.info" />
            <MembershipDetailRender data={data?.data} />
          </div>
        </div>
        <div>
          <MembershipPurchase data={data?.data} />
        </div>
      </div>
    </section>
  );
};

export default MembershipDetailPage;
