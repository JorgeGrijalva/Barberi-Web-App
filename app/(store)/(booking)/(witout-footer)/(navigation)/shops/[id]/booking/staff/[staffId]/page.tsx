import { cookies } from "next/headers";
import { shopService } from "@/services/shop";
import { BackButton } from "@/components/back-button";
import dynamic from "next/dynamic";
import { MainInfo } from "../../../components/main-info";

const StaffDetail = dynamic(() =>
  import("./staff-detail").then((component) => ({ default: component.StaffDetail }))
);

const SingleStaffPage = async ({ params }: { params: { id: string; staffId: string } }) => {
  const lang = cookies().get("lang")?.value;
  const currencyId = cookies().get("currency_id")?.value;
  const shop = await shopService.getBySlug(params.id, { lang, currency_id: currencyId });
  return (
    <section className="xl:container px-4 py-7">
      <div className="hidden lg:block">
        <BackButton />
      </div>
      <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-x-7 gap-y-7 lg:mt-6">
        <div className="col-span-2">
          <div className="md:border border-gray-link rounded-button md:py-6 md:px-5">
            <StaffDetail id={params.staffId} />
          </div>
        </div>
        <div>
          <MainInfo data={shop} checkDate />
        </div>
      </div>
    </section>
  );
};

export default SingleStaffPage;
