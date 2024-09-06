"use client";

import React, { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { UpdateProfileBody, UpdateProfileFormValues } from "@/types/user";
import { Button } from "@/components/button";
import { useTranslation } from "react-i18next";
import { error, success } from "@/components/alert";
import NetworkError from "@/utils/network-error";
import dynamic from "next/dynamic";
import { Modal } from "@/components/modal";
import ProfileForm, { FormLoading } from "./components/profile-form";

const PasswordForm = dynamic(() => import("./components/password-form"));

const Profile = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userService.profile(),
  });

  const { mutate: updateProfile, isLoading: isUpdating } = useMutation({
    mutationFn: (body: UpdateProfileBody) => userService.update(body),
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });

  const handleUpdateProfile = useCallback((body: UpdateProfileFormValues) => {
    updateProfile(body, {
      onSuccess: () => {
        queryClient.invalidateQueries(["profile"]);
        success(t("successfully.updated"));
      },
    });
  }, []);

  const handleClosePasswordModal = useCallback(() => {
    setIsPasswordModalOpen(false);
  }, []);

  return (
    <div className="flex-1 relative">
      {isLoading ? (
        <FormLoading />
      ) : (
        <ProfileForm defaultValues={profile?.data} onSubmit={handleUpdateProfile} />
      )}
      {!isLoading && (
        <div className="grid md:grid-cols-2 md:gap-24 gap-4 mt-7 lg:w-4/5 w-full">
          <Button form="profile" loading={isUpdating} fullWidth type="submit">
            {t("save")}
          </Button>
          <Button
            onClick={() => setIsPasswordModalOpen(true)}
            color="black"
            fullWidth
            type="button"
          >
            {t("change.password")}
          </Button>
        </div>
      )}
      <Modal withCloseButton isOpen={isPasswordModalOpen} onClose={handleClosePasswordModal}>
        <PasswordForm onSuccess={handleClosePasswordModal} />
      </Modal>
    </div>
  );
};

export default Profile;
