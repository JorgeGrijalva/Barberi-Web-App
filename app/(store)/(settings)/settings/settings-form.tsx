"use client";

import { Currency, DefaultResponse, Language } from "@/types/global";
import React, { useCallback, useEffect, useState } from "react";
import GlobeIcon from "@/assets/icons/globe";
import CurrencyIcon from "@/assets/icons/currency";
import { Switch } from "@/components/switch";
import BellIcon from "@/assets/icons/bell";
import useSettingsStore from "@/global-store/settings";
import { setCookie } from "cookies-next";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { NotificationUpdateBody, UserDetail } from "@/types/user";
import { error } from "@/components/alert";
import NetworkError from "@/utils/network-error";
import useUserStore from "@/global-store/user";
import { Select } from "@/components/select";
import { useSettings } from "@/hook/use-settings";

interface SettingsFormProps {
  languages?: Language[];
  currencies?: Currency[];
}

const SettingsForm = ({ languages, currencies }: SettingsFormProps) => {
  const queryClient = useQueryClient();
  const { i18n, t } = useTranslation();
  const defaultCurrency = currencies?.find((currency) => currency.default);
  const defaultLanguage = languages?.find((lang) => lang.default === 1);
  const user = useUserStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const { updateSelectedCurrency, updateSelectedLanguage } = useSettingsStore();
  const { currency: selectedCurrency, language: selectedLanguage } = useSettings();
  const { data: profile } = useQuery(["profile"], () => userService.profile(), { enabled: !!user });
  const { mutate: updateNotificationSettings } = useMutation({
    mutationFn: (body: NotificationUpdateBody) => userService.updateNotificationSettings(body),
    onMutate: async (body) => {
      await queryClient.cancelQueries(["profile"]);
      const prevProfile = queryClient.getQueryData<DefaultResponse<UserDetail>>(["profile"]);

      queryClient.setQueryData<DefaultResponse<UserDetail> | undefined>(["profile"], (old) => {
        if (!old) return prevProfile;
        return {
          ...old,
          data: {
            ...old.data,
            notifications: old.data.notifications.map((notification) => {
              const updatedNotification = body.notifications[0];
              if (
                notification.notification.notification_id === updatedNotification.notification_id
              ) {
                return {
                  ...notification,
                  notification: {
                    ...notification.notification,
                    active: updatedNotification.active,
                  },
                };
              }
              return notification;
            }),
          },
        };
      });

      return { prevProfile };
    },
    onError: (err: NetworkError, variables, context) => {
      queryClient.setQueryData(["profile"], context?.prevProfile);
      error(err.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
  });

  const { mutate: updateLanguage } = useMutation({
    mutationFn: (lang: string) => userService.updateLanguage(lang),
  });
  const { mutate: updateCurrency } = useMutation({
    mutationFn: (currencyId: number) => userService.updateCurrency(currencyId),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectLanguage = (lang: Language) => {
    updateSelectedLanguage(lang);
    i18n.changeLanguage(lang.locale);
    const html = document.documentElement;
    setCookie("lang", lang.locale);
    setCookie("dir", lang.backward ? "rtl" : "ltr");
    html.setAttribute("lang", lang.locale);
    html.setAttribute("dir", lang.backward ? "rtl" : "ltr");
    if (user) {
      updateLanguage(lang.locale);
    }
  };

  const handleSelectCurrency = (currency: Currency) => {
    updateSelectedCurrency(currency);
    setCookie("currency_id", currency.id);
    if (user) {
      updateCurrency(currency.id);
    }
  };

  const pushNotification = profile?.data.notifications.find(
    (notification) => notification.type === "push"
  );
  const isPushNotificationEnabled = Boolean(pushNotification?.notification?.active);

  const handeUpdateNotificationSettings = useCallback(
    (value: boolean) => {
      if (pushNotification) {
        updateNotificationSettings({
          notifications: [
            {
              notification_id: pushNotification?.notification.notification_id,
              active: Number(value),
            },
          ],
        });
      }
    },
    [pushNotification?.notification.notification_id]
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <Select
        options={languages}
        extractKey={(language) => language.id}
        extractTitle={(language) => language?.title}
        label={t("language")}
        onSelect={handleSelectLanguage}
        icon={<GlobeIcon />}
        value={selectedLanguage || defaultLanguage}
      />
      <Select
        options={currencies}
        extractKey={(currency) => currency.id}
        extractTitle={(currency) => currency?.title}
        label={t("currency")}
        onSelect={handleSelectCurrency}
        icon={<CurrencyIcon />}
        value={selectedCurrency || defaultCurrency}
      />
      {user && (
        <div className="relative w-full max-h-[60px] border border-gray-inputBorder p-5 outline-none focus-ring rounded-2xl flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <BellIcon />
            <span className="text-sm font-medium">{t("get.notification")}</span>
          </div>
          <Switch
            onChange={handeUpdateNotificationSettings}
            value={isPushNotificationEnabled}
            onText="on"
            offText="off"
          />
        </div>
      )}
    </div>
  );
};

export default SettingsForm;
