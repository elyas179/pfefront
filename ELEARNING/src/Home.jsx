import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Home.css";
import studentImg from "./assets/Online learning-bro.svg";

const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/register", { replace: true });
  };

  return (
    <motion.div
      className="home-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="home-left">
        <h1 className="gradient-title">
          Bienvenue sur Curio Learning Platform
        </h1>
        <p>
          Une plateforme intelligente pour apprendre mieux, plus vite et efficacement.
          Nos outils propulsés par l'IA vous accompagnent dans votre parcours universitaire.
        </p>
        <motion.button
          className="cta-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
        >
          Commencer maintenant
        </motion.button>
      </div>
      <div className="home-right">
        <img src={studentImg} alt="Étudiant en ligne" className="student-image" />
      </div>
    </motion.div>
  );
};

export default Home;
