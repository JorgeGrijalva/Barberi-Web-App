import { Input } from "@/components/input";
import Link from "next/link";
import { Button } from "@/components/button";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignUpViews } from "@/components/auth/types";
import { ConfirmationResult } from "@firebase/auth";
import { error } from "@/components/alert";
import { useAuth } from "@/hook/use-auth";
import { authService } from "@/services/auth";
import { PhoneInput } from "@/components/ui/phone-input";

const schema = yup.object({
  email: yup.string().email(),
  phone: yup.string(),
  agreed: yup.boolean().required(),
});
type FormData = yup.InferType<typeof schema>;

interface SignUpFormProps {
  onChangeView: (view: SignUpViews) => void;
  onSuccess: (data: { credential: string; callback?: ConfirmationResult }) => void;
}

const SignUpForm = ({ onChangeView, onSuccess }: SignUpFormProps) => {
  const { t } = useTranslation();
  const { phoneNumberSignIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const handleCheckphone = (data: FormData) => {
    setIsSubmitting(true);
    if (data.email?.includes("@")) {
      authService
        .signUp({ email: data.email })
        .then(() => {
          onSuccess({
            credential: data.email ?? "",
          });
          onChangeView("VERIFY");
        })
        .catch((err) => error(err.message))
        .finally(() => setIsSubmitting(false));
    } else {
      phoneNumberSignIn(data.phone ?? "")
        .then((value) => {
          onSuccess({
            credential: data.phone ?? "",
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
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    errors.phone && error(t("invalid.phone.or.email"));
  }, [errors]);

  return (
    <div className="flex flex-col gap-6 ">
      <h1 className="font-semibold text-[30px] mb-2 text-start">{t("sign.up")}</h1>
      <form id="signUp" onSubmit={handleSubmit(handleCheckphone)}>
        <div className="flex flex-col gap-3 mb-3 w-full">
          <label className="text-sm text-gray-500" htmlFor="email">
            {t("email")}
          </label>
          <Input
            type="email"
            label={t("email")}
            error={errors.email?.message}
            {...register("email")}
            fullWidth
          />
          <div className="justify-center flex">
            <span className="text-sm text-gray-500">{t("or")}</span>
          </div>
          <label className="text-sm text-gray-500" htmlFor="phone">
            {t("phone")}
          </label>
          <PhoneInput
            className="text-black"
            type="tel"
            // value={phoneNumber}
            {...register("phone")}
            onChange={(e: string) => {
              console.log(e);

              // setPhoneNumber(e);
            }}
            defaultCountry="MX"
          />
          <div className="flex items-center mt-2.5">
            <input
              id="link-checkbox"
              type="checkbox"
              {...register("agreed")}
              className="w-4 h-4 accent-primary bg-gray-100 border-gray-inputBorder rounded-full focus:ring-primary focus:ring-2"
            />
            <label htmlFor="link-checkbox" className="ml-2 text-sm font-medium">
              {t("i.agree.with")}{" "}
              <Link href="/terms" className="text-primary hover:underline">
                {t("terms.and.conditions")}
              </Link>
            </label>
          </div>
        </div>
      </form>
      <Button
        id="sign-in-button"
        loading={isSubmitting}
        form="signUp"
        type="submit"
        disabled={!watch("agreed")}
        fullWidth
      >
        {t("sign.up")}
      </Button>
    </div>
  );
};

export default SignUpForm;
