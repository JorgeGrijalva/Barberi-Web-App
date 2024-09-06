"use client";

import { Modal } from "@/components/modal";
import { Price } from "@/components/price";
import { useModal } from "@/hook/use-modal";
import { MembershipDetail } from "@/types/membership";
import Image from "next/image";
import { useTranslation } from "react-i18next";

interface MembershipDetailProps {
  data?: MembershipDetail;
}
export const MembershipDetailRender = ({ data }: MembershipDetailProps) => {
  const { t } = useTranslation();
  const [isTermsModalOpen, openTermsModal, closeTermsModal] = useModal();
  return (
    <div className="lg:w-4/5">
      <div className="bg-membership_bg bg-cover bg-no-repeat rounded-md md:p-7 p-5 my-5 overflow-hidden">
        <div className="rounded-2xl md:pt-10 md:pb-7 md:px-10 px-5 pt-5 pb-5 flex flex-col justify-between text-white md:gap-[150px] gap-16 bg-noise bg-cover bg-no-repeat backdrop-blur-3xl bg-opacity-10">
          <div className="flex items-center gap-3">
            <div className="md:h-16 md:w-16 relative w-10 h-10">
              <Image
                src={data?.shop?.logo_img || ""}
                alt="shop"
                fill
                className="rounded-full aspect-square object-cover"
              />
            </div>
            <h1 className="line-clamp-1 md:text-3xl text-xl font-normal">
              {data?.shop?.translation?.title}
            </h1>
          </div>
          <div>
            <h2 className="md:text-4xl text-2xl font-semibold">{data?.translation?.title}</h2>
            <p className="md:text-xl text-sm line-clamp-2">{data?.translation?.description}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-wrap mb-7">
        <div className="rounded-button border border-black py-3 px-5">
          <span className="text-base">
            <Price number={data?.price} /> {t("for")} {data?.time}
          </span>
        </div>
      </div>
      {data?.services?.length && (
        <div className="my-5">
          <h4 className="mb-2">{t("services")}:</h4>
          <div className="flex flex-col gap-y-1.5">
            {data?.services?.map((service) => (
              <span className="font-medium" key={service?.service?.id}>
                {service?.service?.translation?.title}
              </span>
            ))}
          </div>
        </div>
      )}
      <button onClick={openTermsModal} className="text-base hover:underline">
        {t("membership.terms")}
      </button>
      <Modal isOpen={isTermsModalOpen} onClose={closeTermsModal} withCloseButton>
        <div className="md:pt-16 md:pb-14 md:px-14 px-4 pb-4 pt-8">
          <strong className="md:text-head text-xl font-semibold">{t("terms.conditions")}</strong>
          <p className="md:text-base text-sm mt-6">{data?.translation?.term}</p>
        </div>
      </Modal>
    </div>
  );
};
