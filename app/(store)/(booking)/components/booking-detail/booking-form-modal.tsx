import { Modal } from "@/components/modal";
import { useModal } from "@/hook/use-modal";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import type { BookingForm } from "@/types/booking-form";
import { Booking } from "@/types/booking";
import { Paginate } from "@/types/global";
import AnchorLeftIcon from "@/assets/icons/anchor-left";

const BookingFormComponent = dynamic(
  () => import("../booking-form").then((component) => ({ default: component.BookingFormPanel })),
  {
    loading: () => <LoadingCard />,
  }
);

interface BookingFormModalProps {
  form?: BookingForm;
  booking: Booking;
  parentId?: number;
  allForms?: Paginate<BookingForm>;
}

export const BookingFormModal = ({ form, booking, parentId, allForms }: BookingFormModalProps) => {
  const [isFormModalOpen, openFormModal, closeFormModal] = useModal();
  if (!form) return null;
  return (
    <>
      <button
        onClick={openFormModal}
        className="text-base flex items-center justify-between focus-ring outline-none w-full font-semibold py-4"
      >
        {form?.translation?.title}{" "}
        <span>
          <AnchorLeftIcon style={{ rotate: "180deg" }} />
        </span>
      </button>
      <Modal withCloseButton isOpen={isFormModalOpen} onClose={closeFormModal}>
        <BookingFormComponent
          data={form}
          allForms={booking?.data?.form || allForms?.data}
          bookingId={booking?.id}
          parentId={parentId}
        />
      </Modal>
    </>
  );
};
