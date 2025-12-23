import { useState } from "react";
import { login } from "./auth";
import { languages } from "../languages/languages";

interface Props {
  goToRegister: () => void;
  lang: "es" | "en";
  setLang: (lang: "es" | "en") => void;
}

export default function Login({ goToRegister, lang, setLang }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const t = languages[lang];

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <button
          className="link"
          onClick={() => setLang(lang === "es" ? "en" : "es")}
        >
          {lang === "es" ? "English 🇺🇸" : "Español 🇪🇸"}
        </button>

        <h2>{t.loginTitle}</h2>

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

        <button className="primary" onClick={handleLogin}>
          {t.loginBtn}
        </button>

        <hr />

        <button className="link" onClick={goToRegister}>
          {t.goToRegister}
        </button>
      </div>
    </div>
  );
}
