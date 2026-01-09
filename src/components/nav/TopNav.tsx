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
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { languages } from "../../languages/languages";

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
  const [q, setQ] = React.useState("");
  const navigate = useNavigate();

  const t = languages[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(q.trim());
  };

  const manejarClickCuenta = () => {
    if (isLogged) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "primary.main" }}>
      <Toolbar sx={{ gap: 2 }}>
        <IconButton color="inherit" onClick={onOpenDrawer} edge="start">
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          onClick={() => navigate("/")}
          sx={{
            fontWeight: 900,
            whiteSpace: "nowrap",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.85,
            },
          }}
        >
          {t.topNav.storeName}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, display: "flex" }}>
          <Paper
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              px: 1,
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <InputBase
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.topNav.searchPlaceholder}
              sx={{ flex: 1, px: 1 }}
            />
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

        <IconButton sx={{ ml: 1 }} onClick={onToggleTheme} color="inherit">
          {currentMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

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

        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <Tooltip title={t.topNav.myAccount}>
            <IconButton color="inherit" onClick={manejarClickCuenta}>
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t.topNav.orders}>
            <IconButton color="inherit">
              <ReceiptLongIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={t.topNav.cart}>
            <IconButton color="inherit" onClick={onOpenCart}>
              <Badge badgeContent={cartCount} color="warning">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {!isLogged ? (
            <Button
              onClick={onLoginClick}
              variant="contained"
              sx={{ ml: 1, bgcolor: "#ffc220", color: "#000", fontWeight: 800 }}
            >
              {t.topNav.signIn}
            </Button>
          ) : (
            <Button
              onClick={onLogout}
              variant="outlined"
              sx={{ ml: 1, borderColor: "rgba(255,255,255,0.7)", color: "#fff" }}
            >
              {t.topNav.logout}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
