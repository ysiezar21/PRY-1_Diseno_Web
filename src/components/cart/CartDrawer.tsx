import * as React from "react";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  List,
  ListItem,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import type { Product } from "../../api/dummyjson";
import type { CartItem } from "../../cart/cartTypes";

type Props = {
  open: boolean;
  onClose: () => void;
  lang: "es" | "en";

  items: CartItem[];
  subtotal: number;

  onInc: (productId: number) => void;
  onDec: (productId: number) => void;
  onRemove: (productId: number) => void;
  onClear: () => void;
};

const money = (n: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n || 0);

export default function CartDrawer({
  open,
  onClose,
  lang,
  items,
  subtotal,
  onInc,
  onDec,
  onRemove,
  onClear,
}: Props) {
  const [detail, setDetail] = React.useState<Product | null>(null);

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: { xs: 340, sm: 420 }, height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                {lang === "en" ? "Cart" : "Carrito"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                {items.length === 0
                  ? lang === "en"
                    ? "No items yet"
                    : "Aún no hay productos"
                  : lang === "en"
                    ? `${items.length} item(s)`
                    : `${items.length} producto(s)`}
              </Typography>
            </Box>

            <IconButton onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Body */}
          <List sx={{ flex: 1, overflow: "auto" }}>
            {items.map(({ product, qty }) => (
              <ListItem key={product.id} disableGutters sx={{ px: 2, py: 1 }}>
                <Box sx={{ display: "flex", gap: 1.5, width: "100%" }}>
                  <Avatar
                    variant="rounded"
                    src={product.thumbnail}
                    alt={product.title}
                    sx={{ width: 72, height: 72, flex: "0 0 auto" }}
                  />

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{ fontWeight: 800, cursor: "pointer" }}
                      noWrap
                      title={product.title}
                      onClick={() => setDetail(product)}
                    >
                      {product.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.75 }} noWrap>
                      {product.category}
                    </Typography>
                    <Typography sx={{ fontWeight: 900, mt: 0.25 }}>{money(product.price)}</Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: "center" }}>
                      <IconButton size="small" onClick={() => onDec(product.id)} aria-label="decrease">
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography sx={{ minWidth: 20, textAlign: "center", fontWeight: 800 }}>{qty}</Typography>
                      <IconButton size="small" onClick={() => onInc(product.id)} aria-label="increase">
                        <AddIcon fontSize="small" />
                      </IconButton>

                      <Box sx={{ flex: 1 }} />

                      <IconButton size="small" onClick={() => onRemove(product.id)} aria-label="remove">
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>
                </Box>
              </ListItem>
            ))}

            {items.length === 0 && (
              <Box sx={{ p: 3 }}>
                <Typography sx={{ opacity: 0.75 }}>
                  {lang === "en"
                    ? "Add products with the + Add button and they will appear here."
                    : "Agregá productos con el botón + Agregar y aparecerán acá."}
                </Typography>
              </Box>
            )}
          </List>

          <Divider />

          {/* Footer */}
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography sx={{ fontWeight: 800 }}>{lang === "en" ? "Subtotal" : "Subtotal"}</Typography>
              <Typography sx={{ fontWeight: 900 }}>{money(subtotal)}</Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button
                variant="outlined"
                fullWidth
                disabled={items.length === 0}
                onClick={onClear}
              >
                {lang === "en" ? "Clear" : "Vaciar"}
              </Button>
              <Button
                variant="contained"
                fullWidth
                disabled={items.length === 0}
                onClick={() => {
                  // Por ahora solo UX (no hay checkout real)
                  onClose();
                }}
              >
                {lang === "en" ? "Continue" : "Continuar"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>

      {/* Modal de detalles (cumple "ver detalles" del carro sin routing aún) */}
      <Dialog open={Boolean(detail)} onClose={() => setDetail(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>
          {lang === "en" ? "Product details" : "Detalles del producto"}
        </DialogTitle>
        <DialogContent>
          {detail && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              <Avatar
                variant="rounded"
                src={detail.thumbnail}
                alt={detail.title}
                sx={{ width: 120, height: 120, flex: "0 0 auto" }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 900 }}>{detail.title}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.75 }}>
                  {detail.category}
                </Typography>
                <Typography sx={{ fontWeight: 900, mt: 1 }}>{money(detail.price)}</Typography>
                {typeof detail.discountPercentage === "number" && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {lang === "en" ? "Discount" : "Descuento"}: {detail.discountPercentage}%
                  </Typography>
                )}
                {typeof detail.rating === "number" && (
                  <Typography variant="body2">{lang === "en" ? "Rating" : "Calificación"}: {detail.rating}</Typography>
                )}
              </Box>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={() => setDetail(null)}>{lang === "en" ? "Close" : "Cerrar"}</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
