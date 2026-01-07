import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from || "/";

  const t = languages[lang];

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      alert(t.auth.loginError);
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

        <h2>{t.auth.loginTitle}</h2>

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

        <button className="primary" onClick={handleLogin}>
          {t.auth.loginBtn}
        </button>

        <hr />

        <button className="link" onClick={goToRegister}>
          {t.auth.goToRegister}
        </button>
      </div>
    </div>
  );
}
