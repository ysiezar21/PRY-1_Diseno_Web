import * as React from "react";
import type { Product } from "../api/dummyjson";
import type { CartItem } from "./cartTypes";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;

  // acciones
  add: (p: Product) => void;
  inc: (productId: number) => void;
  dec: (productId: number) => void;
  remove: (productId: number) => void;
  clear: () => void;

  // UI (drawer)
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

const CART_KEY = "supermercado_cart_v1";

const safeParse = (raw: string | null): CartItem[] => {
  if (!raw) return [];
  try {
    const val = JSON.parse(raw);
    if (!Array.isArray(val)) return [];
    // Validación mínima para evitar crasheos si el storage se rompe
    return val
      .map((x: any) => {
        const p = x?.product;
        const qty = Number(x?.qty);
        if (!p || !Number.isFinite(qty) || qty <= 0) return null;
        if (!Number.isFinite(Number(p?.id))) return null;
        return { product: p as Product, qty: Math.floor(qty) } as CartItem;
      })
      .filter(Boolean) as CartItem[];
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>(() =>
    safeParse(localStorage.getItem(CART_KEY))
  );

  const [isOpen, setIsOpen] = React.useState(false);

  // Persistencia
  React.useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // noop
    }
  }, [items]);

  const count = React.useMemo(() => items.reduce((acc, x) => acc + x.qty, 0), [items]);
  const subtotal = React.useMemo(
    () => items.reduce((acc, x) => acc + x.qty * (x.product.price ?? 0), 0),
    [items]
  );

  const add = (p: Product) => {
    setItems((prev) => {
      const found = prev.find((x) => x.product.id === p.id);
      return found
        ? prev.map((x) => (x.product.id === p.id ? { ...x, qty: x.qty + 1 } : x))
        : [...prev, { product: p, qty: 1 }];
    });
  };

  const inc = (productId: number) => {
    setItems((prev) =>
      prev.map((x) => (x.product.id === productId ? { ...x, qty: x.qty + 1 } : x))
    );
  };

  const dec = (productId: number) => {
    setItems((prev) => {
      const found = prev.find((x) => x.product.id === productId);
      if (!found) return prev;
      if (found.qty <= 1) return prev.filter((x) => x.product.id !== productId);
      return prev.map((x) =>
        x.product.id === productId ? { ...x, qty: Math.max(1, x.qty - 1) } : x
      );
    });
  };

  const remove = (productId: number) => {
    setItems((prev) => prev.filter((x) => x.product.id !== productId));
  };

  const clear = () => setItems([]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    add,
    inc,
    dec,
    remove,
    clear,
    isOpen,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
