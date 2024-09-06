"use client";

import React, { createContext, useContext, useMemo, useReducer } from "react";
import { InitialStateType, CheckoutActions, checkoutReducer } from "./checkout.reducer";

const initialState: InitialStateType = {
  deliveryType: "delivery",
  deliveryDate: new Date(Date.now()),
  notes: {},
  shopNotes: {},
  coupons: {},
};

const CheckoutContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<CheckoutActions>;
}>({ state: initialState, dispatch: () => null });

const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);
  const memoizedValue = useMemo(() => ({ state, dispatch }), [state]);
  return <CheckoutContext.Provider value={memoizedValue}>{children}</CheckoutContext.Provider>;
};

export default CheckoutProvider;
export const useCheckout = () => {
  const checkoutContext = useContext(CheckoutContext);

  if (!checkoutContext) {
    throw new Error("useCheckout has to be used within <CheckoutContext.Provider>");
  }

  return checkoutContext;
};
