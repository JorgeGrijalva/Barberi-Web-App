"use client";

import { useBooking } from "@/context/booking";
import { useTranslation } from "react-i18next";
import { TextArea } from "@/components/text-area";
import { Types } from "@/context/booking/booking.reducer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import { Modal } from "@/components/modal";
import CrossIcon from "@/assets/icons/cross";
import { useModal } from "@/hook/use-modal";
import { Button } from "@/components/button";
import MarkIcon from "@/assets/icons/mark";
import Image from "next/image";
import useUserStore from "@/global-store/user";

const Auth = dynamic(() => import("@/components/auth"), {
  loading: () => <LoadingCard />,
});

const MembershipSelect = dynamic(
  () =>
    import("./membership-select").then((component) => ({ default: component.MembershipSelect })),
  {
    loading: () => <LoadingCard />,
  }
);

interface BookingNoteProps {
  shopSlug?: string;
}

export const BookingNotes = ({ shopSlug }: BookingNoteProps) => {
  const { state, dispatch } = useBooking();
  const { t } = useTranslation();
  const router = useRouter();
  const [isMembershipModalOpen, openMembershipModal, closeMembershipModal] = useModal();
  const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>();
  const user = useUserStore((localState) => localState.user);
  const handleChangeNote = (serviceId: number, note: string) => {
    dispatch({ type: Types.SetNote, payload: { serviceId, note } });
  };

  const handleDeleteMembership = (serviceId: number) => {
    dispatch({ type: Types.DeleteMemberShip, payload: serviceId });
  };

  useEffect(() => {
    if (!state.time && shopSlug) {
      router.replace(`/shops/${shopSlug}/booking`);
    }
  }, [state.time, shopSlug]);
  if (!user)
    return (
      <div className="grid xl:grid-cols-2 grid-cols-1 mt-6">
        <div className="lg:border lg:p-5 border-gray-link rounded-button">
          <Auth defaultView="LOGIN" redirectOnSuccess={false} />
        </div>
      </div>
    );

  return (
    <div className="mt-6 flex flex-col gap-3">
      {state.services.map((service) => (
        <div className="border border-gray-link overflow-hidden rounded-button" key={service.id}>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
            <div className="flex items-center gap-1 p-5 md:border-r border-gray-link">
              <div className="w-14 h-14 relative">
                <Image
                  src={service?.master?.img || ""}
                  alt={service?.master?.firstname || "master"}
                  className="rounded-full object-cover"
                  fill
                />
              </div>
              <div className="text-start">
                <p className="text-xl font-medium">{service.master?.firstname}</p>
                <span className="text-sm text-gray-field">
                  {service.master?.translation?.title}
                </span>
              </div>
            </div>
            <div className="text-start p-5 lg:border-r border-t md:border-t-0 border-gray-link">
              <p className="text-lg font-semibold">{service.translation?.title}</p>
              {!!service?.selected_service_extra && (
                <p className="text-base font-medium">
                  {service?.selected_service_extra?.translation?.title}
                </p>
              )}
              <span className="text-sm text-gray-field">
                {service.interval} {t("min")}
              </span>
            </div>
            <div className="text-start p-5 border-t lg:border-none md:col-span-2 lg:col-span-1 border-gray-link">
              <p className="text-xl font-medium">{t("buy.options")}</p>
              <span className="text-sm text-gray-field">{t("enjoy.your.benefits")}</span>
            </div>

            <div className="lg:col-span-2 md:col-span-2 col-span-1 order-5 lg:order-4 border-t lg:border-r border-gray-link p-5">
              <TextArea
                rows={3}
                placeholder={t("type.here")}
                value={service.note || ""}
                onChange={(e) => handleChangeNote(service.id, e.target.value)}
              />
            </div>
            <div className="border-t border-gray-link p-5 order-4 lg:order-5 col-span-1 md:col-span-2 lg:col-span-1">
              {user && (
                <Button
                  color="blackOutlined"
                  leftIcon={<MarkIcon />}
                  size="small"
                  onClick={() => {
                    if (service.membership) {
                      handleDeleteMembership(service.id);
                      return;
                    }
                    openMembershipModal();
                    setSelectedServiceId(service.id);
                  }}
                  rightIcon={service.membership ? <CrossIcon size={20} /> : undefined}
                >
                  {service.membership
                    ? service.membership?.translation?.title
                    : t("select.membership")}
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
      <Modal isOpen={isMembershipModalOpen} onClose={closeMembershipModal} withCloseButton>
        <MembershipSelect serviceId={selectedServiceId} onSelect={closeMembershipModal} />
      </Modal>
    </div>
  );
};
