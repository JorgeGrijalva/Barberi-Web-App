import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressCreateBody } from "@/types/address";
import { addressService } from "@/services/address";
import useAddressStore from "@/global-store/address";
import { DeliveryPrice } from "@/types/global";
import NetworkError from "@/utils/network-error";
import { error } from "@/components/alert";
import { Types } from "@/context/checkout/checkout.reducer";
import { useCheckout } from "@/context/checkout/checkout.context";
import AddressForm from "./address-form";

interface AddressCreateProps {
  onCancel?: () => void;
  onSuccess: () => void;
  deliveryPrice?: DeliveryPrice;
}

const AddressCreate = ({ onCancel, onSuccess, deliveryPrice }: AddressCreateProps) => {
  const country = useAddressStore((state) => state.country);
  const { mutate: createAddress, isLoading: isCreatingAddress } = useMutation({
    mutationFn: (body: AddressCreateBody) => addressService.create(body),
    onError: (err: NetworkError) => error(err.message),
  });
  const queryClient = useQueryClient();
  const { dispatch, state } = useCheckout();

  return (
    <AddressForm
      isButtonLoading={isCreatingAddress}
      onCancel={onCancel}
      onSubmit={(values) => {
        const body = {
          ...values,
          region_id: country?.region_id,
          country_id: country?.id,
          city_id: values.city?.id,
        };
        createAddress(body, {
          onSuccess: (res) => {
            if (!state.deliveryAddress && res.data.addresses) {
              dispatch({
                type: Types.UpdateDeliveryAddress,
                payload: {
                  address: res.data.addresses[0],
                  deliveryPrice,
                },
              });
            }
            onSuccess();
          },
          onSettled: () => {
            queryClient.invalidateQueries(["addresses"]);
          },
        });
      }}
    />
  );
};

export default AddressCreate;
