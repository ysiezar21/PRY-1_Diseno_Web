import { useState } from "react";
import Login from "./auth/Login";
import Register from "./auth/Register";
import { useAuth } from "./auth/AuthProvider";
import { logout } from "./auth/auth";
import { languages } from "./languages/languages";
import Catalog from "./products/Catalog";


export default function App() {
  const { user } = useAuth();

  const [view, setView] = useState<"login" | "register">("login");
  const [lang, setLang] = useState<"es" | "en">("es");

  const t = languages[lang];

  if (user) {
  return (
    
    <>
    <button onClick={logout}>Cerrar sesión</button>

      <Catalog />
    </>
  );
}


  return (
    <>
      {view === "login" && (
        <Login
          goToRegister={() => setView("register")}
          lang={lang}
          setLang={setLang}
        />
      )}

      {view === "register" && (
        <Register
          goToLogin={() => setView("login")}
          lang={lang}
          setLang={setLang}
        />
      )}
    </>
  );
}
