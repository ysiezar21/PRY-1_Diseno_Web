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
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Badge
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
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";

import { useAuth } from "../auth/AuthProvider";
import { logout } from "../auth/auth";
import { getUserProfile, getUserOrdersArray, getUserPaymentMethodsArray, updateUserData } from "../services/userService";

type Props = {
  lang: "es" | "en";
};

export default function UserPage({ lang }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados para los datos del usuario
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [orders, setOrders] = React.useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editMode, setEditMode] = React.useState(false);
  const [editData, setEditData] = React.useState({
    nombre: "",
    telefono: "",
    direccion: ""
  });

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    loadUserData();
  }, [user, navigate]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // 1. Cargar perfil del usuario desde Firestore
      const profile = await getUserProfile(user.uid);
      
      if (!profile) {
        setError(lang === "en" 
          ? "User profile not found" 
          : "Perfil de usuario no encontrado"
        );
        setLoading(false);
        return;
      }
      
      setUserProfile(profile);
      setEditData({
        nombre: profile.nombre || "",
        telefono: profile.telefono || "",
        direccion: profile.direccion || ""
      });
      
      // 2. Cargar pedidos
      try {
        const userOrders = await getUserOrdersArray(user.uid);
        setOrders(userOrders);
      } catch (orderError) {
        console.log("No se pudieron cargar los pedidos:", orderError);
      }
      
      // 3. Cargar métodos de pago
      try {
        const methods = await getUserPaymentMethodsArray(user.uid);
        setPaymentMethods(methods);
      } catch (paymentError) {
        console.log("No se pudieron cargar los métodos de pago:", paymentError);
      }
      
    } catch (error: any) {
      console.error("❌ Error cargando datos:", error);
      setError(lang === "en" 
        ? "Error loading profile data" 
        : "Error al cargar los datos del perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSaveEdit = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await updateUserData(user.uid, editData);
      
      // Recargar datos
      await loadUserData();
      setEditMode(false);
      
      // Mostrar mensaje de éxito
      setError(null);
    } catch (error: any) {
      setError(lang === "en" 
        ? "Error updating profile" 
        : "Error al actualizar el perfil"
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
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "-";
    }
  };

  const t = {
    title: lang === "en" ? "My Profile" : "Mi Perfil",
    memberSince: lang === "en" ? "Member since " : "Miembro desde ",
    personalInfo: lang === "en" ? "Personal Information" : "Información Personal",
    myOrders: lang === "en" ? "My Orders" : "Mis Pedidos",
    addresses: lang === "en" ? "Address" : "Dirección",
    paymentMethods: lang === "en" ? "Payment Methods" : "Métodos de Pago",
    settings: lang === "en" ? "Settings" : "Configuración",
    logout: lang === "en" ? "Log out" : "Cerrar sesión",
    phone: lang === "en" ? "Phone" : "Teléfono",
    name: lang === "en" ? "Name" : "Nombre",
    email: lang === "en" ? "Email" : "Correo",
    loading: lang === "en" ? "Loading..." : "Cargando...",
    noData: lang === "en" ? "No data" : "Sin datos",
    viewDetails: lang === "en" ? "View details" : "Ver detalles",
    totalOrders: lang === "en" ? "orders" : "pedidos",
    totalCards: lang === "en" ? "cards" : "tarjetas",
    editProfile: lang === "en" ? "Edit Profile" : "Editar Perfil",
    saveChanges: lang === "en" ? "Save Changes" : "Guardar Cambios",
    cancel: lang === "en" ? "Cancel" : "Cancelar",
    updateSuccess: lang === "en" ? "Profile updated successfully!" : "¡Perfil actualizado correctamente!"
  };

  if (!user) return null;

  if (loading && !editMode) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>{t.loading}</Typography>
      </Box>
    );
  }

  if (error && !userProfile) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={loadUserData}>
            {lang === "en" ? "Try again" : "Intentar nuevamente"}
          </Button>
        </Container>
      </Box>
    );
  }

  // Datos del usuario desde Firestore
  const userData = {
    name: userProfile?.nombre || user.email?.split("@")[0] || "Usuario",
    email: userProfile?.email || user.email || "-",
    phone: userProfile?.telefono || "-",
    address: userProfile?.direccion || "-",
    memberSince: userProfile?.createdAt ? formatDate(userProfile.createdAt) : t.noData,
    ordersCount: orders.length,
    paymentMethodsCount: paymentMethods.length
  };

  return (
    <Box sx={{ py: 4, minHeight: "80vh" }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            {t.title}
          </Typography>
          
          {!editMode && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditMode(true)}
            >
              {t.editProfile}
            </Button>
          )}
        </Box>

        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", md: "row" }, 
            gap: 3 
          }}
        >
          
          {/* Columna izquierda - Información del usuario */}
          <Box sx={{ flex: { xs: "1 1 auto", md: "0 0 350px" } }}>
            <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Avatar
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: "primary.main", 
                    fontSize: 40,
                    margin: "0 auto"
                  }}
                >
                  {userData.name.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
              
              {editMode ? (
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label={t.name}
                    value={editData.nombre}
                    onChange={(e) => setEditData({...editData, nombre: e.target.value})}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label={t.email}
                    value={userData.email}
                    disabled
                    sx={{ mb: 2 }}
                  />
                </Box>
              ) : (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    {userData.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {userData.email}
                  </Typography>

                  <Chip 
                    icon={<CalendarTodayIcon />}
                    label={`${t.memberSince}${userData.memberSince}`} 
                    size="small" 
                    variant="outlined" 
                    sx={{ mb: 3 }} 
                  />
                </>
              )}

              
            

             

              {/* Botones de acción en modo edición */}
              {editMode && (
                <Box sx={{ mt: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSaveEdit}
                    disabled={loading}
                    sx={{ mb: 1 }}
                  >
                    {loading ? <CircularProgress size={24} /> : t.saveChanges}
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      setEditMode(false);
                      setEditData({
                        nombre: userProfile?.nombre || "",
                        telefono: userProfile?.telefono || "",
                        direccion: userProfile?.direccion || ""
                      });
                    }}
                  >
                    {t.cancel}
                  </Button>
                </Box>
              )}
            </Paper>
          </Box>

          {/* Columna derecha - Opciones y detalles */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={3}>
              
              {/* Sección de información personal */}
              <Paper sx={{ p: 0, overflow: "hidden" }}>
                <List disablePadding>
                  {/* Teléfono */}
                  <ListItem disablePadding divider>
                    <ListItemButton onClick={() => {
                      if (editMode) return;
                      if (userData.phone === "-") {
                        alert(lang === "en" 
                          ? "Add your phone number in edit mode" 
                          : "Agrega tu número de teléfono en modo edición"
                        );
                      } else {
                        alert(`${t.phone}: ${userData.phone}`);
                      }
                    }}>
                      <ListItemIcon>
                        <PhoneIcon color={userData.phone !== "-" ? "primary" : "action"} />
                      </ListItemIcon>
                      
                      {editMode ? (
                        <TextField
                          fullWidth
                          label={t.phone}
                          value={editData.telefono}
                          onChange={(e) => setEditData({...editData, telefono: e.target.value})}
                          size="small"
                        />
                      ) : (
                        <ListItemText 
                          primary={t.phone} 
                          secondary={userData.phone} 
                          secondaryTypographyProps={{ 
                            color: userData.phone !== "-" ? "text.primary" : "text.secondary",
                            fontWeight: userData.phone !== "-" ? 500 : 400
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                  
                  {/* Dirección */}
                  <ListItem disablePadding divider>
                    <ListItemButton onClick={() => {
                      if (editMode) return;
                      if (userData.address === "-") {
                        alert(lang === "en" 
                          ? "Add your address in edit mode" 
                          : "Agrega tu dirección en modo edición"
                        );
                      } else {
                        alert(`${t.addresses}: ${userData.address}`);
                      }
                    }}>
                      <ListItemIcon>
                        <HomeIcon color={userData.address !== "-" ? "primary" : "action"} />
                      </ListItemIcon>
                      
                      {editMode ? (
                        <TextField
                          fullWidth
                          label={t.addresses}
                          value={editData.direccion}
                          onChange={(e) => setEditData({...editData, direccion: e.target.value})}
                          size="small"
                          multiline
                          rows={2}
                        />
                      ) : (
                        <ListItemText 
                          primary={t.addresses} 
                          secondary={userData.address} 
                          secondaryTypographyProps={{ 
                            color: userData.address !== "-" ? "text.primary" : "text.secondary",
                            fontWeight: userData.address !== "-" ? 500 : 400
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                  
                  {/* Pedidos */}
                  <ListItem disablePadding divider>
                    <ListItemButton onClick={() => {
                      if (editMode) return;
                      if (orders.length === 0) {
                        alert(lang === "en" 
                          ? "You don't have any orders yet" 
                          : "No tienes pedidos aún"
                        );
                      } else {
                        alert(lang === "en" 
                          ? `You have ${orders.length} orders` 
                          : `Tienes ${orders.length} pedidos`
                        );
                      }
                    }}>
                      <ListItemIcon>
                        <ShoppingBagIcon color={orders.length > 0 ? "primary" : "action"} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={t.myOrders} 
                        secondary={
                          orders.length > 0 
                            ? `${orders.length} ${t.totalOrders}` 
                            : lang === "en" ? "No orders yet" : "Sin pedidos"
                        }
                        secondaryTypographyProps={{ 
                          color: orders.length > 0 ? "text.primary" : "text.secondary"
                        }}
                      />
                    </ListItemButton>
                  </ListItem>

                  
                </List>
              </Paper>

              {/* Control de cuenta */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  {lang === "en" ? "Account Control" : "Control de Cuenta"}
                </Typography>
                
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="error" 
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    disabled={editMode}
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