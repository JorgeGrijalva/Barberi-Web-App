import QuestionLineIcon from "remixicon-react/QuestionLineIcon";
import { Service } from "@/types/service";
import PlusOutlinedIcon from "@/assets/icons/plus-outlined";
import { IconButton } from "@/components/icon-button";
import { Translate } from "@/components/translate";
import { Price } from "@/components/price";
import { useParams, useRouter } from "next/navigation";
import { useQueryParams } from "@/hook/use-query-params";
import CheckOutlinedIcon from "@/assets/icons/check-outlined";
import { useBooking } from "@/context/booking";
import { Types } from "@/context/booking/booking.reducer";
import { Modal } from "@/components/modal";
import { useModal } from "@/hook/use-modal";
import { ServiceFaqs } from "./service-faqs";

interface ServiceCardProps {
  data?: Service;
  onCardClick?: () => void;
  isBookingPage?: boolean;
}

export const ServiceCard = ({ data, onCardClick, isBookingPage }: ServiceCardProps) => {
  const router = useRouter();
  const params = useParams();
  const { dispatch, state } = useBooking();
  const { setQueryParams } = useQueryParams();
  const selectedService = state.services.find((service) => service.id === data?.id);
  const [isModalOpen, openModal, closeModal] = useModal();
  const isSelected = !!selectedService;
  const hasFAQs = data && data.service_faqs?.length > 0;
  const handleButtonClick = () => {
    if (data) {
      if (data?.service_extras?.length && onCardClick) {
        onCardClick();
      } else {
        dispatch({ type: Types.SelectService, payload: data });
        if (!isBookingPage) {
          router.push(`/shops/${params.id}/booking?offerId=${data.id}`);
          return;
        }
        setQueryParams({ offerId: data.id });
      }
    }
  };
  return (
    <>
      <button
        onClick={onCardClick}
        className=" py-6 px-5 border-t border-gray-link hover:bg-gray-link active:bg-gray-card transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="text-start">
            <div className="flex">
              <p className="text-lg font-bold">{data?.translation?.title}</p>
              {hasFAQs && (
                <button
                  className="ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal();
                  }}
                >
                  <QuestionLineIcon />
                </button>
              )}
            </div>
            <span className="text-base line-clamp-3">{data?.translation?.description}</span>
          </div>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleButtonClick();
            }}
          >
            {isSelected ? <CheckOutlinedIcon /> : <PlusOutlinedIcon />}
          </IconButton>
        </div>
        <div className="flex items-center justify-between mt-5">
          <div className="flex gap-2">
            <div className="border border-gray-field rounded-full py-2 px-5">
              <span className="text-base text-gray-field">
                {data?.interval} <Translate value="min" />
              </span>
            </div>
            {data?.type && (
              <div className="border border-gray-field rounded-full py-2 px-5">
                <span className="text-base text-gray-field">
                  <Translate value={data?.type} />
                </span>
              </div>
            )}
          </div>
          <span className="text-2xl font-semibold">
            <Price
              number={
                (data?.min_price ?? data?.price ?? 0) +
                (selectedService?.selected_service_extra?.price || 0)
              }
            />
          </span>
        </div>
      </button>
      {hasFAQs && data.service_faqs?.length > 0 && (
        <Modal withCloseButton isOpen={isModalOpen} onClose={closeModal}>
          <ServiceFaqs faqs={data.service_faqs} />
        </Modal>
      )}
    </>
  );
};
