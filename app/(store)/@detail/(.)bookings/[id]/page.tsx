"use client";

import { useRouter } from "next/navigation";
import { Modal } from "@/components/modal";
import { BookingDetail } from "@/app/(store)/(booking)/components/booking-detail";

const BookingDetailModal = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  return (
    <Modal disableCloseOnOverlayClick withCloseButton isOpen onClose={() => router.back()}>
      <BookingDetail id={Number(params.id)} />
    </Modal>
  );
};

export default BookingDetailModal;
