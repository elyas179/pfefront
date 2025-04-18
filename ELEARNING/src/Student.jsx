import React from "react";
import { Card } from "primereact/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Student.css";
import Footer from "./Footer";

const dashboardItems = [
  { icon: "pi pi-chart-bar", label: "Tableau de bord" },
  { icon: "pi pi-book", label: "Cours" },
  { icon: "pi pi-pencil", label: "Quizzes" },
  { icon: "pi pi-wrench", label: "Outils" },
  { icon: "pi pi-users", label: "Communauté" },
  { icon: "pi pi-cog", label: "Paramètres" },
  { icon: "pi pi-comments", label: "Chat Bot", to: "/chat" },
  { icon: "pi pi-question-circle", label: "FAQ", to: "/faq" },
];

const Student = () => {
  const navigate = useNavigate();

  return (
    <div className="student-page">
      <motion.div
        className="student-dashboard"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="dashboard-title">
          Bienvenue <span>Étudiant</span> 🎓
        </h1>
        <p className="dashboard-subtext">Voici votre tableau de bord personnalisé.</p>

        <div className="dashboard-grid">
          {dashboardItems.map((item, index) => (
            <Card
              key={index}
              className="dashboard-card"
              onClick={() => item.to && navigate(item.to)}
              style={{ cursor: item.to ? "pointer" : "default" }}
            >
              <i className={`pi ${item.icon} card-icon`}></i>
              <p>{item.label}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      
    </div>
  );
};

export default Student;
