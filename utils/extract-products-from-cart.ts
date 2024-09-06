import { Cart, UserCart } from "@/types/cart";

export const extractProductsFromCart = (cart: Cart, id?: string | number | null) => {
  let tempUserCart: UserCart | undefined = cart.user_carts?.[0];
  if (typeof id === "string") {
    tempUserCart = cart.user_carts.find((userCart) => userCart.uuid === id);
  }

  if (typeof id === "number") {
    tempUserCart = cart.user_carts.find((userCart) => userCart.user_id === id);
  }
  if (!tempUserCart) return [];
  return tempUserCart.cartDetails.flatMap((detail) =>
    detail.cartDetailProducts.map((product) => ({
      cartDetailId: product.id,
      stockId: product.stock.id,
      quantity: product.quantity,
    }))
  );
};
