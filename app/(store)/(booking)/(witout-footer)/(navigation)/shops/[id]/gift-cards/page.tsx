import React from "react";
import { BackButton } from "@/components/back-button";
import { cookies } from "next/headers";
import { shopService } from "@/services/shop";
import { GiftCardList } from "./list";
import { GiftCardPurchase } from "./purchase";

const GiftCartList = async ({ params }: { params: { id: string } }) => {
  const lang = cookies().get("lang")?.value;
  const currencyId = cookies().get("currency_id")?.value;
  const shop = await shopService.getBySlug(params.id, { lang, currency_id: currencyId });
  return (
    <div className="xl:container px-4 md:mt-7">
      <div className="hidden lg:block">
        <BackButton />
      </div>
      <div className="grid lg:grid-cols-3 gap-7 mt-6">
        <div className="lg:col-span-2 rounded-button md:border border-gray-link md:px-5 md:py-6">
          <GiftCardList />
        </div>
        <div>
          <GiftCardPurchase data={shop?.data} />
        </div>
      </div>
    </div>
  );
};

export default GiftCartList;
