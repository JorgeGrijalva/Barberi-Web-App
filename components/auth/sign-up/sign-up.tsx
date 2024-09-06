"use client";

import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { ConfirmationResult } from "@firebase/auth";
import { LoadingCard } from "@/components/loading";
import { SignUpViews } from "../types";

const SignUpForm = dynamic(() => import("./components/sign-up-form"), {
  loading: () => <LoadingCard />,
});
const OtpVerify = dynamic(() => import("./components/confirmation"), {
  loading: () => <LoadingCard />,
});
const AuthComplete = dynamic(() => import("./components/complete"), {
  loading: () => <LoadingCard />,
});

const SignUp = () => {
  const [currentView, setCurrentView] = useState<SignUpViews>("SIGNUP");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | undefined>();
  const [currentCredential, setCredential] = useState<string | undefined>();
  const handleChangeView = useCallback((view: SignUpViews) => setCurrentView(view), []);
  const [idToken, setIdToken] = useState<string | undefined>();
  const renderView = () => {
    switch (currentView) {
      case "SIGNUP":
        return (
          <SignUpForm
            onChangeView={handleChangeView}
            onSuccess={({ credential, callback }) => {
              setCredential(credential);
              setConfirmationResult(callback);
            }}
          />
        );
      case "VERIFY":
        return (
          <OtpVerify
            confirmationResult={confirmationResult}
            credential={currentCredential}
            onChangeView={handleChangeView}
            onSuccess={(value) => setIdToken(value)}
          />
        );
      case "COMPLETE":
        return <AuthComplete idToken={idToken} credential={currentCredential} />;

      default:
        return (
          <SignUpForm
            onChangeView={handleChangeView}
            onSuccess={({ credential, callback }) => {
              setCredential(credential);
              setConfirmationResult(callback);
            }}
          />
        );
    }
  };
  return renderView();
};

export default SignUp;
