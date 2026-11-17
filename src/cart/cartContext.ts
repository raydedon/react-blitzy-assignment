import { createContext, useContext } from "react";

export interface Product {
  productId: number;
  productName: string;
  price: number;
}

export interface CartState {
  selectedProducts: Array<number>;
  listOfProducts: Array<Product>;
}

export type CartAction =
  | { type: "add"; productId: number }
  | { type: "remove"; productId: number };

export interface CartContextValue {
  state: CartState;
  addProduct: (productId: number) => void;
  removeProduct: (productId: number) => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add":
      if (state.selectedProducts.includes(action.productId)) return state;
      return {
        ...state,
        selectedProducts: [...state.selectedProducts, action.productId],
      };
    case "remove":
      return {
        ...state,
        selectedProducts: state.selectedProducts.filter(
          (id) => id !== action.productId,
        ),
      };
  }
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
