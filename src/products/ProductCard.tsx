import * as React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Stack,
  Chip,
  CardActionArea,
  Avatar,
} from "@mui/material";
import type { Product } from "../api/dummyjson";
import { languages } from "../languages/languages";

type Lang = "es" | "en";

type Props = {
  product: Product;
  onAddToCart: (p: Product) => void;
  lang?: Lang;
};

const money = (n: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n || 0);

export default function ProductCard({ product, onAddToCart, lang = "es" }: Props) {
  const t = languages[lang].productCard;
  const [open, setOpen] = React.useState(false);

  const canAdd = typeof product.stock === "number" ? product.stock > 0 : true;

  return (
    <>
      <Card sx={{ width: 220, flex: "0 0 auto" }}>
        <CardActionArea onClick={() => setOpen(true)}>
          <CardMedia
            component="img"
            height="140"
            image={product.thumbnail}
            alt={product.title}
            sx={{ objectFit: "cover" }}
          />
          <CardContent sx={{ pb: 0 }}>
            <Typography sx={{ fontWeight: 800 }} noWrap title={product.title}>
              {product.title}
            </Typography>
            <Typography sx={{ fontWeight: 900 }}>{money(product.price)}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.75 }} noWrap title={product.category}>
              {product.category}
            </Typography>
          </CardContent>
        </CardActionArea>

        <CardActions>
          <Button
            variant="contained"
            size="small"
            fullWidth
            disabled={!canAdd}
            onClick={() => onAddToCart(product)}
          >
            + {t.add}
          </Button>
        </CardActions>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>{product.title}</DialogTitle>

        <DialogContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 1 }}>
            <Avatar
              variant="rounded"
              src={product.thumbnail}
              alt={product.title}
              sx={{ width: { xs: "100%", sm: 180 }, height: { xs: 220, sm: 180 } }}
            />

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 900, fontSize: 22 }}>{money(product.price)}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                {product.brand ? `${product.brand} · ${product.category}` : product.category}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap", rowGap: 1 }}>
                {typeof product.rating === "number" && (
                  <Chip size="small" label={`★ ${product.rating}`} />
                )}
                {typeof product.discountPercentage === "number" && (
                  <Chip
                    size="small"
                    label={`${t.discount}: ${product.discountPercentage}%`}
                  />
                )}
                {typeof product.stock === "number" && (
                  <Chip size="small" label={`${t.stock}: ${product.stock}`} />
                )}
              </Stack>

              {product.description && (
                <Typography sx={{ mt: 1.5, lineHeight: 1.35 }}>{product.description}</Typography>
              )}
            </Box>
          </Stack>

          {Array.isArray(product.images) && product.images.length > 0 && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                gap: 1,
                overflowX: "auto",
                pb: 1,
                "&::-webkit-scrollbar": { height: 8 },
                "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(0,0,0,0.2)", borderRadius: 999 },
              }}
            >
              {product.images.slice(0, 10).map((url, idx) => (
                <Box
                  key={`${product.id}-${idx}`}
                  component="img"
                  src={url}
                  alt={`${product.title} ${idx + 1}`}
                  sx={{
                    width: 96,
                    height: 72,
                    objectFit: "cover",
                    borderRadius: 1.5,
                    bgcolor: "#eee",
                    flex: "0 0 auto",
                  }}
                />
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mt: 2, pb: 1 }}>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              {t.close}
            </Button>

            <Button
              variant="contained"
              disabled={!canAdd}
              onClick={() => {
                onAddToCart(product);
                setOpen(false);
              }}
            >
              + {t.addToCart}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
