import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

type Props = {
  user: unknown; // o el tipo real de tu user (Firebase User)
  lang: "es" | "en";
  setLang: (l: "es" | "en") => void;
  onLoginClick: () => void;
  onLogout: () => void;
};

export default function Home({ user, lang, setLang, onLoginClick, onLogout }: Props) {
  const isLogged = Boolean(user);

  return (
    <Box>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ display: "flex", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            SuperMercado
          </Typography>

          <Box sx={{ flex: 1 }} />

          {/* Idioma (mínimo) */}
          <ToggleButtonGroup
            exclusive
            value={lang}
            onChange={(_, v) => v && setLang(v)}
            size="small"
            sx={{ bgcolor: "rgba(255,255,255,0.12)", borderRadius: 999 }}
          >
            <ToggleButton value="en">EN</ToggleButton>
            <ToggleButton value="es">ES</ToggleButton>
          </ToggleButtonGroup>

          {/* Auth actions */}
          {!isLogged ? (
            <Button variant="contained" color="secondary" onClick={onLoginClick}>
              Sign in
            </Button>
          ) : (
            <Button variant="outlined" color="inherit" onClick={onLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Aquí va tu UI Walmart */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Home (público)
        </Typography>

        <Typography sx={{ opacity: 0.8 }}>
          Aquí van: carrusel grande + filas por categoría.
        </Typography>
      </Box>
    </Box>
  );
}
