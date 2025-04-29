// TeacherDashboard.jsx
/*import React, { useState } from 'react';
import UploadCustomCourseForm from '../components/UploadCustomCourseForm';
import RequestList from '../components/RequestList';

const TeacherDashboard = () => {
  const [customCourses, setCustomCourses] = useState([]);
  const [requests, setRequests] = useState([
    { id: 1, studentName: 'Ali', courseName: 'Réseaux avancés', status: 'pending' },
    { id: 2, studentName: 'Sara', courseName: 'Algo L3', status: 'pending' },
  ]);

  const addCourse = (newCourse) => {
    setCustomCourses([...customCourses, newCourse]);
  };

  const handleRequestAccept = (id) => {
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: 'accepted' } : req
    ));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord Professeur</h1>
      <UploadCustomCourseForm onAddCourse={addCourse} />

      <h2 className="text-xl font-semibold mt-6 mb-2">Demandes d'accès</h2>
      <RequestList requests={requests} onAccept={handleRequestAccept} />
    </div>
  );
};

export default TeacherDashboard;*/

import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./TeacherDashboard.css";  
import { Link } from "react-router-dom";

const dashboardItems = [
  { icon: "pi pi-book", label: "Mes Cours", to: "/teacher-courses" },
  { icon: "pi pi-plus", label: "Ajouter un Cours", to: "/add-course" },
  { icon: "pi pi-file", label: "Mes Ressources", to: "/teacher-resources" },
  { icon: "pi pi-users", label: "Étudiants", to: "/teacher-students" },
  { icon: "pi pi-pencil", label: "Créer un Quiz", to: "/create-quiz" },
  { icon: "pi pi-users", label: "Demandes d'accès", to: "/access-requests" },
  { icon: "pi pi-cog", label: "Paramètres", to: "/teacher-settings" },
  { icon: "pi pi-comments", label: "Chat Bot", to: "/chat" },
  { icon: "pi pi-question-circle", label: "FAQ", to: "/faq" },
];

const TeacherDashboard = () => {
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
    <div className="teacher-dashboard-page">
      <motion.div
        className="teacher-dashboard"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Bienvenue{" "}
            <span>{user?.first_name || user?.username || "Professeur"}</span> 🍎
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
