import { motion } from "framer-motion";
import { Card } from 'primereact/card';
import React from "react";
import { useNavigate } from "react-router-dom";
import illustration from './assets/home-illustration.png';
import studentImg from "./assets/Online learning-bro.svg";
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

      {/* SECTION 2 — Image + Texte */}
      <section className="info-section">
        <div className="info-image">
          <img src={studentImg} alt="Prof et étudiant" />
        </div>

        <div className="info-text">
          <h2>Une plateforme intelligente</h2>
          <p>
            Apprenez mieux, plus vite et efficacement avec Curio.
            Nos outils alimentés par l'IA vous accompagnent tout au long de votre parcours universitaire.
          </p>
          <button className="start-btn">Commencer maintenant</button>
        </div>
      </section>

      {/* SECTION 3 — Statistiques et Fonctionnalités côte à côte */}
      <div className="two-column-section">
        <div className="stats-container">
          <Card className="stat-card">
            <h2>+5000</h2>
            <p>Étudiants actifs</p>
          </Card>
          <Card className="stat-card">
            <h2>+120</h2>
            <p>Modules disponibles</p>
          </Card>
          <Card className="stat-card">
            <h2>95%</h2>
            <p>Taux de satisfaction</p>
          </Card>
        </div>

        <section className="features-section">
          <h2 className="section-title">Fonctionnalités phares</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>IA Personnalisée</h3>
              <p>Notre IA vous accompagne pour adapter le contenu selon votre niveau et votre rythme.</p>
            </div>
            <div className="feature-card">
              <h3>Quiz Intelligents</h3>
              <p>Testez vos connaissances avec des quiz adaptés, corrigés automatiquement.</p>
            </div>
            <div className="feature-card">
              <h3>Contenu Multimédia</h3>
              <p>Accédez à des cours en vidéo, PDF, et autres ressources interactives.</p>
            </div>
            <div className="feature-card">
              <h3>Profs Experts</h3>
              <p>Des enseignants qualifiés disponibles pour vous guider et répondre à vos questions.</p>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 4 — Témoignages */}
      <TestimonialsSection />
      <FaqSection />
      <ProfsSection />
      <HowItWorks />

    
{/* SECTION 5 — Appel à l’action final */}
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