import { useMutation, useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { Input } from "@/components/input";
import { RadioGroup } from "@headlessui/react";
import CheckIcon from "@/assets/icons/check";
import EmptyCheckIcon from "@/assets/icons/empty-check";
import { Button } from "@/components/button";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDebounce } from "@/hook/use-debounce";
import NetworkError from "@/utils/network-error";
import { error, success } from "@/components/alert";
import clsx from "clsx";
import { useSettings } from "@/hook/use-settings";

const compareUsers = (a?: string, b?: string) => a === b;

const schema = yup.object({
  amount: yup.number().required().typeError("required"),
  user: yup.string().required(),
});

type FormData = yup.InferType<typeof schema>;

export const SendMoney = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { currency } = useSettings();
  const debouncedSearch = useDebounce(search);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
    resetField,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { data: users, isFetching } = useQuery(
    ["userList", debouncedSearch],
    () => userService.userList({ search: debouncedSearch }),
    {
      enabled: debouncedSearch.length > 0,
      onSuccess: (res) => {
        if (res.data.every((user) => user.uuid !== watch("user"))) {
          resetField("user");
        }
      },
    }
  );

  const { mutate: sendMoney, isLoading: moneySending } = useMutation({
    mutationFn: (body: { price: number; uuid: string; currency_id?: number }) =>
      userService.sendMoney(body),
    onError: (err: NetworkError) => error(err.message),
    onSuccess: () => {
      success(t("successfully.transferred"));
      onSuccess();
    },
  });

  const handleSendMoney = (data: FormData) => {
    sendMoney({ price: data.amount, uuid: data.user, currency_id: currency?.id });
  };

  useEffect(() => {
    if (search.length === 0) {
      resetField("user");
    }
  }, [search]);

  return (
    <div className="p-5">
      <div className="text-xl font-medium mb-4">{t("send.money")}</div>
      <form onSubmit={handleSubmit(handleSendMoney)}>
        <div className="flex flex-col gap-4">
          <Input
            {...register("amount")}
            error={errors.amount?.message}
            type="number"
            label={t("amount")}
            fullWidth
          />
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
            onChange={(user) => setValue("user", user, { shouldValidate: true })}
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
                  value={user.uuid}
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
        <Button
          className={clsx(((users?.data && users.data.length === 0) || !users) && "mt-4")}
          fullWidth
          loading={moneySending}
          type="submit"
        >
          {t("send")}
        </Button>
      </form>
    </div>
  );
};
