/*

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

export default TeacherDashboard;*/
// TeacherDashboard.jsx
import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import axios from "axios";
import "./TeacherDashboard.css";

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
  const [editVisible, setEditVisible] = useState(false);
  const [editForm, setEditForm] = useState({ bio: "", background: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/api/users/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setEditForm({ bio: response.data.bio || "", background: response.data.background || "" });
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        console.error("Erreur de chargement de l'utilisateur :", error);
      }
    };

    fetchUser();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("bio", editForm.bio);
      formData.append("background", editForm.background);

      const response = await axios.patch("http://127.0.0.1:8000/api/users/me/edit/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = { ...user, bio: editForm.bio, background: editForm.background };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditVisible(false);
      console.log("✅ Profil mis à jour :", response.data);
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour :", error.response?.data || error.message);
    }
  };

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
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => setEditVisible(true)}
            >
              {user?.first_name || user?.username || "Professeur"}
            </span> 🍎
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

        <Dialog
          header="Modifier mon profil"
          visible={editVisible}
          style={{ width: '400px' }}
          onHide={() => setEditVisible(false)}
        >
          <div className="edit-profile-form">
            <label>Bio</label>
            <textarea
              name="bio"
              value={editForm.bio}
              onChange={handleEditChange}
              rows={3}
              style={{ width: "100%", marginBottom: "1rem" }}
            />

            <label>Background</label>
            <textarea
              name="background"
              value={editForm.background}
              onChange={handleEditChange}
              rows={3}
              style={{ width: "100%", marginBottom: "1rem" }}
            />

            <button onClick={handleSaveProfile} className="auth-button-filled">
              Sauvegarder
            </button>
          </div>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;
