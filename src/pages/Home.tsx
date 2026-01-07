import * as React from "react";
import { Container, Snackbar, Alert, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import type { Product } from "../api/dummyjson";
import { getProducts, getProductsByCategory } from "../api/dummyjson";

import HeroCarousel from "../components/carousels/HeroCarousel";
import ProductRowCarousel from "../components/carousels/ProductRowCarousel";
import { useCart } from "../cart/CartProvider";
import { languages } from "../languages/languages";

type Props = {
  lang: "es" | "en";
};

type RowConfig = { title: string; category: string; limit: number };

const pretty = (s: string) =>
  s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export default function Home({ lang }: Props) {
  const t = languages[lang].home;

  const nav = useNavigate();
  const { add } = useCart();

  const [heroItems, setHeroItems] = React.useState<Product[]>([]);
  const [rowsData, setRowsData] = React.useState<Record<string, Product[]>>({});
  const [toast, setToast] = React.useState({ open: false, msg: "" });

  // Configuración de filas
  const rowsConfig: RowConfig[] = React.useMemo(
    () => [
      { title: "Smartphones", category: "smartphones", limit: 12 },
      { title: "Groceries", category: "groceries", limit: 12 },
      { title: "Home Decoration", category: "home-decoration", limit: 12 },
    ],
    []
  );

  // Cargar hero inicial
  React.useEffect(() => {
    getProducts(8, 0)
      .then((res) => setHeroItems(res.products))
      .catch((e) => console.error(e));
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
    add(p);
    setToast({ open: true, msg: `${t.added}: ${p.title}` });
  };

  return (
    <>
      <Container sx={{ pb: 6 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button variant="outlined" onClick={() => nav("/products")}>
            {t.browseCatalog}
          </Button>
        </Box>

        <HeroCarousel title={t.heroTitle} items={heroItems} />

        {rowsConfig.map((row) => (
          <ProductRowCarousel
            lang={lang}
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
