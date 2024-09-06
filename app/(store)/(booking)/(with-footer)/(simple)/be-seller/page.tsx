"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { LoadingCard } from "@/components/loading";
import StoreAccepted from "./components/accepted";
import BecomeSellerForm from "./components/form";
import StoreWaiting from "./components/waiting";
import StoreRejected from "./components/rejected";

const BecomeSellerPage = () => {
  const { data: profile, isLoading } = useQuery(["profile"], () => userService.profile());
  if (profile?.data.shop?.status === "new") {
    return <StoreWaiting />;
  }
  if (profile?.data.shop?.status === "approved") {
    return <StoreAccepted />;
  }
  if (profile?.data.shop?.status === "rejected") {
    return <StoreRejected />;
  }
  if (isLoading) {
    return (
      <div className="relative h-[70vh] flex-1">
        <LoadingCard centered />
      </div>
    );
  }
  return <BecomeSellerForm />;
};

export default BecomeSellerPage;
