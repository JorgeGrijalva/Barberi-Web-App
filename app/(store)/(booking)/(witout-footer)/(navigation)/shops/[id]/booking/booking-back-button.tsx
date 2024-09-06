"use client";

import { useBooking } from "@/context/booking";
import { Types } from "@/context/booking/booking.reducer";
import { BackButton } from "@/components/back-button";
import { useCallback } from "react";

interface BookingBackButtonProps {
  deletePayment?: boolean;
  resetAll?: boolean;
  deleteStaff?: boolean;
  deleteNotes?: boolean;
  deleteDate?: boolean;
  deleteAddress?: boolean;
}

export const BookingBackButton = ({
  deletePayment,
  resetAll,
  deleteStaff,
  deleteAddress,
  deleteDate,
  deleteNotes,
}: BookingBackButtonProps) => {
  const { dispatch } = useBooking();
  const handleBack = useCallback(() => {
    if (deletePayment) {
      dispatch({ type: Types.DeletePayment });
      dispatch({ type: Types.DeleteGiftCart });
      return;
    }
    if (resetAll) {
      dispatch({ type: Types.ResetBooking });
      return;
    }
    if (deleteDate) {
      dispatch({ type: Types.ClearDateTime });
      return;
    }
    if (deleteStaff) {
      dispatch({ type: Types.UnSetMaster });
      dispatch({ type: Types.DeleteUnsupportedMastersByServices });
      return;
    }
    if (deleteAddress) {
      dispatch({ type: Types.DeleteAddress });
      return;
    }
    if (deleteNotes) {
      dispatch({ type: Types.DeleteNotes });
    }
  }, [deletePayment, resetAll]);
  return (
    <div className="hidden lg:block">
      <BackButton onClick={handleBack} />
    </div>
  );
};
