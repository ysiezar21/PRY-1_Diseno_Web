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

  const [showError, setShowError] = useState(false);

  const handleRegister = async () => {
    try {
      await register(email, password);
      navigate(from, { replace: true });
    } catch (error) {
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
              <p>{t.auth.registerError}</p>
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
