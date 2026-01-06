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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputBase,
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

  const [openPayment, setOpenPayment] = React.useState(false);
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardName, setCardName] = React.useState("");
  const [month, setMonth] = React.useState("");
  const [year, setYear] = React.useState("");
  const [cvv, setCvv] = React.useState("");

  const handleCheckout = () => {
    if (!user) {
      alert("Debes iniciar sesión para finalizar la compra");
      navigate("/login");
      return;
    }
    setOpenPayment(true);
  };

  const isPaymentValid = () => {
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    return (
      cardNumber.trim().length >= 12 &&
      cardName.trim().length > 0 &&
      month.trim().length === 2 &&
      year.trim().length === 2 &&
      monthNum >= 1 && monthNum <= 12 &&
      yearNum >= 0 &&
      cvv.trim().length >= 3
    );
  };

  const handleConfirmPayment = () => {
    if (!isPaymentValid()) {
      alert("Por favor completa todos los campos correctamente");
      return;
    }
    alert("Pago realizado con éxito 🎉");
    clear();
    setOpenPayment(false);
    navigate("/");
  };

  const handleCancelPayment = () => {
    setOpenPayment(false);
  };

  if (items.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">No hay productos seleccionados</Typography>
      </Box>
    );
  }

  // ================== Estilo para los inputs ==================
  const inputStyle = {
    flex: 1,
    px: 1,
    py: 0.5,
    border: "1px solid #ccc",
    borderRadius: 1,
    minWidth: 0,
  };

  const buttonBlueStyle = {
    color: "white",
    backgroundColor: "blue",
    "&:hover": { backgroundColor: "#0051b3" },
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={4}>
        {/* Productos */}
        <Grid item xs={12} md={9}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Productos</Typography>
          <Stack spacing={2}>
            {items.map(({ product, qty }) => (
              <Paper key={product.id} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar variant="rounded" src={product.thumbnail} sx={{ width: 90, height: 90 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800 }}>{product.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>{product.category}</Typography>
                </Box>
                <Box sx={{ textAlign: "right", minWidth: 90 }}>
                  <Typography variant="body2">Cantidad</Typography>
                  <Typography sx={{ fontWeight: 800 }}>{qty}</Typography>
                </Box>
                <Box sx={{ textAlign: "right", minWidth: 120 }}>
                  <Typography variant="body2">Total</Typography>
                  <Typography sx={{ fontWeight: 900 }}>{money(product.price * qty)}</Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Grid>

        {/* Resumen */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, position: "sticky", top: 140 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Resumen</Typography>
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
                <Typography sx={{ fontWeight: 900 }}>Total</Typography>
                <Typography sx={{ fontWeight: 900 }}>{money(total)}</Typography>
              </Box>
            </Stack>
            <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleCheckout}>
              Finalizar compra
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal de pago */}
      <Dialog open={openPayment} onClose={handleCancelPayment}>
        <DialogTitle sx={{ fontWeight: 900 }}>Información de la tarjeta</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <InputBase
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="Número de tarjeta"
              sx={inputStyle}
            />
            <InputBase
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Nombre en la tarjeta"
              sx={inputStyle}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <InputBase
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="MM"
                sx={{ ...inputStyle, flex: 1 }}
                inputProps={{ maxLength: 2 }}
              />
              <InputBase
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="AA"
                sx={{ ...inputStyle, flex: 1 }}
                inputProps={{ maxLength: 2 }}
              />
            </Box>
            <InputBase
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="CVV"
              sx={inputStyle}
              inputProps={{ maxLength: 4 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelPayment} sx={buttonBlueStyle}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleConfirmPayment}
            sx={buttonBlueStyle}
            disabled={!isPaymentValid()}
          >
            Pagar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
