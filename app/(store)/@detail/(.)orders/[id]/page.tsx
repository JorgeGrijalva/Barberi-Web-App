"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { Modal } from "@/components/modal";
import { OrderDetailLoading } from "@/components/order-detail/order-detail-loading";
import OrderDetail from "../../../../../components/order-detail";

const OrderDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  return (
    <Modal
      transparent
      disableCloseOnOverlayClick
      withCloseButton
      isOpen
      onClose={() => router.back()}
    >
      <Suspense fallback={<OrderDetailLoading />}>
        <OrderDetail id={Number(params.id)} onRepeat={() => router.push("/cart")} />
      </Suspense>
    </Modal>
  );
};

export default OrderDetailsPage;
