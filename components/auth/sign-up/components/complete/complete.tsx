import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { authService } from "@/services/auth";
import { SignInResponse, SignUpCredentials } from "@/types/user";
import { error, success } from "@/components/alert";
import { setCookie } from "cookies-next";
import { userService } from "@/services/user";
import { useFcmToken } from "@/hook/use-fcm-token";
import useUserStore from "@/global-store/user";
import { useRouter, useSearchParams } from "next/navigation";
import { useSyncServer } from "@/hook/use-sync-server";

const schema = yup.object({
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  referral: yup.string().optional(),
  password: yup.string().required(),
  password_confirmation: yup
    .string()
    .nullable()
    .oneOf([yup.ref("password"), null]),
});
type FormData = yup.InferType<typeof schema>;

interface CompleteProps {
  credential?: string;
  idToken?: string;
}

const Complete = ({ credential, idToken }: CompleteProps) => {
  const { t } = useTranslation();
  const { handleSync } = useSyncServer();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fcmToken } = useFcmToken();
  const localSignIn = useUserStore((state) => state.signIn);
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [email, setEmail] = useState("");

  const handleSuccessSignUp = (res: SignInResponse) => {
    success("successfully.signed.up");
    setCookie("token", `${res.token_type} ${res.access_token}`);
    if (fcmToken) {
      userService.updateFirebaseToken({ firebase_token: fcmToken });
    }
    localSignIn(res.user);
    handleSync();
    if (searchParams.has("redirect")) {
      router.replace(searchParams.get("redirect") as string);
    } else {
      router.replace("/");
    }
  };
  const handleSignUpComplete = (values: FormData) => {
    setIsSubmitting(true);
    const body: SignUpCredentials = values;
    if (credential?.includes("@")) {
      body.email = credential;
    } else {
      body.phone = credential?.replace(/[^0-9]/g, "");
      body.type = "firebase";
      body.id = idToken;
    }
    if (credential?.includes("@")) {
      authService
        .signUpComplete({
          ...body,
          email,
        })
        .then(({ data }) => {
          handleSuccessSignUp(data);
        })
        .catch((err) => error(t(err?.message)))
        .finally(() => setIsSubmitting(false));
      return;
    }

    authService
      .phoneSignUpComplete(body)
      .then(({ data }) => {
        handleSuccessSignUp(data);
      })
      .catch((err) => error(t(err?.message)))
      .finally(() => setIsSubmitting(false));
  };

  useEffect(() => {
    if (credential?.includes("@")) {
      setEmail(credential);
    }
  }, [credential]);

  return (
    <div className="flex flex-col gap-6  ">
      <h1 className="font-semibold text-[30px] mb-2 text-start">{t("complete.auth")}</h1>
      <form id="complete" onSubmit={handleSubmit(handleSignUpComplete)}>
        <div className="flex flex-col gap-3 mb-8 w-full">
          <Input
            fullWidth
            {...register("firstname")}
            label={t("firstname")}
            error={errors.firstname?.message}
          />
          <Input
            fullWidth
            {...register("lastname")}
            label={t("lastname")}
            error={errors.lastname?.message}
          />
          <Input
            fullWidth
            {...register("referral")}
            label={t("referral")}
            error={errors.referral?.message}
          />
          <Input
            fullWidth
            {...register("password")}
            label={t("password")}
            type="password"
            error={errors.password?.message}
          />
          <Input
            fullWidth
            {...register("password_confirmation")}
            label={t("password.confirmation")}
            type="password"
            error={errors.password_confirmation?.message}
          />
          {!credential?.includes("@") && (
            <Input fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
          )}
        </div>
        <Button loading={isSubmitting} fullWidth type="submit" form="complete">
          {t("complete")}
        </Button>
      </form>
    </div>
  );
};

export default Complete;
