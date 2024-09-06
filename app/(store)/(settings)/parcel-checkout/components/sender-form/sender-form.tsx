import { Input } from "@/components/input";
import { useTranslation } from "react-i18next";
import { PhoneInput } from "@/components/phone-input";
import { useFormContext } from "react-hook-form";
import { ParcelFormValues } from "@/types/parcel";

export const SenderForm = () => {
  const { t } = useTranslation();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ParcelFormValues>();
  return (
    <div className="lg:col-span-1 col-span-2">
      <h2 className="text-lg font-medium mb-7">{t("sender.details")}</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <PhoneInput
          value={watch("phone_from")}
          onChange={(value) => setValue("phone_from", value)}
          error={errors.phone_from?.message}
        />
        <Input
          fullWidth
          label={t("username")}
          {...register("username_from")}
          error={errors.username_from?.message}
          required
        />
        <Input
          fullWidth
          label={t("house")}
          {...register("house_from")}
          error={errors.house_from?.message}
          required
        />
        <Input
          fullWidth
          label={t("stage")}
          {...register("stage_from")}
          error={errors.stage_from?.message}
          required
        />
        <Input
          fullWidth
          label={t("room")}
          {...register("room_from")}
          error={errors.room_from?.message}
          required
        />
        <div className="sm:col-span-2">
          <Input
            fullWidth
            label={t("comment")}
            {...register("note")}
            error={errors.note?.message}
          />
        </div>
      </div>
    </div>
  );
};
