import * as React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Box,
} from "@mui/material";

import type { Product } from "../../api/dummyjson";

type Props = {
  product: Product;
  lang: "es" | "en";
  onAddToCart: (p: Product) => void;
};

const money = (n: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n || 0);

export default function ProductGridCard({ product, lang, onAddToCart }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <CardMedia
          component="img"
          height="170"
          image={product.thumbnail}
          alt={product.title}
          sx={{ objectFit: "cover", cursor: "pointer" }}
          onClick={() => setOpen(true)}
        />

        <CardContent sx={{ pb: 0, flex: 1 }}>
          <Typography sx={{ fontWeight: 900 }} noWrap title={product.title}>
            {product.title}
          </Typography>

          <Typography sx={{ fontWeight: 900, mt: 0.5 }}>{money(product.price)}</Typography>

          <Typography variant="body2" sx={{ opacity: 0.75 }} noWrap>
            {product.brand ? `${product.brand} · ${product.category}` : product.category}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
            {typeof product.rating === "number" && (
              <Chip size="small" label={`${lang === "en" ? "Rating" : "Calif."}: ${product.rating}`} />
            )}
            {typeof product.discountPercentage === "number" && (
              <Chip size="small" label={`${product.discountPercentage}% OFF`} />
            )}
            {typeof product.stock === "number" && (
              <Chip
                size="small"
                label={
                  product.stock > 0
                    ? lang === "en"
                      ? "In stock"
                      : "Disponible"
                    : lang === "en"
                      ? "Out of stock"
                      : "Agotado"
                }
              />
            )}
          </Stack>
        </CardContent>

        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => onAddToCart(product)}
            disabled={typeof product.stock === "number" ? product.stock <= 0 : false}
          >
            + {lang === "en" ? "Add" : "Agregar"}
          </Button>
        </CardActions>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>
          {lang === "en" ? "Product details" : "Detalles del producto"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <Avatar
              variant="rounded"
              src={product.thumbnail}
              alt={product.title}
              sx={{ width: 140, height: 140, flex: "0 0 auto" }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 900 }}>{product.title}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                {product.brand ? `${product.brand} · ${product.category}` : product.category}
              </Typography>

              <Typography sx={{ fontWeight: 900, mt: 1 }}>{money(product.price)}</Typography>

              {typeof product.discountPercentage === "number" && (
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {lang === "en" ? "Discount" : "Descuento"}: {product.discountPercentage}%
                </Typography>
              )}

              {typeof product.rating === "number" && (
                <Typography variant="body2">
                  {lang === "en" ? "Rating" : "Calificación"}: {product.rating}
                </Typography>
              )}

              {typeof product.stock === "number" && (
                <Typography variant="body2">
                  {lang === "en" ? "Stock" : "Existencias"}: {product.stock}
                </Typography>
              )}
            </Box>
          </Box>

          {product.description && (
            <Typography sx={{ mt: 2, whiteSpace: "pre-line" }}>{product.description}</Typography>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              {lang === "en" ? "Close" : "Cerrar"}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                onAddToCart(product);
                setOpen(false);
              }}
              disabled={typeof product.stock === "number" ? product.stock <= 0 : false}
            >
              + {lang === "en" ? "Add to cart" : "Agregar al carrito"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
