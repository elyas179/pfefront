import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import axios from "axios";
import "./TeacherDashboard.css";

const dashboardItems = [
  { icon: "pi pi-book", label: "Mes Cours", to: "/teacher-courses" },
  { icon: "pi pi-database", label: "Choisir mes Modules", to: "/choose-modules" }, // ✅ New item

  { icon: "pi pi-users", label: "Étudiants", to: "/teacher-students" },
  { icon: "pi pi-pencil", label: "Créer un Quiz", to: "/create-quiz" },
  { icon: "pi pi-users", label: "Demandes d'accès", to: "/access-requests" },

  { icon: "pi pi-comments", label: "Chat Bot", to: "/teacher-chat" },
  { icon: "pi pi-question-circle", label: "FAQ", to: "/teacher-faq" },
];


const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [levels, setLevels] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [announcement, setAnnouncement] = useState({
    title: "",
    content: "",
    level: "",
    speciality: ""
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const [profRes, levelRes, specRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/users/me/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/courses/levels/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/courses/specialities/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(profRes.data);
        setLevels(levelRes.data);
        setSpecialities(specRes.data);
      } catch (error) {
        console.error("Erreur chargement données initiales :", error);
      }
    };

    fetchInitialData();
  }, []);

  const handleSendAnnouncement = async () => {
    const token = localStorage.getItem("accessToken");

    try {
      await axios.post("http://127.0.0.1:8000/notifications/announce-create/", announcement, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setShowDialog(false);
      setAnnouncement({ title: "", content: "", level: "", speciality: "" });
      alert("✅ Annonce envoyée !");
    } catch (error) {
      console.error("Erreur envoi annonce:", error);
      alert("❌ Échec de l'envoi.");
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
          <h1 className="dashboard-title-line">
            <span className="dashboard-title">Bienvenue </span>
            <span className="teacher-name-black" style={{ color: '#000' }}>
              {user?.first_name || user?.username}
            </span>
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

        {/* 📢 Create Announcement Button */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button className="auth-button-filled" onClick={() => setShowDialog(true)}>
            📢 Créer une Annonce
          </button>
        </div>
      </motion.div>

      {/* 📋 Announcement Dialog */}
      <Dialog
  header="Nouvelle Annonce"
  visible={showDialog}
  style={{ width: '500px' }}
  onHide={() => setShowDialog(false)}
>
  <div className="p-fluid">
    <label>Titre</label>
    <input
      type="text"
      value={announcement.title}
      onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
      className="p-inputtext"
    />

    <label>Message</label>
    <InputTextarea
      rows={4}
      value={announcement.content}
      onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
    />

    {/* 🔁 Spécialité d'abord */}
    <label>Spécialité</label>
    <select
      value={announcement.speciality}
      onChange={async (e) => {
        const selectedId = parseInt(e.target.value);
        setAnnouncement({ ...announcement, speciality: selectedId, level: "" });

        // Charger dynamiquement les niveaux liés à la spécialité
        try {
          const token = localStorage.getItem("accessToken");
          const res = await axios.get(`http://127.0.0.1:8000/api/courses/speciality/${selectedId}/levels/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLevels(res.data.levels || []);
        } catch (err) {
          console.error("Erreur chargement niveaux:", err);
          setLevels([]);
        }
      }}
      className="p-inputtext"
    >
      <option value="">-- Choisir --</option>
      {specialities.map((spec) => (
        <option key={spec.id} value={spec.id}>
          {spec.name}
        </option>
      ))}
    </select>

    {/* 🎯 Niveau ensuite, seulement si une spécialité est choisie */}
    {announcement.speciality && (
      <>
        <label>Niveau</label>
        <select
          value={announcement.level}
          onChange={(e) => setAnnouncement({ ...announcement, level: parseInt(e.target.value) })}
          className="p-inputtext"
        >
          <option value="">-- Choisir --</option>
          {levels.map((lvl) => (
            <option key={lvl.id} value={lvl.id}>
              {lvl.name}
            </option>
          ))}
        </select>
      </>
    )}

    <button
      className="auth-button-filled"
      style={{ marginTop: "1rem" }}
      onClick={handleSendAnnouncement}
    >
      🚀 Envoyer
    </button>
  </div>
</Dialog>

    </div>
  );
};

export default TeacherDashboard;
