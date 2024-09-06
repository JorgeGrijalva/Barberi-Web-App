import React from "react";
import CheckoutProvider from "@/context/checkout/checkout.context";

const CartLayout = ({ children }: { children: React.ReactNode }) => (
  <CheckoutProvider>
    <div className="py-7">{children}</div>
  </CheckoutProvider>
);

export default CartLayout;
