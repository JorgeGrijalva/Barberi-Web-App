import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { addressService } from "@/services/address";
import dynamic from "next/dynamic";
import { RadioGroup } from "@headlessui/react";
import CheckIcon from "@/assets/icons/check";
import EmptyCheckIcon from "@/assets/icons/empty-check";
import { Button } from "@/components/button";
import { Address } from "@/types/address";
import { IconButton } from "@/components/icon-button";
import PencilLineIcon from "remixicon-react/PencilLineIcon";
import { Modal } from "@/components/modal";
import { LoadingCard } from "@/components/loading";
import useAddressStore from "@/global-store/address";
import TrashIcon from "@/assets/icons/trash";
import { extractDataFromPagination } from "@/utils/extract-data";
import { InfiniteLoader } from "@/components/infinite-loader";
import { Paginate } from "@/types/global";
import { ConfirmModal } from "@/components/confirm-modal";
import { useSettings } from "@/hook/use-settings";
import clsx from "clsx";
import { Types } from "@/context/checkout/checkout.reducer";
import { useCheckout } from "@/context/checkout/checkout.context";

const AddressCreate = dynamic(() => import("./address-create"), {
  loading: () => <LoadingCard />,
});
const AddressEdit = dynamic(() => import("./address-edit"), {
  loading: () => <LoadingCard />,
});

const compareAddresses = (a?: Address, b?: Address) => a?.id === b?.id;

export const CheckoutDeliveryForm = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { language } = useSettings();
  const country = useAddressStore((state) => state.country);
  const city = useAddressStore((state) => state.city);
  const [addressId, setAddressId] = useState<number | null>(null);
  const { data: deliveryPrices } = useQuery(
    ["deliveryPrices", country?.id, city?.id],
    () =>
      addressService.getDeliveryPrices({
        country_id: country?.id,
        city_id: city?.id,
      }),
    {
      enabled: !!country,
    }
  );
  const notAvailable = deliveryPrices && deliveryPrices?.data?.length === 0;
  const {
    data: addresses,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    ["addresses", country?.id, city?.id],
    ({ pageParam }) =>
      addressService.getAll({
        country_id: country?.id,
        city_id: city?.id,
        lang: language?.locale,
        page: pageParam,
      }),
    {
      enabled: !notAvailable,
      getNextPageParam: (lastPage) => lastPage.links.next && lastPage.meta.current_page + 1,
    }
  );
  const addressList = extractDataFromPagination(addresses?.pages);
  const { mutate: deleteAddress } = useMutation({
    mutationFn: (id: number) => addressService.delete(id),
    onMutate: async (id) => {
      setAddressId(null);
      await queryClient.cancelQueries(["addresses", country?.id, city?.id]);
      const prevAddresses = queryClient.getQueryData<InfiniteData<Paginate<Address>>>([
        "addresses",
        country?.id,
        city?.id,
      ]);

      queryClient.setQueryData<InfiniteData<Paginate<Address>>>(
        ["addresses", country?.id, city?.id],
        (old) => {
          if (!old) return prevAddresses;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((address) => address.id !== id),
            })),
          };
        }
      );

      return { prevAddresses };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["addresses", country?.id, city?.id], context?.prevAddresses);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["addresses", country?.id, city?.id]);
    },
  });

  const { state, dispatch } = useCheckout();
  const [showForm, setShowForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>();

  if (isLoading) {
    return (
      <div className="my-7">
        <div className="flex flex-col gap-3">
          <div className="bg-gray-300 w-full rounded-full h-4" />
          <div className="bg-gray-300 w-3/5 rounded-full h-3" />
        </div>
        <div className="flex flex-col gap-3 mt-7">
          <div className="bg-gray-300 w-full rounded-full h-4" />
          <div className="bg-gray-300 w-3/5 rounded-full h-3" />
        </div>
      </div>
    );
  }

  if (addressList?.length === 0 && !notAvailable) {
    return <AddressCreate deliveryPrice={deliveryPrices?.data?.[0]} onSuccess={() => refetch()} />;
  }

  if (notAvailable) {
    return <div className="mt-7">{t("we.are.not.available.here")}</div>;
  }

  const handleSelectAddress = (address: Address) => {
    dispatch({
      type: Types.UpdateDeliveryAddress,
      payload: {
        address,
        deliveryPrice: deliveryPrices?.data?.[0],
      },
    });
  };

  return (
    <div className="mt-7">
      <div className="flex justify-between items-center mb-7">
        <h6 className="text-lg font-medium">{t("delivery.addresses")}</h6>
        <Button onClick={() => setShowForm(true)} size="small">
          {t("create.new.address")}
        </Button>
      </div>
      {addressList && addressList.length === 0 ? (
        <div className="my-7">{t("no.saved.addresses.found")}</div>
      ) : (
        <InfiniteLoader hasMore={hasNextPage} loadMore={fetchNextPage} loading={isFetchingNextPage}>
          <RadioGroup
            by={compareAddresses}
            value={state.deliveryAddress}
            onChange={handleSelectAddress}
            className="mb-7"
          >
            {addressList?.map((address, i) => (
              <RadioGroup.Option key={address.id} value={address} className="cursor-pointer">
                {({ checked }) => (
                  <div
                    className={clsx(
                      "flex items-center justify-between  py-3",
                      i !== (addressList ? addressList.length - 1 : 0) &&
                        "border-b  border-gray-layout"
                    )}
                  >
                    <div className="flex items-center gap-2 ">
                      {checked ? (
                        <span className="text-primary dark:text-white">
                          <CheckIcon />
                        </span>
                      ) : (
                        <EmptyCheckIcon />
                      )}
                      <div className="flex flex-col">
                        <span className="text-base font-medium">
                          {address.firstname} {address.lastname}
                        </span>
                        <span className="text-sm text-gray-field line-clamp-1">
                          {address.location?.address}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddressId(address.id);
                        }}
                      >
                        <TrashIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAddress(address);
                        }}
                      >
                        <PencilLineIcon />
                      </IconButton>
                    </div>
                  </div>
                )}
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </InfiniteLoader>
      )}

      <Modal
        isOpen={showForm || !!selectedAddress}
        withCloseButton
        transparent
        onClose={() => {
          setSelectedAddress(undefined);
          setShowForm(false);
        }}
      >
        <div className="p-5">
          <h5 className="text-[22px] font-semibold">
            {selectedAddress ? t("edit.address") : t("create.new.address")}
          </h5>
          {selectedAddress ? (
            <AddressEdit
              onSuccess={() => setSelectedAddress(undefined)}
              id={selectedAddress?.id}
              deliveryPrice={deliveryPrices?.data?.[0]}
              onCancel={() => setSelectedAddress(undefined)}
            />
          ) : (
            <AddressCreate
              onSuccess={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          )}
        </div>
      </Modal>
      <ConfirmModal
        text="are.you.sure.want.to.delete"
        onCancel={() => setAddressId(null)}
        onConfirm={() => !!addressId && deleteAddress(addressId)}
        isOpen={!!addressId}
      />
    </div>
  );
};
