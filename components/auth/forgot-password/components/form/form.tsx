import { Input } from "@/components/input";
import { Button } from "@/components/button";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ConfirmationResult } from "@firebase/auth";
import { error } from "@/components/alert";
import { useAuth } from "@/hook/use-auth";
import { ForgotPasswordViews } from "@/components/auth/types";

const schema = yup.object({
  credential: yup.string().required(),
});
type FormData = yup.InferType<typeof schema>;

interface ForgotPasswordFormProps {
  onChangeView: (view: ForgotPasswordViews) => void;
  onSuccess: (data: { credential: string; callback: ConfirmationResult }) => void;
}

const Form = ({ onChangeView, onSuccess }: ForgotPasswordFormProps) => {
  const { t } = useTranslation();
  const { phoneNumberSignIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleCheckCredential = (data: FormData) => {
    if (data.credential.includes("@")) {
      error(t("sign.up.with.email.not.working"));
      return;
    }
    setIsSubmitting(true);
    phoneNumberSignIn(data.credential)
      .then((value) => {
        onSuccess({
          credential: data.credential,
          callback: value,
        });
        onChangeView("VERIFY");
      })
      .catch(() => {
        error(t("sms.not.sent"));
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="flex flex-col gap-6 ">
      <h1 className="font-semibold text-[30px] mb-2 text-start">{t("forgot.password")}</h1>
      <form id="forgot" onSubmit={handleSubmit(handleCheckCredential)}>
        <div className="flex flex-col gap-3 mb-3 w-full">
          <Input
            {...register("credential")}
            error={errors.credential?.message}
            fullWidth
            label={t("email.or.phone")}
          />
        </div>
      </form>
      <Button id="sign-in-button" loading={isSubmitting} form="forgot" type="submit" fullWidth>
        {t("submit")}
      </Button>
    </div>
  );
};

export default Form;
