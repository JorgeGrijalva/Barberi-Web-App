import { CartDetailShop } from "@/types/cart";
import React from "react";
import dynamic from "next/dynamic";
import { ExpandableShop } from "@/components/expandable-shop";
import CartProduct from "../cart-product";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

interface CartItemProps {
  data: CartDetailShop;
  disabled?: boolean;
  loading?: boolean;
}

export const CartItem = ({ data, disabled, loading }: CartItemProps) => (
  <ExpandableShop shop={data?.shop} defaultOpen={data.stocks?.length !== 0} showEstimatedTime>
    <div className="flex flex-col lg:col-span-5 col-span-7 gap-7 ">
      {data.stocks?.length === 0 ? (
        <Empty animated={false} />
      ) : (
        data.stocks?.map((product) => (
          <CartProduct
            disabled={disabled}
            isCalculating={loading}
            key={product.id}
            data={product}
            showNoteButton={false}
          />
        ))
      )}
    </div>
  </ExpandableShop>
);
