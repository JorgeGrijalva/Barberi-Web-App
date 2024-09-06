"use client";

import React, { createContext, useContext, useMemo, useReducer } from "react";
import { BookingActions, bookingReducer, InitialStateType } from "./booking.reducer";

const initialState: InitialStateType = {
  services: [],
  coupon: undefined,
};

const BookingContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<BookingActions>;
}>({ state: initialState, dispatch: () => null });

const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const memoizedValue = useMemo(() => ({ state, dispatch }), [state]);
  return <BookingContext.Provider value={memoizedValue}>{children}</BookingContext.Provider>;
};

export default BookingProvider;
export const useBooking = () => {
  const bookingContext = useContext(BookingContext);

  if (!bookingContext) {
    throw new Error("useBooking has to be used within <Booking.Provider>");
  }

  return bookingContext;
};
