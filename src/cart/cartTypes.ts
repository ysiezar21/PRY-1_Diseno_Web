import type { Product } from "../api/dummyjson";

// Item dentro del carrito: producto + cantidad
export type CartItem = {
  product: Product;
  qty: number;
};
