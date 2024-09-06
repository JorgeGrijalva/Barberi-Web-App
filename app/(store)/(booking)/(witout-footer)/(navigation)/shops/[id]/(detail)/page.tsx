import { cookies } from "next/headers";
import { Metadata } from "next";
import { shopService } from "@/services/shop";
import dynamic from "next/dynamic";
import { MasterCardLoading } from "@/components/master-card/master-card-loading";
import { SlidableProductList } from "@/components/slidable-product-list";
import { Button } from "@/components/button";
import { Translate } from "@/components/translate";
import Link from "next/link";
import { TopInfo } from "../components/top-info";
import { ShopLocation } from "../components/location";
import { MainInfo } from "../components/main-info";
import { WorkingSchedule } from "../components/working-schedule";
import { BuyOptions } from "../components/buy-options";

const Services = dynamic(() =>
  import("../components/services").then((component) => ({ default: component.Services }))
);

const Masters = dynamic(
  () => import("../components/masters").then((component) => ({ default: component.Masters })),
  {
    loading: () => (
      <div className="border border-gray-link rounded-button py-6 px-5 animate-pulse col-span-2">
        <div className="h-6 rounded-button w-1/3 bg-gray-300" />
        <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-2 md:gap-4 gap-2 mt-6">
          {Array.from(Array(8).keys()).map((item) => (
            <MasterCardLoading key={item} />
          ))}
        </div>
      </div>
    ),
  }
);

const Reviews = dynamic(() => import("../components/reviews"));
const NearbyShops = dynamic(
  () => import("../components/near-by").then((component) => ({ default: component.NearBy })),
  {
    ssr: false,
  }
);

export const generateMetadata = async ({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> => {
  const lang = cookies().get("lang")?.value;
  const currencyId = cookies().get("currency_id")?.value;
  const shop = await shopService.getBySlug(params.id, { lang, currency_id: currencyId });

  return {
    title: shop.data.translation?.title,
    description: shop.data.translation?.description,
    openGraph: {
      images: {
        url: shop.data.logo_img,
      },
      title: shop.data.translation?.title,
      description: shop.data.translation?.description,
    },
  };
};

const SingleShop = async ({ params }: { params: { id: string } }) => {
  const lang = cookies().get("lang")?.value;
  const currencyId = cookies().get("currency_id")?.value;
  const shop = await shopService.getBySlug(params.id, { lang, currency_id: currencyId });
  return (
    <>
      <section className="xl:container px-4 pt-7 pb-24 lg:pb-7">
        <TopInfo data={shop} />
        <div className="grid lg:grid-cols-3 xl:gap-7 sm:gap-4 grid-cols-1 md:gap-7 gap-y-7 mt-6">
          <div className="flex flex-col gap-7 col-span-2">
            <ShopLocation data={shop} />
            <Services shopId={shop?.data?.id} shopSlug={shop?.data?.slug} />
            <Masters shopId={shop?.data?.id} shopSlug={shop?.data?.slug} />
            <Reviews
              reviewCount={shop?.data?.r_count}
              reviewAvg={shop?.data?.r_avg}
              id={shop?.data?.id}
            />
          </div>
          <div className="hidden lg:block">
            <div className="sticky top-7 flex flex-col gap-7  ">
              <MainInfo data={shop} />
              <BuyOptions shopSlug={shop?.data.slug} shopId={shop?.data.id} />
              <WorkingSchedule data={shop?.data?.shop_working_days} />
            </div>
          </div>
        </div>
        <div className="md:my-20 my-7 bg-gray-faq rounded-button md:px-6 px-5 md:py-9 py-7">
          <SlidableProductList
            title="products"
            link="/products"
            visibleListCount={4}
            params={{ shop_id: shop?.data.id }}
          />
        </div>
        <NearbyShops shop={shop?.data} />
      </section>
      <div className="fixed bottom-0 w-full rounded-t-2xl px-4 py-5 lg:hidden bg-white z-[8] shadow-fixedBooking">
        <Button color="black" fullWidth as={Link} href={`/shops/${params.id}/booking`}>
          <Translate value="book.now" />
        </Button>
      </div>
    </>
  );
};

export default SingleShop;
