import { useEffect, useState } from "react";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { useAuth } from "./auth/AuthProvider";
import { logout } from "./auth/auth";
import Home from "./pages/Home"; // falta por crear

export default function App() {
  const { user } = useAuth();

  // ahora tiramos directamente la pantalla principal
  const [view, setView] = useState<"home" | "login" | "register">("home");
  // empezamos con ingles
  const [lang, setLang] = useState<"es" | "en">("en");


// Si el usuario se loguea, volvemos a home automáticamente
  useEffect(() => {
    if (user) setView("home");
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      // home púnlico
      setView("home");
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  if (view === "login") {
    return (
      <Login
        goToRegister={() => setView("register")}
        lang={lang}
        setLang={setLang}
        // si tu Login NO tiene esta prop, no pasa nada: ver nota abajo
        //goHome={() => setView("home")}
      />
    );
  }

  if (view === "register") {
    return (
      <Register
        goToLogin={() => setView("login")}
        lang={lang}
        setLang={setLang}
        // igual, opcional
        //goHome={() => setView("home")}
      />
    );
  }

  // HOME siempre visible (público o logueado)
  return (
    <Home
      user={user}
      lang={lang}
      setLang={setLang}
      onLoginClick={() => setView("login")}
      onLogout={handleLogout}
    />
  );
}
