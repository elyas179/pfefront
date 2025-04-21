import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [role, setRole] = useState("etudiant");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        {
          username: formData.username,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
     

      const token = response.data.access;
      localStorage.setItem("accessToken", token);

      if (role === "etudiant") {
        navigate("/student");
      } else {
        alert("Connexion en tant que professeur");
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
      alert("Échec de connexion. Vérifie tes identifiants !");
    }
  };

  return (
    <motion.div
      className="auth-container"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="auth-left">
        <h1>Hello, Friend!</h1>
        <p>Connecte-toi avec ton compte</p>
        <button className="auth-button-outlined" onClick={() => navigate('/register')}>SIGN UP</button>
      </div>

      <div className="auth-right">
        <div className="social-icons">
          <i className="pi pi-facebook" style={{ color: "#3b5998" }}></i>
          <i className="pi pi-google" style={{ color: "#db4437" }}></i>
          <i className="pi pi-linkedin" style={{ color: "#0e76a8" }}></i>
        </div>

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

          <div className="role-select">
            <label>
              <input
                type="radio"
                name="role"
                value="etudiant"
                checked={role === "etudiant"}
                onChange={(e) => setRole(e.target.value)}
              />
              Étudiant
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="professeur"
                checked={role === "professeur"}
                onChange={(e) => setRole(e.target.value)}
              />
              Professeur
            </label>
          </div>

          <a href="#" className="forgot">Mot de passe oublié ?</a>
          <button className="auth-button-filled" type="submit">LOGIN</button>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
