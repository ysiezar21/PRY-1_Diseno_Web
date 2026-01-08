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

  const [showError, setShowError] = useState(false);

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      setShowError(true);
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

        {showError && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "24px",
                borderRadius: "8px",
                textAlign: "center",
                width: "300px",
              }}
            >
              <h3>Error</h3>
              <p>{t.auth.loginError}</p>
              <button
                className="primary"
                onClick={() => setShowError(false)}
              >
                {t.checkout.accept}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
