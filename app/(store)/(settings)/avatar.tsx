"use client";

import { UpdateProfileBody, UserDetail } from "@/types/user";
import Image from "next/image";
import { IconButton } from "@/components/icon-button";
import PenIcon from "@/assets/icons/pen";
import React, { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { ImageUpload } from "@/components/image-upload";
import { ImageTypes } from "@/types/global";
import { LoadingCard } from "@/components/loading";
import { ProfilePlaceholder } from "@/app/(store)/(booking)/components/profile-placeholder";

export const Avatar = ({ data }: { data?: UserDetail }) => {
  const { mutate: updateProfile, isLoading: isUpdating } = useMutation({
    mutationFn: (body: UpdateProfileBody) => userService.update(body),
  });
  const handleUpdateImage = useCallback((image: string) => {
    if (data) {
      const body: UpdateProfileBody = {
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        email: data.email,
        phone: data.phone,
        images: image ? [image] : undefined,
      };

      updateProfile(body);
    }
  }, []);
  return (
    <ImageUpload onChange={handleUpdateImage} type={ImageTypes.USER}>
      {({ handleClick, isLoading, preview }) => (
        <div className="relative">
          {isLoading && <LoadingCard centered />}
          {!preview && !data?.img ? (
            <ProfilePlaceholder size={100} name={data?.firstname} />
          ) : (
            <Image
              src={preview || data?.img || ""}
              alt="profile"
              width={100}
              height={100}
              className="object-cover rounded-full aspect-square"
            />
          )}
          <div className="absolute -bottom-1 -right-2 z-[4] flex items-center justify-center p-0.5">
            <IconButton
              disabled={isLoading || isUpdating}
              onClick={handleClick}
              size="medium"
              rounded
              color="gray"
              type="button"
            >
              <PenIcon />
            </IconButton>
          </div>
        </div>
      )}
    </ImageUpload>
  );
};
