import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addressService } from "@/services/address";
import { AddressCreateBody } from "@/types/address";
import useAddressStore from "@/global-store/address";
import { LoadingCard } from "@/components/loading";
import { DeliveryPrice } from "@/types/global";
import NetworkError from "@/utils/network-error";
import { error } from "@/components/alert";
import { Types } from "@/context/checkout/checkout.reducer";
import { useCheckout } from "@/context/checkout/checkout.context";
import AddressForm from "./address-form";

interface AddressEditFormProps {
  id?: number;
  onCancel: () => void;
  onSuccess: () => void;
  deliveryPrice?: DeliveryPrice;
}

const AddressEdit = ({ id, onCancel, onSuccess, deliveryPrice }: AddressEditFormProps) => {
  const country = useAddressStore((state) => state.country);
  const queryClient = useQueryClient();
  const { data: address, isFetching } = useQuery(["address", id], () => addressService.get(id));
  const { mutate: updateAddress, isLoading: isUpdating } = useMutation({
    mutationFn: (body: AddressCreateBody) => addressService.update(address?.data?.id, body),
    onError: (err: NetworkError) => error(err.message),
  });
  const { dispatch, state } = useCheckout();
  if (isFetching) {
    return <LoadingCard />;
  }
  return (
    <AddressForm
      data={address?.data}
      isButtonLoading={isUpdating}
      onCancel={onCancel}
      onSubmit={(values) => {
        const body = {
          ...values,
          region_id: country?.region_id,
          country_id: country?.id,
          city_id: values.city?.id,
        };
        updateAddress(body, {
          onSuccess: (res) => {
            if (res.data.id === state.deliveryAddress?.id) {
              dispatch({
                type: Types.UpdateDeliveryAddress,
                payload: { address: res.data, deliveryPrice },
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
export default AddressEdit;
