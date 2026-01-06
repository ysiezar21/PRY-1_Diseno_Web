import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App";
import { AuthProvider } from "./auth/AuthProvider";
import { CartProvider } from "./cart/CartProvider";
import { claroTema, oscuroTema } from "./theme";
import "./styles/auth.css";

function Root() {
  const [mode, setMode] = React.useState<"light" | "dark">("light");

  const toggleTheme = () => {
    setMode((m) => (m === "light" ? "dark" : "light"));
  };

  const theme = mode === "light" ? claroTema : oscuroTema;

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
            <App toggleTheme={toggleTheme} mode={mode} />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
