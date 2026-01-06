import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Button,
  Pagination,
  CircularProgress,
  Drawer,
  IconButton,
  Chip,
  Autocomplete,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

import type { Product } from "../api/dummyjson";
import { getAllProducts, getAllProductsByCategory, searchAllProducts } from "../api/dummyjson";
import ProductGridCard from "../components/products/ProductGridCard";
import { useCart } from "../cart/CartProvider";

type Mode = "all" | "search" | "category";

type Props = {
  mode: Mode;
  lang: "es" | "en";
};

const pretty = (s: string) =>
  s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export default function Browse({ mode, lang }: Props) {
  const nav = useNavigate();
  const { category } = useParams();
  const [sp] = useSearchParams();
  const q = (sp.get("q") ?? "").trim();

  const { add } = useCart();

  const [toast, setToast] = React.useState({ open: false, msg: "" });

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [base, setBase] = React.useState<Product[]>([]);

  // filtros (local)
  const [sort, setSort] = React.useState<"relevance" | "name_asc" | "price_asc" | "price_desc" | "rating_desc" | "discount_desc">(
    "relevance"
  );
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 0]);
  const [minRating, setMinRating] = React.useState(0);
  const [onlyStock, setOnlyStock] = React.useState(false);
  const [brands, setBrands] = React.useState<string[]>([]);
  const [brandOptions, setBrandOptions] = React.useState<string[]>([]);

  const [page, setPage] = React.useState(1);
  const perPage = 12;

  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  // Cargar resultados segun modo
  React.useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      setPage(1);

      try {
        let products: Product[] = [];

        if (mode === "all") {
          products = await getAllProducts();
        } else if (mode === "category") {
          if (!category) throw new Error("Missing category");
          products = await getAllProductsByCategory(category);
        } else {
          // search
          if (!q) {
            // si no hay query, mandamos al catálogo completo
            nav("/products", { replace: true });
            return;
          }
          products = await searchAllProducts(q);
        }

        setBase(products);

        // bounds para slider de precio
        const prices = products.map((p) => Number(p.price) || 0);
        const minP = prices.length ? Math.min(...prices) : 0;
        const maxP = prices.length ? Math.max(...prices) : 0;
        setPriceRange([minP, maxP]);

        // marcas disponibles (depende de resultados actuales)
        const uniqBrands = Array.from(
          new Set(products.map((p) => (p.brand ? String(p.brand) : "")).filter(Boolean))
        ).sort((a, b) => a.localeCompare(b));
        setBrands([]);
        setBrandOptions(uniqBrands);

        // reset de filtros
        setSort("relevance");
        setMinRating(0);
        setOnlyStock(false);
      } catch (e: any) {
        setError(e?.message ?? String(e));
        setBase([]);
      } finally {
        setLoading(false);
      }
    };

    run().catch((e) => {
      setError(String(e));
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, category, q]);

  const filtered = React.useMemo(() => {
    let out = base.slice();

    const [minP, maxP] = priceRange;
    out = out.filter((p) => {
      const price = Number(p.price) || 0;
      return price >= minP && price <= maxP;
    });

    if (minRating > 0) {
      out = out.filter((p) => (Number(p.rating) || 0) >= minRating);
    }

    if (onlyStock) {
      out = out.filter((p) => (typeof p.stock === "number" ? p.stock > 0 : true));
    }

    if (brands.length > 0) {
      const set = new Set(brands);
      out = out.filter((p) => (p.brand ? set.has(String(p.brand)) : false));
    }

    const cmpName = (a: Product, b: Product) => String(a.title).localeCompare(String(b.title));

    switch (sort) {
      case "name_asc":
        out.sort(cmpName);
        break;
      case "price_asc":
        out.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case "price_desc":
        out.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case "rating_desc":
        out.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        break;
      case "discount_desc":
        out.sort((a, b) => (Number(b.discountPercentage) || 0) - (Number(a.discountPercentage) || 0));
        break;
      default:
        // relevance: no tocamos el orden (DummyJSON ya lo trae "relevante" para search)
        break;
    }

    return out;
  }, [base, priceRange, minRating, onlyStock, brands, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = clamp(page, 1, totalPages);
  const view = React.useMemo(() => {
    const start = (safePage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, safePage]);

  React.useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const title = React.useMemo(() => {
    if (mode === "category") return pretty(category ?? "");
    if (mode === "search") return q ? (lang === "en" ? `Results: "${q}"` : `Resultados: "${q}"`) : "";
    return lang === "en" ? "Catalog" : "Catálogo";
  }, [mode, category, q, lang]);

  const clearFilters = () => {
    const prices = base.map((p) => Number(p.price) || 0);
    const minP = prices.length ? Math.min(...prices) : 0;
    const maxP = prices.length ? Math.max(...prices) : 0;
    setPriceRange([minP, maxP]);
    setMinRating(0);
    setOnlyStock(false);
    setBrands([]);
    setSort("relevance");
    setPage(1);
  };

  const FiltersPanel = (
    <Box sx={{ width: { xs: 320, md: 280 }, p: 2 }}>
      <Typography sx={{ fontWeight: 900, mb: 1 }}>{lang === "en" ? "Filters" : "Filtros"}</Typography>
      <Divider sx={{ mb: 2 }} />

      <Stack spacing={2}>
        <FormControl fullWidth size="small">
          <InputLabel>{lang === "en" ? "Sort" : "Ordenar"}</InputLabel>
          <Select
            label={lang === "en" ? "Sort" : "Ordenar"}
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as any);
              setPage(1);
            }}
          >
            <MenuItem value="relevance">{lang === "en" ? "Relevance" : "Relevancia"}</MenuItem>
            <MenuItem value="name_asc">{lang === "en" ? "Name (A-Z)" : "Nombre (A-Z)"}</MenuItem>
            <MenuItem value="price_asc">{lang === "en" ? "Price (low-high)" : "Precio (menor-mayor)"}</MenuItem>
            <MenuItem value="price_desc">{lang === "en" ? "Price (high-low)" : "Precio (mayor-menor)"}</MenuItem>
            <MenuItem value="rating_desc">{lang === "en" ? "Rating (high-low)" : "Calificación (mayor-menor)"}</MenuItem>
            <MenuItem value="discount_desc">{lang === "en" ? "Discount (high-low)" : "Descuento (mayor-menor)"}</MenuItem>
          </Select>
        </FormControl>

        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800, mb: 1 }}>
            {lang === "en" ? "Price range" : "Rango de precio"}
          </Typography>
          <Slider
            value={priceRange}
            onChange={(_, v) => {
              setPriceRange(v as [number, number]);
              setPage(1);
            }}
            valueLabelDisplay="auto"
            min={Math.min(...base.map((p) => Number(p.price) || 0), 0)}
            max={Math.max(...base.map((p) => Number(p.price) || 0), 0)}
            disableSwap
          />
        </Box>

        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800, mb: 1 }}>
            {lang === "en" ? "Minimum rating" : "Calificación mínima"}: {minRating}
          </Typography>
          <Slider
            value={minRating}
            onChange={(_, v) => {
              setMinRating(v as number);
              setPage(1);
            }}
            min={0}
            max={5}
            step={0.5}
            valueLabelDisplay="auto"
          />
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={onlyStock}
              onChange={(e) => {
                setOnlyStock(e.target.checked);
                setPage(1);
              }}
            />
          }
          label={lang === "en" ? "Only in-stock" : "Solo disponibles"}
        />

        <Autocomplete
          multiple
          size="small"
          options={brandOptions}
          value={brands}
          onChange={(_, v) => {
            setBrands(v);
            setPage(1);
          }}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip variant="outlined" label={option} {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={lang === "en" ? "Brands" : "Marcas"}
              placeholder={lang === "en" ? "Select" : "Seleccionar"}
            />
          )}
        />

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" fullWidth onClick={clearFilters}>
            {lang === "en" ? "Clear" : "Limpiar"}
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              if (mode === "search" && q) nav(`/search?q=${encodeURIComponent(q)}`);
              if (mode === "category" && category) nav(`/category/${encodeURIComponent(category)}`);
              if (mode === "all") nav("/products");
              setMobileFiltersOpen(false);
            }}
          >
            {lang === "en" ? "Apply" : "Aplicar"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );

  return (
    <Container sx={{ pb: 6 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.75 }}>
            {loading
              ? lang === "en"
                ? "Loading..."
                : "Cargando..."
              : lang === "en"
                ? `${filtered.length} result(s)`
                : `${filtered.length} resultado(s)`}
          </Typography>
        </Box>

        {/* botón filtros (mobile) */}
        <Button
          startIcon={<FilterAltIcon />}
          variant="outlined"
          sx={{ display: { xs: "inline-flex", md: "none" } }}
          onClick={() => setMobileFiltersOpen(true)}
        >
          {lang === "en" ? "Filters" : "Filtros"}
        </Button>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 2 }}>
        {/* Sidebar filtros (desktop) */}
        <Paper sx={{ display: { xs: "none", md: "block" }, flex: "0 0 auto" }}>
          {FiltersPanel}
        </Paper>

        {/* Resultados */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 2 }}>
            {error && (
              <Typography color="error" sx={{ fontWeight: 800 }}>
                {error}
              </Typography>
            )}

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {view.map((p) => (
                    <Box key={p.id}
                      sx={{
                        width: { xs: "100%", sm: "calc(50% - 16px)", md: "calc(33.333% - 16px)", lg: "calc(25% - 16px)" },
                      }}
                    >
                      <ProductGridCard
                        product={p}
                        lang={lang}
                        onAddToCart={(prod) => {
                          add(prod);
                          setToast({
                            open: true,
                            msg: `${lang === "en" ? "Added" : "Agregado"}: ${prod.title}`,
                          });
                        }}
                      />
                    </Box>
                  ))}
                </Box>


                {filtered.length === 0 && (
                  <Box sx={{ py: 6, textAlign: "center" }}>
                    <Typography sx={{ fontWeight: 900 }}>
                      {lang === "en" ? "No results" : "Sin resultados"}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.75, mt: 1 }}>
                      {lang === "en"
                        ? "Try removing some filters."
                        : "Probá quitando algunos filtros."}
                    </Typography>
                    <Button sx={{ mt: 2 }} variant="outlined" onClick={clearFilters}>
                      {lang === "en" ? "Clear filters" : "Limpiar filtros"}
                    </Button>
                  </Box>
                )}

                {filtered.length > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination
                      count={totalPages}
                      page={safePage}
                      onChange={(_, v) => setPage(v)}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Box>
      </Stack>

      {/* Drawer de filtros (mobile) */}
      <Drawer
        anchor="right"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5 }}>
          <Typography sx={{ fontWeight: 900 }}>{lang === "en" ? "Filters" : "Filtros"}</Typography>
          <IconButton onClick={() => setMobileFiltersOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        {FiltersPanel}
      </Drawer>

      <Snackbar
        open={toast.open}
        autoHideDuration={1400}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      >
        <Alert severity="success" variant="filled">
          {toast.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
