"use client";

import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultLocation, internalPayments } from "@/config/global";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ParcelCreateBody } from "@/types/parcel";
import { parcelService } from "@/services/parcel";
import dayjs from "dayjs";
import NetworkError from "@/utils/network-error";
import { error, success } from "@/components/alert";
import { useRouter } from "next/navigation";
import { useExternalPayment } from "@/hook/use-external-payment";
import { useSettings } from "@/hook/use-settings";
import { MainForm } from "./components/main-form";
import { ReceiverForm } from "./components/receiver-form";
import { SenderForm } from "./components/sender-form";

const schema = yup.object({
  address_from: yup.string().required(),
  location_from: yup
    .object({
      lat: yup.number().required(),
      lng: yup.number().required(),
    })
    .required(),
  phone_from: yup.string().required(),
  username_from: yup.string().required(),
  house_from: yup.string().required(),
  stage_from: yup.string().required(),
  room_from: yup.string().required(),
  type: yup
    .object({
      type: yup.string().required(),
      id: yup.number().required(),
    })
    .required(),
  payment: yup
    .object({
      tag: yup.string().required(),
      id: yup.number().required(),
      input: yup.number(),
      active: yup.boolean().required(),
    })
    .required(),
  address_to: yup.string().required(),
  location_to: yup
    .object({
      lat: yup.number().required(),
      lng: yup.number().required(),
    })
    .required(),
  phone_to: yup.string().required(),
  username_to: yup.string().required(),
  house_to: yup.string().required(),
  stage_to: yup.string().required(),
  room_to: yup.string().required(),
  delivery_date_time: yup.string().required(),
  note: yup.string(),
  description: yup.string().required(),
  instructions: yup.string(),
  qr_value: yup.string().required(),
  notify: yup.boolean(),
});

type FormData = yup.InferType<typeof schema>;

const ParcelPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation();
  const { currency } = useSettings();
  const { mutate: externalPay, isLoading: isExternalPayLoading } = useExternalPayment();
  const { mutate: createParcelOrder, isLoading: isCreating } = useMutation({
    mutationFn: (body: ParcelCreateBody) => parcelService.create(body),
    onError: (err: NetworkError) => {
      error(err.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["profile"], { exact: false });
      await queryClient.invalidateQueries(["cart"], { exact: false });
      success(t("parcel.order.created.successfully"));
    },
  });

  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      location_from: defaultLocation,
      location_to: defaultLocation,
    },
  });
  const handleCreateParcelOrder = (data: FormData) => {
    const body: ParcelCreateBody = {
      address_from: {
        address: data.address_from,
        house: data.house_from,
        latitude: data.location_from.lat,
        room: data.room_from,
        stage: data.stage_from,
        longitude: data.location_from.lng,
      },
      address_to: {
        address: data.address_to,
        house: data.house_to,
        latitude: data.location_to.lat,
        longitude: data.location_to.lng,
        room: data.room_to,
        stage: data.stage_to,
      },
      description: data.description,
      note: data.note,
      notify: Number(data.notify ? data.notify : 0),
      phone_from: data.phone_from,
      phone_to: data.phone_to,
      qr_value: data.qr_value,
      instructions: data.instructions,
      currency_id: currency?.id,
      rate: currency?.rate,
      username_to: data.username_to,
      delivery_date: dayjs(data.delivery_date_time).format("YYYY-MM-DD HH:mm"),
      username_from: data.username_from,
      type_id: data.type.id.toString(),
    };
    if (internalPayments.includes(data.payment.tag)) {
      body.payment_id = data.payment.id;
    }
    createParcelOrder(body, {
      onSuccess: (res) => {
        if (!internalPayments.includes(data.payment.tag)) {
          externalPay({ tag: data.payment.tag, data: { parcel_id: res.data.id } });
        }
        methods.reset();
        router.push(`/parcels/${res.data.id}`);
      },
    });
  };
  return (
    <FormProvider {...methods}>
      <h1 className="text-xl font-medium mb-7">{t("door.to.door.delivery")}</h1>
      <form onSubmit={methods.handleSubmit(handleCreateParcelOrder)}>
        <div className="grid grid-cols-2 gap-7">
          <MainForm />
          <SenderForm />
          <ReceiverForm isSubmitting={isCreating || isExternalPayLoading} />
        </div>
      </form>
    </FormProvider>
  );
};

export default ParcelPage;
