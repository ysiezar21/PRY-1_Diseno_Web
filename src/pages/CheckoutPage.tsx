import * as React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Button,
  Divider,
  Avatar,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useCart } from "../cart/CartProvider";
import { useAuth } from "../auth/AuthProvider"; 

const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n || 0);

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const shipping = items.length > 0 ? 5 : 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    // VALIDACIÓN 
    if (!user) {
      alert("Debes iniciar sesión para finalizar la compra");
      navigate("/login");
      return;
    }

    alert("Compra confirmada 🎉");
    clear();
    navigate("/");
  };

  if (items.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">
          No hay productos seleccionados
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={4}>
        {/* ================== PRODUCTOS ================== */}
        <Grid item xs={12} md={9}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
            Productos
          </Typography>

          <Stack spacing={2}>
            {items.map(({ product, qty }) => (
              <Paper
                key={product.id}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Avatar
                  variant="rounded"
                  src={product.thumbnail}
                  sx={{ width: 90, height: 90 }}
                />

                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800 }}>
                    {product.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    {product.category}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right", minWidth: 90 }}>
                  <Typography variant="body2">Cantidad</Typography>
                  <Typography sx={{ fontWeight: 800 }}>{qty}</Typography>
                </Box>

                <Box sx={{ textAlign: "right", minWidth: 120 }}>
                  <Typography variant="body2">Total</Typography>
                  <Typography sx={{ fontWeight: 900 }}>
                    {money(product.price * qty)}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Grid>

        {/* ================== RESUMEN ================== */}
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              position: "sticky",
              top: 140,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
              Resumen
            </Typography>

            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Subtotal</Typography>
                <Typography>{money(subtotal)}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>Envío</Typography>
                <Typography>{money(shipping)}</Typography>
              </Box>

              <Divider />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 900 }}>
                  Total
                </Typography>
                <Typography sx={{ fontWeight: 900 }}>
                  {money(total)}
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              onClick={handleCheckout}
            >
              Finalizar compra
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
