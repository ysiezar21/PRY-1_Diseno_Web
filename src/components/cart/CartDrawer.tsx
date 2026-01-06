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
import { useNavigate } from "react-router-dom";

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
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(n || 0);

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
  const navigate = useNavigate();

  // ✅ FUNCIÓN CORRECTA
  const handleContinue = () => {
    onClose();              // cerrar carrito
    navigate("/checkout");  // ir a checkout
  };

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box
          sx={{
            width: { xs: 340, sm: 420 },
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
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

            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* BODY */}
          <List sx={{ flex: 1, overflow: "auto" }}>
            {items.map(({ product, qty }) => (
              <ListItem key={product.id} disableGutters sx={{ px: 2, py: 1 }}>
                <Box sx={{ display: "flex", gap: 1.5, width: "100%" }}>
                  <Avatar
                    variant="rounded"
                    src={product.thumbnail}
                    sx={{ width: 72, height: 72 }}
                  />

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{ fontWeight: 800, cursor: "pointer" }}
                      noWrap
                      onClick={() => setDetail(product)}
                    >
                      {product.title}
                    </Typography>

                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                      {product.category}
                    </Typography>

                    <Typography sx={{ fontWeight: 900 }}>
                      {money(product.price)}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 1, alignItems: "center" }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => onDec(product.id)}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      <Typography sx={{ fontWeight: 800 }}>
                        {qty}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={() => onInc(product.id)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>

                      <Box sx={{ flex: 1 }} />

                      <IconButton
                        size="small"
                        onClick={() => onRemove(product.id)}
                      >
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
                    ? "Add products and they will appear here."
                    : "Agregá productos y aparecerán acá."}
                </Typography>
              </Box>
            )}
          </List>

          <Divider />

          {/* FOOTER */}
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography sx={{ fontWeight: 800 }}>
                Subtotal
              </Typography>
              <Typography sx={{ fontWeight: 900 }}>
                {money(subtotal)}
              </Typography>
            </Box>

            <Stack spacing={1}>
              <Button
                variant="outlined"
                fullWidth
                disabled={items.length === 0}
                onClick={onClear}
              >
                {lang === "en" ? "Clear" : "Vaciar"}
              </Button>

              {/* ✅ BOTÓN ARREGLADO */}
              <Button
                variant="contained"
                fullWidth
                disabled={items.length === 0}
                onClick={handleContinue}
              >
                {lang === "en" ? "Continue" : "Continuar"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>

      {/* MODAL DETALLE */}
      <Dialog open={Boolean(detail)} onClose={() => setDetail(null)}>
        <DialogTitle>
          {lang === "en" ? "Product details" : "Detalles del producto"}
        </DialogTitle>
        <DialogContent>
          {detail && (
            <Typography sx={{ fontWeight: 900 }}>
              {detail.title}
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
