import { Input } from "@/components/input";
import { useTranslation } from "react-i18next";
import React, { useRef, useState } from "react";
import useAddressStore from "@/global-store/address";
import { City } from "@/types/global";
import { AsyncSelect } from "@/components/async-select";
import { Button } from "@/components/button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Address } from "@/types/address";
import { PhoneInput } from "@/components/phone-input";
import { Map } from "@/components/map";
import { defaultLocation } from "@/config/global";
import { Autocomplete, MarkerF } from "@react-google-maps/api";
import Pin from "@/assets/img/pin.png";
import { useSearchAddress } from "@/hook/use-search-address";
import { CheckoutScreenProps } from "@/context/checkout/types";
import { useSettings } from "@/hook/use-settings";

const schema = yup
  .object({
    firstname: yup.string().required().max(255),
    lastname: yup.string().required().max(255),
    phone: yup.string().required().max(255),
    zipcode: yup.string().required().max(255),
    street_house_number: yup.string().required().max(255),
    additional_details: yup.string().max(255),
    city: yup
      .object({
        id: yup.number(),
      })
      .nullable(),
    location: yup.object({
      address: yup.string().required(),
      latitude: yup.string(),
      longitude: yup.string(),
    }),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

interface AddressFormProps extends Partial<CheckoutScreenProps> {
  onSuccess?: () => void;
  onCancel?: () => void;
  data?: Address;
  onSubmit: (values: FormData) => void;
  isButtonLoading?: boolean;
}

const AddressForm = ({ onCancel, data, onSubmit, isButtonLoading }: AddressFormProps) => {
  const { t } = useTranslation();
  const city = useAddressStore((state) => state.city);
  const country = useAddressStore((state) => state.country);
  const { settings } = useSettings();
  const autoComplete = useRef<google.maps.places.Autocomplete>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isAddressError, setIsAddressError] = useState(false);
  const { mutate: searchAddress } = useSearchAddress();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      city: data?.city || city,
      firstname: data?.firstname,
      lastname: data?.lastname,
      zipcode: data?.zipcode,
      additional_details: data?.additional_details,
      phone: data?.phone,
      street_house_number: data?.street_house_number,
      location: {
        latitude:
          data?.location?.latitude ||
          settings?.location?.split(",")?.[0] ||
          defaultLocation.lat.toString(),
        longitude:
          data?.location?.longitude ||
          settings?.location?.split(",")?.[1] ||
          defaultLocation.lng.toString(),
        address: data?.location?.address || settings?.address,
      },
    },
  });

  const handlePlaceChange = () => {
    if (autoComplete.current !== null) {
      const place = autoComplete.current?.getPlace();
      setValue("location.latitude", place?.geometry?.location?.lat().toString(10));
      setValue("location.longitude", place?.geometry?.location?.lng().toString(10));
      setValue("location.address", place?.formatted_address || "");
    }
  };

  const currentLocation = watch("location");
  const currentMapCenter = {
    lat: Number(currentLocation.latitude),
    lng: Number(currentLocation.longitude),
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    setValue("location.latitude", e.latLng?.lat().toString());
    setValue("location.longitude", e.latLng?.lng().toString());
    searchAddress(
      { lat: e.latLng?.lat(), lng: e.latLng?.lng() },
      {
        onSuccess: (res) => {
          const result = res?.results?.[0]?.formatted_address;
          setIsAddressError(false);
          if (
            country &&
            !res.plus_code?.compound_code
              ?.toLowerCase()
              .includes(country.translation?.title.toLowerCase())
          ) {
            setIsAddressError(true);
          } else {
            setIsAddressError(false);
          }

          if (city) {
            if (
              !res.plus_code.compound_code
                ?.toLowerCase()
                .includes(city.translation?.title.toLowerCase())
            ) {
              setIsAddressError(true);
            } else {
              setIsAddressError(false);
            }
          }

          setValue("location.address", result);
        },
      }
    );
  };
  console.log(isAddressError);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-7">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4">
          <Map
            containerStyles={{ width: "100%", height: "300px", borderRadius: "15px" }}
            onClick={handleMapClick}
            options={{
              center: currentMapCenter,
              streetViewControl: false,
              mapTypeControl: false,
              zoomControl: false,
            }}
            onLoad={(loadedMap) => setMap(loadedMap)}
          >
            <MarkerF icon={Pin.src} position={currentMapCenter} />
          </Map>
          {map && (
            <Autocomplete
              className="flex-grow h-full shadow-none mt-4"
              onLoad={(autocomplete) => {
                // @ts-expect-error this is important because of ref
                autoComplete.current = autocomplete;
              }}
              onPlaceChanged={handlePlaceChange}
            >
              <Input
                fullWidth
                label={t("address")}
                {...register("location.address")}
                error={errors.location?.address?.message}
                required
              />
            </Autocomplete>
          )}
        </div>
        <div className="col-span-2">
          <Input
            fullWidth
            label={t("first.name")}
            {...register("firstname")}
            error={errors.firstname?.message}
            required
          />
        </div>
        <div className="col-span-2">
          <Input
            fullWidth
            label={t("last.name")}
            {...register("lastname")}
            error={errors.lastname?.message}
            required
          />
        </div>
        <div className="col-span-4">
          <PhoneInput
            onChange={(value) => setValue("phone", value)}
            value={watch("phone")}
            country={country?.code}
            error={errors.phone?.message}
          />
        </div>
        <div className="col-span-2">
          <Input
            fullWidth
            label={t("zip.code")}
            {...register("zipcode")}
            type="number"
            error={errors.zipcode?.message}
            required
          />
        </div>
        <div className="col-span-2">
          <AsyncSelect
            onSelect={(value) => setValue("city", value)}
            value={watch("city") as City}
            queryKey="v1/rest/cities"
            queryParams={{ country_id: country?.id }}
            extractTitle={(value) => value?.translation?.title as string}
            extractKey={(value) => value.id}
            disabled
          />
        </div>
        <div className="col-span-4">
          <Input
            fullWidth
            label={t("home.number")}
            {...register("street_house_number")}
            error={errors.street_house_number?.message}
            required
          />
        </div>
        <div className="col-span-4">
          <Input
            fullWidth
            label={t("detail")}
            {...register("additional_details")}
            error={errors.additional_details?.message}
          />
        </div>
        <div className="col-span-4 flex items-center gap-4">
          {!!onCancel && (
            <Button fullWidth onClick={onCancel} type="button" disabled={isButtonLoading}>
              {t("cancel")}
            </Button>
          )}
          <Button type="submit" loading={isButtonLoading} fullWidth color="black">
            {t("next")}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddressForm;
