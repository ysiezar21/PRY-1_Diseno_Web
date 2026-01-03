import * as React from "react";
import { Container, Snackbar, Alert } from "@mui/material";
import type { Product } from "../api/dummyjson";
import {
  getCategoryList,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "../api/dummyjson";

import TopNav from "../components/nav/TopNav";
import CategoryDrawer from "../components/nav/CategoryDrawer";
import HeroCarousel from "../components/carousels/HeroCarousel";
import ProductRowCarousel from "../components/carousels/ProductRowCarousel";

type Props = {
  user: unknown;
  lang: "es" | "en";
  setLang: (l: "es" | "en") => void;
  onLoginClick: () => void;
  onLogout: () => void;
};

type RowConfig = { title: string; category: string; limit: number };

const pretty = (s: string) =>
  s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export default function Home({ user, lang, setLang, onLoginClick, onLogout }: Props) {
  const isLogged = Boolean(user);

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [heroItems, setHeroItems] = React.useState<Product[]>([]);
  const [rowsData, setRowsData] = React.useState<Record<string, Product[]>>({});
  const [toast, setToast] = React.useState({ open: false, msg: "" });

  // carrito mínimo (solo contador)
  const [cart, setCart] = React.useState<Array<{ id: number; qty: number }>>([]);
  const cartCount = cart.reduce((acc, x) => acc + x.qty, 0);

  // Aca se pueden agregar facilmente mas filas
  const rowsConfig: RowConfig[] = React.useMemo(
    () => [
      { title: "Smartphones", category: "smartphones", limit: 12 },
      { title: "Groceries", category: "groceries", limit: 12 },
      { title: "Home Decoration", category: "home-decoration", limit: 12 },
      // se agregan más filas así:
      // { title: "Laptops", category: "laptops", limit: 12 },
    ],
    []
  );

  // Cargar categorías + hero inicial
  React.useEffect(() => {
    const run = async () => {
      const [cats, newest] = await Promise.all([getCategoryList(), getProducts(8, 0)]);
      setCategories(cats);
      setHeroItems(newest.products);
    };

    run().catch((e) => console.error(e));
  }, []);

  // Cargar productos para cada fila
  React.useEffect(() => {
    const run = async () => {
      const uniqueCats = Array.from(new Set(rowsConfig.map((r) => r.category)));

      const pairs = await Promise.all(
        uniqueCats.map(async (cat) => {
          try {
            const res = await getProductsByCategory(cat, 12, 0);
            return [cat, res.products] as const;
          } catch {
            return [cat, [] as Product[]] as const;
          }
        })
      );

      const obj = pairs.reduce<Record<string, Product[]>>(
        (acc, [cat, prods]) => ({ ...acc, [cat]: prods }),
        {}
      );

      setRowsData(obj);
    };

    run().catch((e) => console.error(e));
  }, [rowsConfig]);

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const found = prev.find((x) => x.id === p.id);
      return found
        ? prev.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x))
        : [...prev, { id: p.id, qty: 1 }];
    });
    setToast({ open: true, msg: `${lang === "en" ? "Added" : "Agregado"}: ${p.title}` });
  };

  const handlePickCategory = async (cat: string | null) => {
    if (!cat) {
      const res = await getProducts(8, 0);
      setHeroItems(res.products);
      return;
    }
    const res = await getProductsByCategory(cat, 8, 0);
    setHeroItems(res.products);
  };

  const handleSearchSubmit = async (q: string) => {
    if (!q) {
      const res = await getProducts(8, 0);
      setHeroItems(res.products);
      return;
    }
    const res = await searchProducts(q, 8, 0);
    setHeroItems(res.products);
  };

  return (
    <>
      <TopNav
        isLogged={isLogged}
        cartCount={cartCount}
        lang={lang}
        onLangChange={setLang}
        onOpenDrawer={() => setDrawerOpen(true)}
        onSearchSubmit={handleSearchSubmit}
        onLoginClick={onLoginClick}
        onLogout={onLogout}
      />

      <CategoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={categories}
        onPickCategory={handlePickCategory}
      />

      <Container sx={{ pb: 6 }}>
        <HeroCarousel title={lang === "en" ? "New arrivals" : "Lo más nuevo"} items={heroItems} />

        {rowsConfig.map((row) => (
          <ProductRowCarousel
            key={row.category}
            title={pretty(row.title)}
            products={rowsData[row.category] ?? []}
            onAddToCart={addToCart}
          />
        ))}
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={1400}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      >
        <Alert severity="success" variant="filled">
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
