import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { register } from "./auth";
import { languages } from "../languages/languages";

interface Props {
  goToLogin: () => void;
  lang: "es" | "en";
  setLang: (lang: "es" | "en") => void;
}

export default function Register({ goToLogin, lang, setLang }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || "/";

  const t = languages[lang];

  const handleRegister = async () => {
    try {
      await register(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      alert(t.auth.registerError);
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <button
          className="link"
          onClick={() => setLang(lang === "es" ? "en" : "es")}
        >
          {lang === "es"
            ? t.auth.switchToEnglish
            : t.auth.switchToSpanish}
        </button>

        <h2>{t.auth.registerTitle}</h2>

        <input
          placeholder={t.auth.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder={t.auth.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="primary" onClick={handleRegister}>
          {t.auth.registerBtn}
        </button>

        <hr />

        <button className="link" onClick={goToLogin}>
          {t.auth.goToLogin}
        </button>

      </div>
    </div>
  );
}
