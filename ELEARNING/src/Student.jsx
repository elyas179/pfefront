import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog } from 'primereact/dialog';
import "./Student.css";
import { Link } from "react-router-dom";

const dashboardItems = [
  { icon: "pi pi-book", label: "mes Cours", to: "/courses" },
  { icon: "pi pi-pencil", label: "Quizzes", to: "/quizes" },
  { icon: "pi pi-cog", label: "Paramètres", to: "/studentsettings" },
  { icon: "pi pi-comments", label: "Chat Bot", to: "/chat" },
  { icon: "pi pi-question-circle", label: "FAQ", to: "/faq" },
  { icon: "pi pi-chart-line", label: "performance-AI", to: "/performance" },

  {icon: "pi pi-users", label: "Professeurs", to: "/StudentProfessors"}
  
];
<Link to="/StudentProfessors" className="some-class">
  <i className="pi pi-users" /> Professeurs
  </Link>



const Student = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [editForm, setEditForm] = useState({ bio: "", background: "" });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditForm({ bio: parsedUser.bio || "", background: parsedUser.background || "" });
    }
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append('bio', editForm.bio);
      formData.append('background', editForm.background);

      const response = await axios.patch('http://127.0.0.1:8000/api/users/me/edit/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Mise à jour du localStorage directement
      const updatedUser = { ...user, bio: editForm.bio, background: editForm.background };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditVisible(false);
      console.log('✅ Profil mis à jour:', response.data);
    } catch (error) {
      console.error("❌ Erreur mise à jour profil:", error.response?.data || error.message);
    }
  };

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
            <span
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => setEditVisible(true)}
            >
              {user?.first_name || user?.username || "Étudiant"}
            </span> 🎓
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

        {/* Popup de modification */}
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

export default Student;
