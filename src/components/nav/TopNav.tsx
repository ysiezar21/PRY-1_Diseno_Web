import * as React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Paper,
  InputBase,
  Badge,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Button,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Luna
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sol

// Definición de tipos para las propiedades (Props)
type Props = {
  isLogged: boolean;
  cartCount: number;
  lang: "es" | "en";
  onLangChange: (l: "es" | "en") => void;

  onOpenDrawer: () => void;
  onOpenCart: () => void;
  onSearchSubmit: (q: string) => void;

  onLoginClick: () => void;
  onLogout: () => void;

  onToggleTheme: () => void;
  currentMode: "light" | "dark";
};

export default function TopNav({
  isLogged,
  cartCount,
  lang,
  onLangChange,
  onOpenDrawer,
  onOpenCart,
  onSearchSubmit,
  onLoginClick,
  onLogout,
  onToggleTheme,
  currentMode,
}: Props) {
  // Estado local para almacenar el texto de búsqueda
  const [q, setQ] = React.useState("");

  // Manejador del envío del formulario de búsqueda
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(q.trim());
  };

  return (
    // Barra de navegación superior (sticky = se queda fija al hacer scroll)
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "primary.main" }}>
      <Toolbar sx={{ gap: 2 }}>
        {/* Botón de menú hamburguesa para abrir el panel lateral */}
        <IconButton color="inherit" onClick={onOpenDrawer} edge="start">
          <MenuIcon />
        </IconButton>

        {/* Nombre de tienda*/}
        <Typography variant="h6" sx={{ fontWeight: 900, whiteSpace: "nowrap" }}>
          SuperMercado
        </Typography>

        {/* Contenedor de la barra de búsqueda */}
        <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, display: "flex" }}>
          <Paper
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              px: 1,
              borderRadius: 999, // Bordes totalmente redondeados
              overflow: "hidden",
            }}
          >
            {/* Input de texto para buscar */}
            <InputBase
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={lang === "en" ? "What are you looking for?" : "¿Qué estás buscando?"}
              sx={{ flex: 1, px: 1 }}
            />
            {/* Botón lupa para enviar búsqueda */}
            <IconButton
              type="submit"
              sx={{
                bgcolor: "#ffc220",
                borderRadius: 999,
                mx: 0.5,
                "&:hover": { bgcolor: "#ffcf4a" },
              }}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>

        <IconButton sx={{ ml: 1}} onClick={onToggleTheme} color="inherit">
          {currentMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {/* Selector de idioma (Español / Inglés) TODO */}
        <ToggleButtonGroup
          exclusive
          value={lang}
          onChange={(_, v) => v && onLangChange(v)}
          size="small"
          sx={{ bgcolor: "rgba(255,255,255,0.14)", borderRadius: 999 }}
        >
          <ToggleButton value="en" sx={{ color: "#fff" }}>
            EN
          </ToggleButton>
          <ToggleButton value="es" sx={{ color: "#fff" }}>
            ES
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Grupo de iconos de usuario (Listas, Cuenta, Pedidos, Carrito) */}
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <Tooltip title={lang === "en" ? "My lists" : "Mis listas"}>
            <IconButton color="inherit">
              <FavoriteBorderIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={lang === "en" ? "My account" : "Mi cuenta"}>
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={lang === "en" ? "Orders" : "Pedidos"}>
            <IconButton color="inherit">
              <ReceiptLongIcon />
            </IconButton>
          </Tooltip>

          {/* Carrito de compras con contador (Badge) */}
          <Tooltip title={lang === "en" ? "Cart" : "Carrito"}>
            <IconButton color="inherit" onClick={onOpenCart}>
              <Badge badgeContent={cartCount} color="warning">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Botón condicional: Login si no está logueado, Logout si lo está */}
          {!isLogged ? (
            <Button
              onClick={onLoginClick}
              variant="contained"
              sx={{ ml: 1, bgcolor: "#ffc220", color: "#000", fontWeight: 800 }}
            >
              {lang === "en" ? "Sign in" : "Iniciar sesión"}
            </Button>
          ) : (
            <Button
              onClick={onLogout}
              variant="outlined"
              sx={{ ml: 1, borderColor: "rgba(255,255,255,0.7)", color: "#fff" }}
            >
              {lang === "en" ? "Logout" : "Salir"}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}