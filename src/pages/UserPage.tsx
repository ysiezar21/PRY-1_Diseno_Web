import * as React from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Divider,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Stack,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Iconos
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuth } from "../auth/AuthProvider";
import { logout } from "../auth/auth";

type Props = {
  lang: "es" | "en";
};

export default function ProfilePage({ lang }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };


  // no se si esto deberia de ir aca, pero bueno sino sse borra y ya 
  const t = {
    title: lang === "en" ? "My Profile" : "Mi Perfil",
    memberSince: lang === "en" ? "Member since 2024" : "Miembro desde 2024",
    personalInfo: lang === "en" ? "Personal Information" : "Información Personal",
    myOrders: lang === "en" ? "My Orders" : "Mis Pedidos",
    addresses: lang === "en" ? "Addresses" : "Direcciones",
    paymentMethods: lang === "en" ? "Payment Methods" : "Métodos de Pago",
    settings: lang === "en" ? "Settings" : "Configuración",
    logout: lang === "en" ? "Log out" : "Cerrar sesión",
    phone: "+506 8888-8888",
  };

  return (
    <Box sx={{ py: 4, minHeight: "80vh" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 3 }}>
          {t.title}
        </Typography>

        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", md: "row" }, 
            gap: 3 
          }}
        >
          
          <Box sx={{ flex: { xs: "1 1 auto", md: "0 0 350px" } }}>
            <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Avatar
                  sx={{ width: 100, height: 100, bgcolor: "primary.main", fontSize: 40 }}
                >
                  {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                </Avatar>
              </Box>
              
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {user.email?.split("@")[0]}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {user.email}
              </Typography>

              <Chip label={t.memberSince} size="small" variant="outlined" sx={{ mb: 3 }} />

              <Divider sx={{ my: 2 }} />

              <List disablePadding>
                <ListItem>
                  <ListItemIcon><EmailIcon /></ListItemIcon>
                  <ListItemText primary="Email" secondary={user.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PhoneIcon /></ListItemIcon>
                  <ListItemText primary={lang === "en" ? "Phone" : "Teléfono"} secondary={t.phone} />
                </ListItem>
              </List>
            </Paper>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              
              <Paper sx={{ p: 0, overflow: "hidden" }}>
                <List disablePadding>
                  <ListItem disablePadding divider>
                    <ListItemButton onClick={() => alert("Ir a Pedidos (Simulado)")}>
                        <ListItemIcon><ShoppingBagIcon color="primary" /></ListItemIcon>
                        <ListItemText 
                          primary={t.myOrders} 
                          secondary={lang === "en" ? "View order history" : "Ver historial de compras"} 
                        />
                    </ListItemButton>
                  </ListItem>
                  
                  <ListItem disablePadding divider>
                    <ListItemButton onClick={() => null}>
                        <ListItemIcon><HomeIcon color="action" /></ListItemIcon>
                        <ListItemText primary={t.addresses} secondary="San José, Costa Rica" />
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding>
                    <ListItemButton onClick={() => null}>
                        <ListItemIcon><CreditCardIcon color="action" /></ListItemIcon>
                        <ListItemText primary={t.paymentMethods} secondary="Visa ending in 4242" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  {lang === "en" ? "Account Control" : "Control de Cuenta"}
                </Typography>
                
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                   <Button 
                      fullWidth 
                      variant="outlined" 
                      startIcon={<SettingsIcon />}
                   >
                      {t.settings}
                   </Button>

                   <Button 
                      fullWidth 
                      variant="contained" 
                      color="error" 
                      startIcon={<LogoutIcon />}
                      onClick={handleLogout}
                   >
                      {t.logout}
                   </Button>
                </Stack>
              </Paper>

            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}