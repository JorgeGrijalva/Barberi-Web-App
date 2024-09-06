"use client";

import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { LoadingCard } from "@/components/loading";
import { useAuth } from "@/hook/use-auth";
import { AuthViews } from "./types";
import { Translate } from "../translate";

const SignUp = dynamic(() => import("./sign-up"), {
  loading: () => <LoadingCard />,
});
const Login = dynamic(() => import("./login"), {
  loading: () => <LoadingCard />,
});
const ForgotPassword = dynamic(() => import("./forgot-password"), {
  loading: () => <LoadingCard />,
});

interface AuthProps {
  defaultView?: AuthViews;
  redirectOnSuccess?: boolean;
}

export default async ({ defaultView = "SIGNUP", redirectOnSuccess = true }: AuthProps) => {
  const [currentView, setCurrentView] = useState<AuthViews>(defaultView);
  const handleChangeView = useCallback((view: AuthViews) => setCurrentView(view), []);
  const renderView = () => {
    switch (currentView) {
      case "SIGNUP":
        return <SignUp />;
      case "LOGIN":
        return <Login onViewChange={handleChangeView} redirectOnSuccess={redirectOnSuccess} />;
      case "FORGOT_PASSWORD":
        return <ForgotPassword onViewChange={handleChangeView} />;

      default:
        return <SignUp />;
    }
  };
  const { logOut } = useAuth();

  return (
    <>
      {renderView()}
      <button onClick={logOut}>
        <Translate value="sign.out" />
      </button>
    </>
  );
};
