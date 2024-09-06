import { AsyncSelect } from "@/components/async-select";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { ParcelFormValues } from "@/types/parcel";
import { useQuery } from "@tanstack/react-query";
import { parcelService } from "@/services/parcel";
import dynamic from "next/dynamic";
import { useSettings } from "@/hook/use-settings";
import { AddressButton } from "./address-button";

const ParcelMap = dynamic(() =>
  import("@/components/parcel-map").then((component) => ({
    default: component.ParcelMap,
  }))
);

export const MainForm = () => {
  const { t } = useTranslation();
  const { currency } = useSettings();
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<ParcelFormValues>();
  const locationFrom = watch("location_from");
  const locationTo = watch("location_to");
  const type = watch("type");
  const { data: price } = useQuery(
    ["calculateParcel", locationFrom, locationTo, type, currency],
    () =>
      parcelService.calculate({
        "address_from[latitude]": locationFrom.lat,
        "address_from[longitude]": locationFrom.lng,
        "address_to[latitude]": locationTo.lat,
        "address_to[longitude]": locationTo.lng,
        type_id: type.id,
        currency_id: currency?.id,
      }),
    {
      enabled: Boolean(type),
      select: (data) => data.data.price,
      retry: false,
      meta: {
        showErrorMessageFromServer: true,
      },
    }
  );
  return (
    <div className="col-span-2 relative">
      <div className="h-[600px] relative hidden md:block">
        <ParcelMap
          price={price}
          locationFrom={watch("location_from")}
          locationTo={watch("location_to")}
        />
      </div>
      <div className="md:absolute bg-transparent bottom-4 left-4 right-4 md:bg-white md:dark:bg-dark md:dark:bg-opacity-80 md:bg-opacity-90 md:p-5 rounded-2xl grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-3">
        <AddressButton
          address={watch("address_from")}
          location={watch("location_from")}
          label="pickup.from"
          onChange={(value) => {
            setValue("address_from", value.address || "");
            setValue("location_from", value.location);
          }}
          required
          error={errors.address_from?.message}
        />
        <AddressButton
          address={watch("address_to")}
          location={watch("location_to")}
          label="delivery.to"
          onChange={(value) => {
            setValue("address_to", value.address || "");
            setValue("location_to", value.location);
          }}
          required
          error={errors.address_to?.message}
        />
        <AsyncSelect
          onSelect={(value) =>
            setValue("type", value, {
              shouldValidate: true,
            })
          }
          extractTitle={(value) => value?.type || ""}
          extractKey={(value) => value?.id}
          queryKey="v1/rest/parcel-order/types"
          label="type"
          size="medium"
          value={watch("type")}
          error={errors.type?.id?.message}
          required
        />
        <div className="flex flex-col">
          <label htmlFor="time" className="text-sm mb-1">
            {t("delivery.to")}*
          </label>
          <input
            className="rounded-2xl border border-gray-inputBorder px-4 py-2.5 text-sm bg-transparent outline-none"
            type="datetime-local"
            min={new Date().toISOString().slice(0, new Date().toISOString().lastIndexOf(":"))}
            {...register("delivery_date_time")}
          />
          {errors.delivery_date_time && (
            <p role="alert" className="text-sm text-red mt-1">
              {errors.delivery_date_time.message}
            </p>
          )}
        </div>
        <AsyncSelect
          onSelect={(value) => setValue("payment", value, { shouldValidate: true })}
          extractTitle={(value) => value?.tag || ""}
          extractKey={(value) => value?.id}
          queryKey="v1/rest/payments"
          label="payment.type"
          size="medium"
          value={watch("payment")}
          error={errors.payment?.id?.message}
          required
        />
      </div>
    </div>
  );
};
