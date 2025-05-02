// File: Home.jsx
import { motion } from "framer-motion";
import { Card } from 'primereact/card';
import React from "react";
import CountUp from 'react-countup';
import { useNavigate } from "react-router-dom";
import illustration from './assets/home-illustration.png';
import FaqSection from "./components/FaqSection";
import HowItWorks from "./components/HowItWorks";
import ProfsSection from "./components/ProfsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import "./Home.css";


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
      {/* SECTION 1 — Hero améliorée */}
      <section className="hero-section">
        <div className="animated-bg"></div>
        <div className="hero-text">
          <h1><span>Curio</span>, la plateforme intelligente</h1>
          <p>
            Apprenez l’informatique de façon rapide, personnalisée et guidée par l’IA.
            Rejoignez une nouvelle génération d’apprentissage moderne, efficace et sur mesure.
          </p>
          <motion.button
            className="start-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
          >
            Commencer maintenant
          </motion.button>
        </div>
 
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={illustration} alt="Illustration Curio" className="hero-img" />

        </motion.div>

      </section>
      {/* SECTION 4 — Statistiques et Fonctionnalités */}
      <div className="two-column-section">
        
<div className="stats-container">
  <Card className="stat-card">
    <h2>
      <CountUp end={5000} duration={2} suffix="+" />
    </h2>
    <p>Étudiants actifs</p>
  </Card>
  <Card className="stat-card">
    <h2>
      <CountUp end={120} duration={2} suffix="+" />
    </h2>
    <p>Modules disponibles</p>
  </Card>
  <Card className="stat-card">
    <h2>
      <CountUp end={95} duration={2} suffix="%" />
    </h2>
    <p>Taux de satisfaction</p>
  </Card>
</div>

<div className="announcement-banner">
  <marquee behavior="scroll" direction="left" scrollamount="6">
    🔔 15 nouveaux étudiants inscrits aujourd’hui ! &nbsp;&nbsp;&nbsp;
    📢 Nouveaux modules L2 disponibles ! &nbsp;&nbsp;&nbsp;
    🧠 Testez notre nouveau chatbot IA !
  </marquee>
</div>
      {/* SECTION 2 — Pourquoi Curio */}
      <section className="why-curio-section">
        <h2>Pourquoi choisir Curio ?</h2>
        <div className="why-grid">
          <div className="why-card">🔒 Sécurité garantie</div>
          <div className="why-card">🚀 Apprentissage rapide</div>
          <div className="why-card">🎯 Objectifs personnalisés</div>
          <div className="why-card">👨‍🏫 Profs experts</div>
        </div>
      </section>

      {/* SECTION 3 — Étapes */}
      <section className="steps-section">
        <h2>Comment ça marche ?</h2>
        <div className="steps-grid">
          <div className="step-card">
            <h3>1. Créez un compte</h3>
            <p>Inscrivez-vous gratuitement avec votre spécialité.</p>
          </div>
          <div className="step-card">
            <h3>2. Choisissez votre niveau</h3>
            <p>Accédez aux modules selon votre programme universitaire.</p>
          </div>
          <div className="step-card">
            <h3>3. Apprenez avec l’IA</h3>
            <p>Découvrez du contenu intelligent, des quiz, et bien plus.</p>
          </div>
        </div>
      </section>

        <section className="features-section">
          <h2 className="section-title">Fonctionnalités phares</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>IA Personnalisée</h3>
              <p>Notre IA adapte le contenu selon votre rythme.</p>
            </div>
            <div className="feature-card">
              <h3>Quiz Intelligents</h3>
              <p>Quiz automatiques, générés et corrigés instantanément.</p>
            </div>
            <div className="feature-card">
              <h3>Contenu Multimédia</h3>
              <p>Cours en vidéo, PDF, interactifs et plus encore.</p>
            </div>
            <div className="feature-card">
              <h3>Profs Experts</h3>
              <p>Enseignants qualifiés disponibles à tout moment.</p>
            </div>
          </div>
        </section>
      </div>


      <TestimonialsSection />
      <FaqSection />
      <ProfsSection />
      <HowItWorks />

      {/* SECTION finale CTA */}
      <section className="cta-section">
        <h2>Prêt à transformer votre apprentissage ?</h2>
        <p>Inscrivez-vous gratuitement et découvrez une nouvelle manière d’apprendre l’informatique avec l’IA.</p>
        <motion.button
          className="start-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
        >
          Rejoindre Curio
        </motion.button>
      </section>

      <footer className="site-footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Curio. Tous droits réservés.</p>
          <p>Fait avec ❤️ pour l’éducation des étudiants.</p>
        </div>
      </footer>
    </motion.div>
  );
};

export default Home;
