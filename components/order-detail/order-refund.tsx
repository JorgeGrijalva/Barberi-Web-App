import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { Modal } from "@/components/modal";
import { useModal } from "@/hook/use-modal";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import Refund2LineIcon from "remixicon-react/Refund2LineIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RefundCreateBody } from "@/types/order";
import refundService from "@/services/refund";
import { error, success } from "@/components/alert";
import NetworkError from "@/utils/network-error";

const schema = yup.object({
  cause: yup.string().required(),
});

type FormData = yup.InferType<typeof schema>;

export const OrderRefund = ({ orderId }: { orderId?: number }) => {
  const [isFormOpen, openForm, closeForm] = useModal();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutate: refund, isLoading } = useMutation({
    mutationFn: (body: RefundCreateBody) => refundService.create(body),
    onError: (err: NetworkError) => error(err.message),
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const handleRefund = (data: FormData) => {
    refund(
      { cause: data.cause, order_id: orderId },
      {
        onSuccess: () => {
          success("request.sent");
          queryClient.invalidateQueries(["order", orderId]);
          reset();
          closeForm();
        },
      }
    );
  };
  return (
    <>
      <button onClick={openForm} className="inline-flex items-center gap-2.5 text-red text-sm">
        <Refund2LineIcon />
        {t("refund")}
      </button>
      <Modal withCloseButton isOpen={isFormOpen} onClose={closeForm}>
        <div className="p-5">
          <div className="text-xl font-medium mb-4">{t("order.refund")}</div>
          <form onSubmit={handleSubmit(handleRefund)}>
            <div className="my-4">
              <Input
                fullWidth
                {...register("cause")}
                error={errors.cause?.message}
                label={t("why.do.you.want.to.refund")}
              />
            </div>
            <Button loading={isLoading} type="submit">
              {t("submit")}
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};
