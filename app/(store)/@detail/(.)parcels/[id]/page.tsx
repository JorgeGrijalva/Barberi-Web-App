"use client";

import { useRouter } from "next/navigation";
import { OrderDetailLoading } from "@/components/order-detail/order-detail-loading";
import { Modal } from "@/components/modal";
import { Suspense } from "react";
import ParcelDetail from "../../../../../components/parcel-detail";

const OrderDetailsModal = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  return (
    <Modal
      disableCloseOnOverlayClick
      withCloseButton
      isOpen
      onClose={() => router.back()}
      transparent
    >
      <Suspense fallback={<OrderDetailLoading />}>
        <ParcelDetail id={Number(params.id)} />
      </Suspense>
    </Modal>
  );
};

export default OrderDetailsModal;
