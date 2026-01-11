import * as React from "react";
import {
  Box,
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
import { languages } from "../languages/languages";
import { addNewOrder, addPaymentMethod } from "../services/userService";

type Props = {
  lang: "es" | "en";
};

const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n || 0);

export default function CheckoutPage({ lang }: Props) {
  const t = languages[lang || "en"].checkout;
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const descuento = items.reduce((acc, { product, qty }) => {
    const porcentaje = product.discountPercentage ?? 0;
    const descuentoProducto = (product.price * porcentaje / 100) * qty;
    return acc + descuentoProducto;
  }, 0);

  const shipping = items.length > 0 ? 5 : 0;
  const total = subtotal + shipping - descuento;

  const [openPayment, setOpenPayment] = React.useState(false);
  const [cardNumber, setCardNumber] = React.useState("");
  const [cardName, setCardName] = React.useState("");
  const [month, setMonth] = React.useState("");
  const [year, setYear] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openLoginRequired, setOpenLoginRequired] = React.useState(false);

  const handleCheckout = () => {
    if (!user) {
      setOpenLoginRequired(true);
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

  const handleConfirmPayment = async () => { // <-- Añade async
  if (!isPaymentValid()) {
    alert(t.completeFields);
    return;
  }

  try {
    if (!user) {
      alert("Usuario no autenticado");
      return;
    }

    // 1. Crear método de pago
    const metodoId = `metodo_${Date.now()}`;
    const metodoPago = {
      añoExp: year,
      cvv: cvv,
      mesExp: month,
      numeroTarjeta: cardNumber.replace(/\s/g, ''), // Quitar espacios
      titular: cardName
    };

    await addPaymentMethod(user.uid, metodoId, metodoPago);

    // 2. Convertir items del carrito a productos para Firestore
    const productosMap: { [key: string]: any } = {};
    
    items.forEach(({ product, qty }, index) => {
      const productoId = `producto_${index + 1}`;
      productosMap[productoId] = {
        cantidad: qty,
        categoria: product.category,
        nombre: product.title,
        precio: product.price
      };
    });

    // 3. Crear el pedido
    const pedidoId = `pedido_${Date.now()}`;
    const pedido = {
      productos: productosMap,
      total: total,
      fecha: new Date(), // Se convertirá a timestamp en addNewOrder
      estado: "pendiente"
    };

    // 4. Guardar pedido en Firestore
    await addNewOrder(user.uid, pedidoId, pedido);

    // 5. Limpiar carrito y mostrar éxito
    clear();
    setOpenPayment(false);
    setOpenSuccess(true);

    console.log("✅ Pedido guardado en Firestore:", pedidoId);

  } catch (error) {
    console.error("❌ Error guardando pedido:", error);
    alert("Error al procesar el pedido. Intenta nuevamente.");
  }
};

  const handleCancelPayment = () => {
    setOpenPayment(false);
  };

  const inputSx = {
    flex: 1,
    px: 1,
    py: 0.5,
    border: 1,
    borderColor: "divider",
    borderRadius: 1,
    minWidth: 0,
    color: "text.primary",
    bgcolor: "background.paper"
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, justifyContent: "center" }}>
        {/* Productos */}
        <Box sx={{ width: { xs: "100%", md: "75%" } }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>{t.products}</Typography>
          <Stack spacing={2}>
            {items.map(({ product, qty }) => (
              <Paper key={product.id} sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar variant="rounded" src={product.thumbnail} sx={{ width: 90, height: 90 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800 }}>{product.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>{product.category}</Typography>
                </Box>
                <Box sx={{ textAlign: "right", minWidth: 90 }}>
                  <Typography variant="body2">{t.quantity}</Typography>
                  <Typography sx={{ fontWeight: 800 }}>{qty}</Typography>
                </Box>
                <Box sx={{ textAlign: "right", minWidth: 120 }}>
                  <Typography variant="body2">{t.total}</Typography>
                  <Typography sx={{ fontWeight: 900 }}>{money(product.price * qty)}</Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Box>

        {/* Resumen */}
        <Box sx={{ width: { xs: "100%", md: "25%" } }}>
          <Paper sx={{ p: 3, position: "sticky", top: 140 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>{t.summary}</Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>{t.subtotal}</Typography>
                <Typography>{money(subtotal)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>{t.shipping}</Typography>
                <Typography>{money(shipping)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography>{t.discount}</Typography>
                <Typography>-{money(descuento)}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 900 }}>{t.total}</Typography>
                <Typography sx={{ fontWeight: 900 }}>{money(total)}</Typography>
              </Box>
            </Stack>
            <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={handleCheckout}>
              {t.checkout}
            </Button>
          </Paper>
        </Box>
      </Box>

      {/* Modal de pago */}
      <Dialog open={openPayment} onClose={handleCancelPayment}>
        <DialogTitle sx={{ fontWeight: 900 }}>{t.cardInfo}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <InputBase
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder={t.cardNumber}
              sx={inputSx}
            />
            <InputBase
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder={t.cardName}
              sx={inputSx}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <InputBase
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="MM"
                sx={{ ...inputSx, flex: 1 }}
                inputProps={{ maxLength: 2 }}
              />
              <InputBase
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="AA"
                sx={{ ...inputSx, flex: 1 }}
                inputProps={{ maxLength: 2 }}
              />
            </Box>
            <InputBase
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="CVV"
              sx={inputSx}
              inputProps={{ maxLength: 4 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelPayment} color="inherit">{t.cancel}</Button>
          <Button variant="contained" onClick={handleConfirmPayment} disabled={!isPaymentValid()}>
            {t.pay}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de éxito */}
      <Dialog open={openSuccess} onClose={() => {}}>
        <DialogTitle sx={{ fontWeight: 900 }}>{t.successTitle}</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>{t.successMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => { setOpenSuccess(false); navigate("/"); }}>
            {t.accept}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de inicio de sesión requerido */}
      <Dialog open={openLoginRequired}>
        <DialogTitle sx={{ fontWeight: 900 }}>{t.loginRequiredTitle}</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>{t.loginRequiredMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenLoginRequired(false); navigate("/login"); }} variant="contained">
            {t.accept}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
