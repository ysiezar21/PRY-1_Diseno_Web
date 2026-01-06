import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { getCategoryList } from "../api/dummyjson";
import TopNav from "../components/nav/TopNav";
import CategoryDrawer from "../components/nav/CategoryDrawer";
import CartDrawer from "../components/cart/CartDrawer";
import { useCart } from "../cart/CartProvider";

type Props = {
  user: unknown;
  lang: "es" | "en";
  setLang: (l: "es" | "en") => void;
  onLogout: () => void;

  toggleTheme: () => void;
  mode: "light" | "dark";
};

export default function MainLayout({ user, lang, setLang, onLogout, toggleTheme, mode }: Props) {
  const isLogged = Boolean(user);
  const nav = useNavigate();

  const {
    items: cartItems,
    count: cartCount,
    subtotal,
    inc,
    dec,
    remove,
    clear,
    isOpen: cartOpen,
    openCart,
    closeCart,
  } = useCart();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<string[]>([]);

  React.useEffect(() => {
    getCategoryList().then(setCategories).catch((e) => console.error(e));
  }, []);

  const goSearch = (q: string) => {
    const query = q.trim();
    if (!query) {
      nav("/products");
      return;
    }
    nav(`/search?q=${encodeURIComponent(query)}`);
  };

  const pickCategory = (cat: string | null) => {
    if (!cat) {
      nav("/");
      return;
    }
    nav(`/category/${encodeURIComponent(cat)}`);
  };

  return (
    <>
      <TopNav
        isLogged={isLogged}
        cartCount={cartCount}
        lang={lang}
        onLangChange={setLang}
        onOpenDrawer={() => setDrawerOpen(true)}
        onOpenCart={openCart}
        onSearchSubmit={goSearch}
        onLoginClick={() => nav("/login")}
        onLogout={onLogout}
        onToggleTheme={toggleTheme}
        currentMode={mode}
      />

      <CategoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={categories}
        onPickCategory={pickCategory}
      />

      <CartDrawer
        open={cartOpen}
        onClose={closeCart}
        lang={lang}
        items={cartItems}
        subtotal={subtotal}
        onInc={inc}
        onDec={dec}
        onRemove={remove}
        onClear={clear}
      />

      <Outlet />
    </>
  );
}
