// --- START OF FILE src/App.tsx ---

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Login from "./auth/Login";
import Register from "./auth/Register";
import { useAuth } from "./auth/AuthProvider";
import { logout } from "./auth/auth";

import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import CheckoutPage from "./pages/CheckoutPage"; 

type Lang = "es" | "en";

// Definimos las props del tema
type AppProps = {
  toggleTheme: () => void;
  mode: "light" | "dark";
};

// Componente auxiliar limpio para Login
function LoginPage({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (user) nav("/", { replace: true });
  }, [user, nav]);

  return <Login goToRegister={() => nav("/register")} lang={lang} setLang={setLang} />;
}

// Componente auxiliar limpio para Register
function RegisterPage({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (user) nav("/", { replace: true });
  }, [user, nav]);

  return <Register goToLogin={() => nav("/login")} lang={lang} setLang={setLang} />;
}

// Componente Principal arreglado
export default function App({ toggleTheme, mode }: AppProps) {
  const { user } = useAuth();
  const [lang, setLang] = useState<Lang>("en");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Principal que envuelve las páginas de la tienda */}
        <Route
          element={
            <MainLayout 
              user={user} 
              lang={lang} 
              setLang={setLang} 
              onLogout={handleLogout}
              // Pasamos las props del tema correctamente
              toggleTheme={toggleTheme}
              mode={mode}
            />
          }
        >
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/products" element={<Browse mode="all" lang={lang} />} />
          <Route path="/search" element={<Browse mode="search" lang={lang} />} />
          <Route path="/category/:category" element={<Browse mode="category" lang={lang} />} />
          
          {/* Tu ruta de Checkout recuperada */}
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* Pantallas de Autenticación */}
        <Route path="/login" element={<LoginPage lang={lang} setLang={setLang} />} />
        <Route path="/register" element={<RegisterPage lang={lang} setLang={setLang} />} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}