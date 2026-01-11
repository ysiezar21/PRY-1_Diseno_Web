// src/auth/Register.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { register } from "./auth";
import { createUserProfile } from "../services/userService";


interface Props {
  goToLogin: () => void;
  lang: "es" | "en";
  setLang: (lang: "es" | "en") => void;
}

export default function Register({ goToLogin, lang, setLang }: Props) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    console.log("🔍 Iniciando registro...");
    
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);
      
      console.log("Llamando a register()...");
      const userCredential = await register(email, password);
      const user = userCredential.user;
      console.log("Authentication OK. UID:", user.uid);
      
      console.log("Creando perfil en Firestore...");
      await createUserProfile(
        user.uid,
        email,
        {
          nombre: nombre,
          telefono: "-",
          direccion: "-"
        }
      );
      
      console.log("¡Registro completo! Redirigiendo...");
      navigate(from, { replace: true });
      
    } catch (error: any) {
      console.error("❌ ERROR:", error);
      
      let errorMessage = "Error al registrar";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este email ya está registrado";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "La contraseña debe tener al menos 6 caracteres";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido";
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button
          className="link"
          onClick={() => setLang(lang === "es" ? "en" : "es")}
          disabled={loading}
        >
          {lang === "es" ? "Switch to English" : "Cambiar a Español"}
        </button>

        <h2>{lang === "es" ? "Registro" : "Register"}</h2>

        <input
          placeholder={lang === "es" ? "Nombre completo *" : "Full name *"}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={loading}
        />

        <input
          placeholder={lang === "es" ? "Email *" : "Email *"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          type="email"
        />

        <input
          type="password"
          placeholder={lang === "es" ? "Contraseña * (mínimo 6 caracteres)" : "Password * (minimum 6 characters)"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button 
          className="primary" 
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? (lang === "es" ? "Creando cuenta..." : "Creating account...") : (lang === "es" ? "Registrarse" : "Register")}
        </button>

        <hr />

        <button className="link" onClick={goToLogin} disabled={loading}>
          {lang === "es" ? "¿Ya tienes cuenta? Inicia sesión" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}