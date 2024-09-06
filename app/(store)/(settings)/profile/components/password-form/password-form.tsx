import { useMutation } from "@tanstack/react-query";
import { PasswordUpdateBody } from "@/types/user";
import { userService } from "@/services/user";
import NetworkError from "@/utils/network-error";
import { error, success } from "@/components/alert";
import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/input";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/button";

const schema = yup.object({
  old_password: yup.string().required(),
  password: yup.string().required(),
  password_confirmation: yup
    .string()
    .nullable()
    .oneOf([yup.ref("password"), null]),
});

type FormData = yup.InferType<typeof schema>;

const PasswordForm = ({ onSuccess }: { onSuccess: () => void }) => {
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

  const handleUpdatePassword = (values: FormData) => {
    mutate(values, {
      onSuccess: () => {
        success(t("successfully.updated"));
        onSuccess();
      },
    });
  };

  return (
    <div className="p-5">
      <div className="text-xl font-bold mb-8">{t("update.password")}</div>
      <form onSubmit={handleSubmit(handleUpdatePassword)}>
        <div className="flex flex-col gap-5">
          <Input
            type="password"
            fullWidth
            label={t("old.password")}
            {...register("old_password")}
            error={errors.old_password?.message}
            required
          />
          <Input
            type="password"
            fullWidth
            label={t("password")}
            {...register("password")}
            error={errors.password?.message}
            required
          />
          <Input
            type="password"
            label={t("confirm.password")}
            fullWidth
            {...register("password_confirmation")}
            error={errors.password_confirmation?.message}
            required
          />
          <Button loading={isLoading} type="submit" fullWidth>
            {t("save")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;
