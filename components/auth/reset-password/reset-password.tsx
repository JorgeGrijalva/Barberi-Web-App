"use client";

import { useTranslation } from "react-i18next";
import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { PasswordUpdateBody } from "@/types/user";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/user";
import NetworkError from "@/utils/network-error";
import { error, success } from "@/components/alert";
import { useRouter } from "next/navigation";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

const schema = yup.object({
  password: yup.string().required(),
  password_confirmation: yup
    .string()
    .nullable()
    .oneOf([yup.ref("password"), null]),
});

type FormData = yup.InferType<typeof schema>;

const ResetPassword = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { mutate, isLoading } = useMutation({
    mutationFn: (body: PasswordUpdateBody) => userService.updatePassword(body),
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleUpdatePassword = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        success(t("successfully.updated"));
        router.replace("/");
      },
    });
  };

  return (
    <div className="flex flex-col gap-6  ">
      <h1 className="font-semibold text-[30px] mb-2 text-start">{t("reset.password")}</h1>
      <form id="reset" onSubmit={handleSubmit(handleUpdatePassword)}>
        <div className="flex flex-col gap-3 mb-8 w-full">
          <Input
            fullWidth
            {...register("password")}
            error={errors.password?.message}
            label={t("password")}
          />
          <Input
            fullWidth
            {...register("password_confirmation")}
            error={errors.password_confirmation?.message}
            label={t("password.confirmation")}
          />
        </div>
        <Button loading={isLoading} fullWidth type="submit" form="reset">
          {t("reset")}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
