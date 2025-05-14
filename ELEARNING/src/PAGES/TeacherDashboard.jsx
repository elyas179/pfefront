import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TeacherDashboard.css";

const dashboardItems = [
  { icon: "pi pi-book", label: "Mes Cours", to: "/teacher-courses" },
  { icon: "pi pi-plus", label: "Ajouter un Cours", to: "/add-course" },
  { icon: "pi pi-file", label: "Mes Ressources", to: "/teacher-resources" },
  { icon: "pi pi-users", label: "Étudiants", to: "/teacher-students" },
  { icon: "pi pi-pencil", label: "Créer un Quiz", to: "/create-quiz" },
  { icon: "pi pi-users", label: "Demandes d'accès", to: "/access-requests" },
  { icon: "pi pi-cog", label: "Paramètres", to: "/edit-profile" },
  { icon: "pi pi-comments", label: "Chat Bot", to: "/chat" },
  { icon: "pi pi-question-circle", label: "FAQ", to: "/faq" },
];

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://127.0.0.1:8000/api/users/professors/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Erreur de chargement du professeur :", error);
      }
    };

    fetchProfessor();
  }, []);

  return (
    <div className="teacher-dashboard-page">
      <motion.div
        className="teacher-dashboard"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dashboard-header">
          <h1 className="dashboard-title-line">
            <span className="dashboard-title">Bienvenue </span>
            <span className="teacher-name-black" style={{color: '#000'}}>{user?.first_name || user?.username}</span>
          </h1>
          <p className="dashboard-subtext">
            Voici votre tableau de bord pour gérer vos cours, ressources et étudiants.
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

export default TeacherDashboard;
