import { Service } from "@/types/service";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import { Button } from "@/components/button";
import { useModal } from "@/hook/use-modal";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/modal";
import { Review } from "@/types/review";

const BookingReviewCreate = dynamic(
  () =>
    import("./booking-review-create").then((component) => ({
      default: component.BookingReviewCreate,
    })),
  {
    loading: () => <LoadingCard />,
  }
);

const BookingReviewEdit = dynamic(
  () =>
    import("./booking-review-edit").then((component) => ({
      default: component.BookingReviewEdit,
    })),
  {
    loading: () => <LoadingCard />,
  }
);

interface BookingReviewProps {
  service?: Service | null;
  bookingId?: number;
  bookingParentId?: number;
  initialData: Review | null;
}

export const BookingReview = ({
  service,
  bookingId,
  bookingParentId,
  initialData,
}: BookingReviewProps) => {
  const { t } = useTranslation();
  const [isModalOpen, openModal, closeModal] = useModal();
  return (
    <>
      <Button fullWidth onClick={openModal}>
        {t(initialData ? "edit.review" : "add.review")}
      </Button>
      <Modal isOpen={isModalOpen} onClose={closeModal} withCloseButton>
        <div className="pt-5 pb-7 md:px-6 px-4">
          {initialData ? (
            <BookingReviewEdit
              service={service}
              bookingId={bookingId}
              onSuccess={closeModal}
              bookingParentId={bookingParentId}
              initialData={initialData}
            />
          ) : (
            <BookingReviewCreate
              service={service}
              bookingId={bookingId}
              onSuccess={closeModal}
              bookingParentId={bookingParentId}
            />
          )}
        </div>
      </Modal>
    </>
  );
};
