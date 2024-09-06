"use client";

import useCartStore from "@/global-store/cart";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useServerCart } from "@/hook/use-server-cart";
import useUserStore from "@/global-store/user";
import BagIcon from "@/assets/icons/bag";

const CartIndicator = () => {
  const [mounted, setMounted] = useState(false);
  const cartList = useCartStore((state) => state.list);
  const cartProductsQuantity = cartList?.length || 0;
  const user = useUserStore((state) => state.user);

  useServerCart(!!user);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const tempCartQuantity = cartProductsQuantity > 99 ? "99+" : cartProductsQuantity;

  return (
    <Link href="/cart" className="rounded-button border border-footerBg py-2.5 px-3">
      <div className="relative">
        <BagIcon />
        {cartProductsQuantity > 0 && (
          <div className="px-2 rounded-full bg-primary absolute -top-4 -right-4">
            <span className="text-white text-sm">{tempCartQuantity}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CartIndicator;
