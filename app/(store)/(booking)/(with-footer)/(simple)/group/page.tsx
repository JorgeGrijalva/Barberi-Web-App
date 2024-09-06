"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Modal } from "@/components/modal";
import { Input } from "@/components/input";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { JoinCartCredentials } from "@/types/cart";
import { cartService } from "@/services/cart";
import { error, success } from "@/components/alert";
import { useTransition } from "react";
import useUserStore from "@/global-store/user";
import { LoadingCard } from "@/components/loading";
import useCartStore from "@/global-store/cart";
import useAddressStore from "@/global-store/address";
import fetcher from "@/lib/fetcher";
import { buildUrlQueryParams } from "@/utils/build-url-query-params";
import { City, Country, DefaultResponse } from "@/types/global";
import { useSettings } from "@/hook/use-settings";

const schema = yup.object({
  name: yup.string().required(),
});
type FormData = yup.InferType<typeof schema>;

const GroupOrderJoinPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const user = useUserStore((state) => state.user);
  const updateMemberData = useCartStore((state) => state.updateMemberData);
  const country = useAddressStore((state) => state.country);
  const { language } = useSettings();
  const updateCountry = useAddressStore((state) => state.updateCountry);
  const updateCity = useAddressStore((state) => state.updateCity);
  const city = useAddressStore((state) => state.city);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { data: countryDetail } = useQuery(
    ["country", searchParams.get("country_id")],
    () =>
      fetcher<DefaultResponse<Country>>(
        buildUrlQueryParams(`v1/rest/countries/${searchParams.get("country_id")}`, {
          lang: language?.locale,
        })
      ),
    {
      enabled: searchParams.has("country_id"),
    }
  );

  const { data: cityDetail } = useQuery(
    ["city", searchParams.get("city_id")],
    () =>
      fetcher<DefaultResponse<City>>(
        buildUrlQueryParams(`v1/rest/cities/${searchParams.get("city_id")}`, {
          lang: language?.locale,
        })
      ),
    {
      enabled: searchParams.has("city_id"),
    }
  );

  const handleCloseModal = () => {
    startTransition(() => router.replace("/"));
  };

  const { mutate: join, isLoading: isJoining } = useMutation({
    mutationFn: (body: JoinCartCredentials) => cartService.join(body),
    onSuccess: (res) => {
      updateMemberData(res.data.cart_id, res.data.uuid);
      handleCloseModal();
      success(t("successfully.joined.group.order"));
    },
    onError: () => {
      error(t("you.cannot.join"));
    },
  });

  const handleJoin = (data: FormData) => {
    if (user?.id.toString() === searchParams.get("user_id")) {
      error(t("you.cannot.join.your.group.order"));
      return;
    }
    const body: JoinCartCredentials = {
      name: data.name,
      region_id: Number(searchParams.get("region_id")),
      country_id: Number(searchParams.get("country_id")),
      cart_id: Number(searchParams.get("cart_id")),
    };
    if (searchParams.has("city_id")) {
      body.city_id = Number(searchParams.get("city_id"));
    }
    join(body);
  };

  const handleChangeAddress = () => {
    if (countryDetail?.data) {
      updateCountry(countryDetail.data);
    }
    if (cityDetail?.data) {
      updateCity(cityDetail.data);
    }
  };

  return (
    <Modal disableCloseOnOverlayClick withCloseButton isOpen onClose={handleCloseModal}>
      <div className="md:px-5 px-2 py-5 relative">
        {pending && (
          <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-dark bg-opacity-30 dark:bg-opacity-30">
            <LoadingCard centered />
          </div>
        )}
        <span className="text-2xl font-semibold mb-4">{t("join.group.order")}</span>
        {country?.id.toString() === searchParams.get("country_id") &&
        (searchParams.has("city_id")
          ? searchParams.get("city_id") === city?.id.toString()
          : true) ? (
          <>
            <p className="text-sm text-gray-field my-2">{t("join.group.text")}</p>
            <form className="mt-4" onSubmit={handleSubmit(handleJoin)}>
              <Input
                label={t("name")}
                fullWidth
                {...register("name")}
                error={errors.name?.message}
              />
              <Button loading={isJoining} className="mt-6" fullWidth>
                {t("join")}
              </Button>
            </form>
          </>
        ) : (
          <>
            {countryDetail?.data ? (
              <p className="text-sm text-gray-field my-2">
                {t("your.country.is.not.same.with.owners")} {countryDetail?.data.translation?.title}{" "}
                {!!cityDetail?.data && cityDetail?.data.translation?.title}
              </p>
            ) : (
              <p className="text-sm text-gray-field my-2">{t("group.owners.country.not.found")}</p>
            )}
            {countryDetail?.data && (
              <Button onClick={handleChangeAddress} className="mt-6" fullWidth>
                {t("change")}
              </Button>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default GroupOrderJoinPage;
