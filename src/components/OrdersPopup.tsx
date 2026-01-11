// src/components/OrdersPopup.tsx
import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Stack
} from "@mui/material";
import { getUserOrdersArray } from "../services/userService";

interface OrdersPopupProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  lang: "es" | "en";
}

export default function OrdersPopup({ open, onClose, userId, lang }: OrdersPopupProps) {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open && userId) {
      loadOrders();
    }
  }, [open, userId]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const userOrders = await getUserOrdersArray(userId);
      setOrders(userOrders);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
      setError(lang === "es" 
        ? "Error al cargar los pedidos" 
        : "Error loading orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";
    try {
      const date = timestamp.toDate();
      return date.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "-";
    }
  };

  const t = {
    title: lang === "en" ? "My Orders" : "Mis Pedidos",
    close: lang === "en" ? "Close" : "Cerrar",
    loading: lang === "en" ? "Loading orders..." : "Cargando pedidos...",
    noOrders: lang === "en" ? "You don't have any orders yet" : "No tienes pedidos aún",
    orderId: lang === "en" ? "Order ID" : "ID del Pedido",
    date: lang === "en" ? "Date" : "Fecha",
    total: lang === "en" ? "Total" : "Total",
    status: lang === "en" ? "Status" : "Estado",
    products: lang === "en" ? "Products" : "Productos",
    quantity: lang === "en" ? "Quantity" : "Cantidad",
    price: lang === "en" ? "Price" : "Precio",
    pending: lang === "en" ? "Pending" : "Pendiente",
    completed: lang === "en" ? "Completed" : "Completado",
    cancelled: lang === "en" ? "Cancelled" : "Cancelado"
  };

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case "completado":
      case "completed":
        return "success";
      case "cancelado":
      case "cancelled":
        return "error";
      default:
        return "warning";
    }
  };

  const getStatusText = (status: string) => {
    switch(status?.toLowerCase()) {
      case "completado":
      case "completed":
        return t.completed;
      case "cancelado":
      case "cancelled":
        return t.cancelled;
      default:
        return t.pending;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ fontWeight: 900, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{t.title}</span>
        <Chip 
          label={`${orders.length} ${lang === "en" ? "orders" : "pedidos"}`} 
          color="primary" 
          size="small"
        />
      </DialogTitle>
      
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>{t.loading}</Typography>
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : orders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              {t.noOrders}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {orders.map((order, index) => (
              <Paper key={order.id} sx={{ p: 3 }}>
                {/* Encabezado del pedido */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {t.orderId}: <span style={{ fontFamily: 'monospace' }}>{order.id}</span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t.date}: {formatDate(order.fecha)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip 
                      label={getStatusText(order.estado)} 
                      color={getStatusColor(order.estado) as any}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h6" color="primary">
                      ${order.total?.toFixed(2) || "0.00"}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Productos del pedido */}
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  {t.products}:
                </Typography>
                
                <Stack spacing={1.5}>
                  {order.productosArray && order.productosArray.length > 0 ? (
                    order.productosArray.map((producto: any, _idx: number) => (
                      <Box 
                        key={producto.id} 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1.5,
                          bgcolor: 'action.hover',
                          borderRadius: 1
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600 }}>
                            {producto.nombre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {producto.categoria}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                          <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                            <Typography variant="body2" color="text.secondary">
                              {t.quantity}
                            </Typography>
                            <Typography sx={{ fontWeight: 600 }}>
                              {producto.cantidad}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                            <Typography variant="body2" color="text.secondary">
                              {t.price}
                            </Typography>
                            <Typography sx={{ fontWeight: 600 }}>
                              ${producto.precio?.toFixed(2) || "0.00"}
                            </Typography>
                          </Box>
                          
                          
                        </Box>
                      </Box>
                    ))
                  ) : order.productos && typeof order.productos === 'object' ? (
                    // Si los productos vienen como objeto (mapa)
                    Object.entries(order.productos).map(([key, prod]: [string, any]) => (
                      <Box 
                        key={key} 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1.5,
                          bgcolor: 'action.hover',
                          borderRadius: 1
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 600 }}>
                            {prod.nombre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {prod.categoria}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                          <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                            <Typography variant="body2" color="text.secondary">
                              {t.quantity}
                            </Typography>
                            <Typography sx={{ fontWeight: 600 }}>
                              {prod.cantidad}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                            <Typography variant="body2" color="text.secondary">
                              {t.price}
                            </Typography>
                            <Typography sx={{ fontWeight: 600 }}>
                              ${prod.precio?.toFixed(2) || "0.00"}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                            <Typography variant="body2" color="text.secondary">
                              {lang === "en" ? "Subtotal" : "Subtotal"}
                            </Typography>
                            <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
                              ${((prod.cantidad || 0) * (prod.precio || 0)).toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      {lang === "en" ? "No product details available" : "Sin detalles de productos"}
                    </Typography>
                  )}
                </Stack>

                {index < orders.length - 1 && <Divider sx={{ mt: 3 }} />}
              </Paper>
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          {t.close}
        </Button>
      </DialogActions>
    </Dialog>
  );
}