import { useReducer, type ReactNode } from "react";
import products from "../data/products.json";
import { generateProducts, getRecordCount } from "../data/generateProducts";
import { CartContext, cartReducer, type CartState } from "./cartContext";

const initialState: CartState = {
  selectedProducts: [],
  listOfProducts: generateProducts(products, getRecordCount()),
};

function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = {
    state,
    addProduct: (productId: number) => dispatch({ type: "add", productId }),
    removeProduct: (productId: number) =>
      dispatch({ type: "remove", productId }),
  };

  return <CartContext value={value}>{children}</CartContext>;
}

export default CartProvider;
