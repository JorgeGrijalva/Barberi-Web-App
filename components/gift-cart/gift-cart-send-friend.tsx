"use client";

import { useTranslation } from "react-i18next";
import { Input } from "@/components/input";
import React, { useState } from "react";
import { Button } from "@/components/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { useDebounce } from "@/hook/use-debounce";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import CheckIcon from "@/assets/icons/check";
import EmptyCheckIcon from "@/assets/icons/empty-check";
import NetworkError from "@/utils/network-error";
import { error, success } from "@/components/alert";

const compareUsers = (a?: number, b?: number) => a === b;

interface GiftCartSendToFriendProps {
  giftCartId?: number;
  onSuccess: () => void;
}

const schema = yup.object({
  user: yup.number().required(),
});

type FormData = yup.InferType<typeof schema>;

export const GiftCartSendToFriend = ({ giftCartId, onSuccess }: GiftCartSendToFriendProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const {
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
    resetField,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { data: users, isFetching } = useQuery(
    ["userList", debouncedSearch, "user"],
    () => userService.userList({ search: debouncedSearch, role: "user" }),
    {
      enabled: debouncedSearch.length > 0,
      onSuccess: (res) => {
        if (res.data.every((user) => user.id !== watch("user"))) {
          resetField("user");
        }
      },
    }
  );

  const { mutate: sendGiftCart, isLoading: giftCartSending } = useMutation({
    mutationFn: (body: { user_gift_cart_id?: number; user_id: number }) =>
      userService.sendGiftCart(body),
    onError: (err: NetworkError) => error(err.message),
    onSuccess: () => {
      success(t("send.gift.success"));
      onSuccess();
    },
  });

  const handleSendGiftCart = (data: FormData) => {
    sendGiftCart({ user_gift_cart_id: giftCartId, user_id: data.user });
  };

  return (
    <div className="p-5">
      <div className="text-xl font-medium mb-4">{t("send.gift.cart")}</div>
      <form onSubmit={handleSubmit(handleSendGiftCart)}>
        <div className="mb-5">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            label={t("user")}
            fullWidth
          />
        </div>
        <div>
          <RadioGroup
            by={compareUsers}
            value={watch("user")}
            className={clsx(users?.data && users?.data.length > 0 && "my-4")}
            onChange={(user) => setValue("user", Number(user), { shouldValidate: true })}
          >
            {isFetching ? (
              <div className="flex flex-col gap-4">
                {Array.from(Array(10).keys()).map((user) => (
                  <div className="h-4 rounded-full w-full bg-gray-300" key={user} />
                ))}
              </div>
            ) : (
              users?.data?.map((user) => (
                <RadioGroup.Option
                  key={user.id}
                  value={user.id}
                  className="cursor-pointer border-b border-gray-layout dark:border-gray-inputBorder last:border-none pt-4 pb-4 last:pb-0 first:pt-0"
                >
                  {({ checked }) => (
                    <div className="flex items-center gap-4 ">
                      {checked ? (
                        <span className="text-primary dark:text-white">
                          <CheckIcon />
                        </span>
                      ) : (
                        <EmptyCheckIcon />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.firstname}</span>
                      </div>
                    </div>
                  )}
                </RadioGroup.Option>
              ))
            )}
          </RadioGroup>
          {errors.user && <p className="text-sm mt-1 mb-2 text-red">{errors.user.message}</p>}
        </div>
        <Button fullWidth type="submit" loading={giftCartSending}>
          {t("send")}
        </Button>
      </form>
    </div>
  );
};
