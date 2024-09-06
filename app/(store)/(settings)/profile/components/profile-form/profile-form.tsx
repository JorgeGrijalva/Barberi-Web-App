"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/input";
import React from "react";
import { UpdateProfileFormValues, UserDetail } from "@/types/user";
import { PhoneInput } from "@/components/phone-input";
import { useTranslation } from "react-i18next";
import { Avatar } from "@/app/(store)/(settings)/avatar";

const schema = yup
  .object({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    email: yup.string().email(),
    phone: yup.string(),
  })
  .required();

interface ProfileFormProps {
  defaultValues?: UserDetail;
  onSubmit: (body: UpdateProfileFormValues) => void;
}

const ProfileForm = ({ defaultValues, onSubmit }: ProfileFormProps) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<UpdateProfileFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstname: defaultValues?.firstname,
      lastname: defaultValues?.lastname,
      email: defaultValues?.email,
      phone: defaultValues?.phone,
    },
  });

  const handleFinish = (data: UpdateProfileFormValues) => {
    onSubmit(data);
  };

  return (
    <form id="profile" onSubmit={handleSubmit(handleFinish)}>
      <div className="lg:w-4/5 w-full">
        <h1 className="font-semibold text-xl mb-5">{t("edit.profile")}</h1>
        <div className="relative max-w-max mb-8">
          <Avatar data={defaultValues} />
        </div>
        <div className="grid md:grid-cols-2 md:gap-24 gap-4">
          <div className="flex flex-col gap-4">
            <Input
              error={errors.firstname?.message}
              {...register("firstname")}
              label={t("firstname")}
              fullWidth
              required
            />
            <Input
              {...register("lastname")}
              error={errors.lastname?.message}
              label={t("lastname")}
              fullWidth
              required
            />
          </div>
          <div className="flex flex-col gap-4">
            <Input
              label={t("email.address")}
              {...register("email")}
              error={errors.email?.message}
              fullWidth
              required
              disabled
            />
            <PhoneInput
              value={watch("phone")}
              error={errors.phone?.message}
              country="us"
              onChange={(value) => setValue("phone", value)}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
