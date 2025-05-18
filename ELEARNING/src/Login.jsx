import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "./AuthForm.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔄 Nettoyage des anciennes sessions
  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔐 Authentification
      const res = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: formData.username,
        password: formData.password,
      });

      const token = res.data.access;
      localStorage.setItem("accessToken", token);

      // 👤 Récupération des infos utilisateur
      const userRes = await axios.get("http://127.0.0.1:8000/api/users/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = userRes.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userType", user.user_type); // <-- nécessaire pour les routes protégées

      // 🚀 Redirection selon le rôle
      if (user.user_type === "professor") {
        navigate("/teacher");
      } else if (user.user_type === "student") {
        navigate("/student");
      } else {
        alert("Type d'utilisateur inconnu.");
      }
    } catch (error) {
      console.error("❌ Erreur :", error);
      const msg = error.response?.data?.detail || "Erreur de connexion.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        className="loading-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="spinner" />
        <p>Connexion en cours...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="auth-left">
        <h1>Content de te revoir !</h1>
        <p>Pas encore de compte ?</p>
        <button
          className="auth-button-outlined"
          onClick={() => navigate("/register")}
        >
          S'inscrire
        </button>
      </div>

      <div className="auth-right">
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <a href="#" className="forgot">
            Mot de passe oublié ?
          </a>
          <button className="auth-button-filled" type="submit">
            Connexion
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
