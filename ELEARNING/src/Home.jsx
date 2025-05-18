import { motion } from "framer-motion";
import { Card } from 'primereact/card';
import React, { useState, useEffect } from "react";
import CountUp from 'react-countup';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import illustration from './assets/home-illustration.png';
import FaqSection from "./components/FaqSection";
import HowItWorks from "./components/HowItWorks";
import ProfsSection from "./components/ProfsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [results, setResults] = useState(null);
  const [accessRequested, setAccessRequested] = useState({});

  const handleClick = () => {
    navigate("/register", { replace: true });
  };

  useEffect(() => {
    const storedAccess = localStorage.getItem("accessRequested");
    if (storedAccess) setAccessRequested(JSON.parse(storedAccess));
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
  
    setLoadingSearch(true);
  
    try {
      const token = localStorage.getItem("accessToken");
  
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {}; // ✅ Ne rien envoyer si pas de token
  
      const response = await axios.get(
        `http://127.0.0.1:8000/search/?q=${query}`,
        { headers }
      );
  
      setResults(response.data);
    } catch (err) {
      console.error("Erreur recherche:", err);
    } finally {
      setLoadingSearch(false);
    }
  };
  

  const handleRequestAccess = async (resourceId) => {
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`http://127.0.0.1:8000/api/courses/resources/request/${resourceId}/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const updated = { ...accessRequested, [resourceId]: true };
      setAccessRequested(updated);
      localStorage.setItem("accessRequested", JSON.stringify(updated));
    } catch (err) {
      console.error("Erreur lors de la demande d'accès:", err);
    }
  };

  const renderResources = (resources) =>
    resources.map((res) => (
      <div key={res.id} className="resource-card animated">
        <div className="resource-header">
          <a href={res.link} target="_blank" rel="noreferrer" className="resource-link">
            🔗 {res.name}
          </a>
          <span className="type-tag">{res.resource_type}</span>
        </div>
        <div className="resource-meta">
          <span>👤 {res.owner_name}</span>
          <span>🕒 {new Date(res.created_at).toLocaleDateString()}</span>
          <span className={`access-tag ${res.access_type}`}>
            {res.access_type === "public" ? (
              "🔓 Public"
            ) : res.access_approved ? (
              "🔒 Privé"
            ) : accessRequested[res.id] ? (
              <span className="pending">🔒 Privé (en attente)</span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRequestAccess(res.id);
                }}
                className="request-access-btn"
              >
                Demander l'accès
              </button>
            )}
          </span>
        </div>
      </div>
    ));

  const renderResults = () => {
    if (!results || Object.values(results).every((arr) => Array.isArray(arr) && arr.length === 0)) {
      return <div className="no-results">❌ Aucun résultat trouvé.</div>;
    }

    return (
      <div className="search-results-container">
        <h2 className="results-title">
          🔍 Résultats de recherche pour : <span className="query-highlight">{query}</span>
        </h2>

        <div className="results-box">
          {results.specialities?.map((spec) => (
            <details key={spec.id} className="level-drop">
              <summary>🧠 Spécialité : {spec.name}</summary>
              {spec.levels.map((lvl) => (
                <details key={lvl.id} className="level-drop">
                  <summary>📘 Niveau : {lvl.name}</summary>
                  {lvl.module_set.map((mod) => (
                    <details key={mod.id} className="level-drop">
                      <summary>📗 Module : {mod.name}</summary>
                      {mod.chapters.map((chap) => (
                        <details key={chap.id} className="level-drop">
                          <summary>📙 Chapitre : {chap.name}</summary>
                          {renderResources(chap.all_resources)}
                        </details>
                      ))}
                    </details>
                  ))}
                </details>
              ))}
            </details>
          ))}

          {results.levels?.map((lvl) => (
            <details key={lvl.id} className="level-drop">
              <summary>📘 Niveau : {lvl.name}</summary>
              {lvl.module_set.map((mod) => (
                <details key={mod.id} className="level-drop">
                  <summary>📗 Module : {mod.name}</summary>
                  {mod.chapters.map((chap) => (
                    <details key={chap.id} className="level-drop">
                      <summary>📙 Chapitre : {chap.name}</summary>
                      {renderResources(chap.all_resources)}
                    </details>
                  ))}
                </details>
              ))}
            </details>
          ))}

          {results.modules?.map((mod) => (
            <details key={mod.id} className="level-drop">
              <summary>📗 Module : {mod.name}</summary>
              {mod.chapters.map((chap) => (
                <details key={chap.id} className="level-drop">
                  <summary>📙 Chapitre : {chap.name}</summary>
                  {renderResources(chap.all_resources)}
                </details>
              ))}
            </details>
          ))}

          {results.chapters?.map((chap) => (
            <details key={chap.id} className="level-drop">
              <summary>📙 Chapitre : {chap.name}</summary>
              {renderResources(chap.all_resources)}
            </details>
          ))}

          {results.resources?.map((res) => renderResources([res]))}
        </div>
      </div>
    );
  };

  return (
    <motion.div className="home-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
      <section className="hero-section">
        <div className="animated-bg"></div>
        <div className="hero-text">
          <h1><span>Curio</span>, la plateforme intelligente</h1>
          <p>Apprenez l’informatique de façon rapide, personnalisée et guidée par l’IA.</p>
          <motion.button className="start-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleClick}>
            Commencer maintenant
          </motion.button>
        </div>
        <motion.div className="hero-image" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <img src={illustration} alt="Illustration Curio" className="hero-img" />
        </motion.div>
      </section>

      <div className="two-column-section">
        <div className="stats-container">
          <Card className="stat-card"><h2><CountUp end={5000} duration={2} suffix="+" /></h2><p>Étudiants actifs</p></Card>
          <Card className="stat-card"><h2><CountUp end={120} duration={2} suffix="+" /></h2><p>Modules disponibles</p></Card>
          <Card className="stat-card"><h2><CountUp end={95} duration={2} suffix="%" /></h2><p>Taux de satisfaction</p></Card>
        </div>

        <div className="announcement-banner">
          <marquee behavior="scroll" direction="left" scrollamount="6">
            🔔 15 nouveaux étudiants inscrits aujourd’hui ! &nbsp;&nbsp;&nbsp;
            📢 Nouveaux modules L2 disponibles ! &nbsp;&nbsp;&nbsp;
            🧠 Testez notre nouveau chatbot IA !
          </marquee>
        </div>

        {/* 🆕 Search UI animée */}
        <div className="search-intro-container">
          <motion.h2 className="search-title" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            👋 Bienvenue visiteur ! Que souhaitez-vous rechercher ?
          </motion.h2>
          <motion.p className="search-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            (cours, module, ressource, chapitre, spécialité...)
          </motion.p>
          <motion.div className="home-search-bar" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="🔍 Tapez votre recherche ici..."
              className="home-search-input search-animated-input"
            />
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="home-search-button" onClick={handleSearch}>
              Rechercher
            </motion.button>
          </motion.div>
          {loadingSearch && <div className="search-loading-screen">⏳ Chargement des résultats...</div>}
        </div>

        {results && renderResults()}

        {/* ... autres sections ... */}
        <section className="why-curio-section">
          <h2>Pourquoi choisir Curio ?</h2>
          <div className="why-grid">
            <div className="why-card">🔒 Sécurité garantie</div>
            <div className="why-card">🚀 Apprentissage rapide</div>
            <div className="why-card">🎯 Objectifs personnalisés</div>
            <div className="why-card">👨‍🏫 Profs experts</div>
          </div>
        </section>

        <section className="steps-section">
          <h2>Comment ça marche ?</h2>
          <div className="steps-grid">
            <div className="step-card"><h3>1. Créez un compte</h3><p>Inscrivez-vous gratuitement avec votre spécialité.</p></div>
            <div className="step-card"><h3>2. Choisissez votre niveau</h3><p>Accédez aux modules selon votre programme universitaire.</p></div>
            <div className="step-card"><h3>3. Apprenez avec l’IA</h3><p>Découvrez du contenu intelligent, des quiz, et bien plus.</p></div>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">Fonctionnalités phares</h2>
          <div className="features-grid">
            <div className="feature-card"><h3>IA Personnalisée</h3><p>Notre IA adapte le contenu selon votre rythme.</p></div>
            <div className="feature-card"><h3>Quiz Intelligents</h3><p>Quiz automatiques, générés et corrigés instantanément.</p></div>
            <div className="feature-card"><h3>Contenu Multimédia</h3><p>Cours en vidéo, PDF, interactifs et plus encore.</p></div>
            <div className="feature-card"><h3>Profs Experts</h3><p>Enseignants qualifiés disponibles à tout moment.</p></div>
          </div>
        </section>
      </div>

      <TestimonialsSection />
      <FaqSection />
      <ProfsSection />
      <HowItWorks />

      <section className="cta-section">
        <h2>Prêt à transformer votre apprentissage ?</h2>
        <p>Inscrivez-vous gratuitement et découvrez une nouvelle manière d’apprendre l’informatique avec l’IA.</p>
        <motion.button className="start-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleClick}>Rejoindre Curio</motion.button>
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
