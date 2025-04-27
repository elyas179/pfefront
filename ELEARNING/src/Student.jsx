import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Student.css";

const dashboardItems = [
  { icon: "pi pi-book", label: "mes Cours", to: "/courses" },
  { icon: "pi pi-pencil", label: "Quizzes"  , to:"/quizes"},
  { icon: "pi pi-users", label: "Communauté" },
  { icon: "pi pi-cog", label: "Paramètres" , to:"/studentsettings"},
  { icon: "pi pi-comments", label: "Chat Bot", to: "/chat" },
  { icon: "pi pi-question-circle", label: "FAQ", to: "/faq" },
  { icon: "pi pi-chart-line", label: "performance-AI", to: "/performance" },
];

const Student = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Charger l'utilisateur depuis localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="student-page">
      <motion.div
        className="student-dashboard"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Bienvenue{" "}
            <span>{user?.first_name || user?.username || "Étudiant"}</span> 🎓
          </h1>
          <p className="dashboard-subtext">
            Voici votre tableau de bord personnalisé.
          </p>
        </div>

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
