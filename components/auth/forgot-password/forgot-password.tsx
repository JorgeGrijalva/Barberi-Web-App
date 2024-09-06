"use client";

import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import { ConfirmationResult } from "@firebase/auth";
import { ForgotPasswordViews, AuthScreenProps } from "../types";

const Form = dynamic(() => import("./components/form/form"), {
  loading: () => <LoadingCard />,
});
const OtpVerify = dynamic(() => import("./components/confirmation"), {
  loading: () => <LoadingCard />,
});

const ForgotPassword = ({ onViewChange }: AuthScreenProps) => {
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult>();
  const [currentCredential, setCredential] = useState<string | undefined>();
  const [currentView, setCurrentView] = useState<ForgotPasswordViews>("FORM");
  const handleChangeView = useCallback((view: ForgotPasswordViews) => setCurrentView(view), []);
  const renderView = () => {
    switch (currentView) {
      case "FORM":
        return (
          <Form
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
            onConfirmationResultChange={(value) => setConfirmationResult(value)}
            onVerifySuccess={() => onViewChange("RESET_PASSWORD")}
          />
        );

      default:
        return (
          <Form
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

export default ForgotPassword;
