import { CartDetail } from "@/types/cart";
import React from "react";
import useCartStore from "@/global-store/cart";
import dynamic from "next/dynamic";
import useUserStore from "@/global-store/user";
import { ExpandableShop } from "@/components/expandable-shop";
import { Types } from "@/context/checkout/checkout.reducer";
import { useCheckout } from "@/context/checkout/checkout.context";
import CartProduct from "../cart-product";
import { CouponCheck } from "../coupon-check";

const Empty = dynamic(() =>
  import("@/components/empty").then((component) => ({ default: component.Empty }))
);

interface CartItemProps {
  data: CartDetail;
  disabled?: boolean;
  cartUuid?: string;
  userId?: number;
  showCoupon?: boolean;
}

export const CartItem = ({ data, disabled, cartUuid, userId, showCoupon }: CartItemProps) => {
  const userCartUuid = useCartStore((state) => state.userCartUuid);
  const user = useUserStore((state) => state.user);
  const { dispatch } = useCheckout();
  return (
    <ExpandableShop
      shop={data?.shop}
      defaultOpen={data?.cartDetailProducts?.length !== 0}
      showEstimatedTime
    >
      <div className="flex flex-col lg:col-span-5 col-span-7 gap-7 ">
        {data.cartDetailProducts?.length === 0 ? (
          <Empty animated={false} />
        ) : (
          data.cartDetailProducts?.map((product) => (
            <CartProduct
              isCalculating={disabled}
              key={product.id}
              data={product}
              disabled={userCartUuid ? userCartUuid !== cartUuid : user?.id !== userId}
              showNoteButton={!userCartUuid}
            />
          ))
        )}
      </div>
      {showCoupon && (
        <div className="md:my-7 my-4 flex flex-col md:gap-4 gap-2">
          <CouponCheck
            shopId={data.shop_id}
            onCouponCheckSuccess={(coupon) =>
              dispatch({
                type: Types.UpdateShopCoupon,
                payload: { shopId: data.shop_id, name: coupon.name },
              })
            }
            onCouponCheckError={() =>
              dispatch({
                type: Types.UpdateShopCoupon,
                payload: { shopId: data.shop_id },
              })
            }
            onCouponDelete={() =>
              dispatch({ type: Types.DeleteShopCoupon, payload: { shopId: data.shop_id } })
            }
          />
        </div>
      )}
    </ExpandableShop>
  );
};
