// App.tsx
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// ... tus imports de Login, Register, Auth, etc ...
import Login from "./auth/Login";
import Register from "./auth/Register";
import { useAuth } from "./auth/AuthProvider";
import { logout } from "./auth/auth";

import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import CheckoutPage from "./pages/CheckoutPage"; 

type Lang = "es" | "en";

// 1. Definimos qué props va a recibir App
type AppProps = {
  toggleTheme: () => void; // La función interruptor
  mode: "light" | "dark";  // El estado actual
};

// ... Tus componentes LoginPage y RegisterPage se quedan igual ...
function LoginPage({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const { user } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (user) nav("/", { replace: true }); }, [user, nav]);
function LoginPage({ lang, setLang }: any) {
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (user) nav("/", { replace: true });
  }, [user, nav]);

  return <Login goToRegister={() => nav("/register")} lang={lang} setLang={setLang} />;
}

function RegisterPage({ lang, setLang }: any) {
  const { user } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (user) nav("/", { replace: true }); }, [user, nav]);

  useEffect(() => {
    if (user) nav("/", { replace: true });
  }, [user, nav]);

  return <Register goToLogin={() => nav("/login")} lang={lang} setLang={setLang} />;
}

// 2. Modificamos la definición de la función App para recibir las props
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
        <Route
          // 3. AQUÍ ES CLAVE: Le pasamos 'toggleTheme' y 'mode' al MainLayout
          // para que él a su vez se lo pase al TopNav.
          element={
            <MainLayout 
              user={user} 
              lang={lang} 
              setLang={setLang} 
              onLogout={handleLogout} 
              toggleTheme={toggleTheme} 
              mode={mode}
        {/* APP NORMAL */}
        <Route
          element={
            <MainLayout
              user={user}
              lang={lang}
              setLang={setLang}
              onLogout={handleLogout}
            />
          }
        >
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/products" element={<Browse mode="all" lang={lang} />} />
          <Route path="/search" element={<Browse mode="search" lang={lang} />} />
          <Route path="/category/:category" element={<Browse mode="category" lang={lang} />} />

          
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* AUTH */}
        <Route path="/login" element={<LoginPage lang={lang} setLang={setLang} />} />
        <Route path="/register" element={<RegisterPage lang={lang} setLang={setLang} />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}