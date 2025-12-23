import { useState } from "react";
import { register } from "./auth";
import { languages } from "../languages/languages";

interface Props {
  goToLogin: () => void;
  lang: "es" | "en";
  setLang: (lang: "es" | "en") => void;
}

export default function Register({ goToLogin, lang, setLang }: Props) {
  // Estados para los inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Textos según idioma
  const t = languages[lang];

  const handleRegister = async () => {
    try {
      await register(email, password);
      alert(t.success);
      goToLogin();
    } catch (error) {
      alert(t.error);
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* BOTÓN DE IDIOMA */}
        <button
          className="link"
          onClick={() => setLang(lang === "es" ? "en" : "es")}
        >
          {lang === "es" ? "English 🇺🇸" : "Español 🇪🇸"}
        </button>

        <h2>{t.registerTitle}</h2>

        <input
          placeholder={t.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder={t.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="primary" onClick={handleRegister}>
          {t.registerBtn}
        </button>

        <hr />

        <button className="link" onClick={goToLogin}>
          {t.goToLogin}
        </button>

      </div>
    </div>
  );
}
