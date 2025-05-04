import axios from "axios";
import { motion } from "framer-motion";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Student.css";

const dashboardItems = [
  { icon: "pi pi-book", label: "mes Cours", to: "/courses" },
  { icon: "pi pi-pencil", label: "Quizzes", to: "/quizes" },
  { icon: "pi pi-cog", label: "Paramètres", to: "/studentsettings" },
  { icon: "pi pi-comments", label: "Chat Bot", to: "/chat" },
  { icon: "pi pi-question-circle", label: "FAQ", to: "/faq" },
  { icon: "pi pi-chart-line", label: "performance-AI", to: "/performance" },
  { icon: "pi pi-users", label: "Professeurs", to: "/StudentProfessors" },
];

const Student = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [editForm, setEditForm] = useState({ bio: "", background: "" });
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("https://via.placeholder.com/150");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditForm({ bio: parsedUser.bio || "", background: parsedUser.background || "" });
      setProfilePhotoUrl(parsedUser.profile_photo || "https://via.placeholder.com/150");
    }
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setProfilePhotoUrl(tempUrl); // Preview only

      // TODO: upload to backend
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("profile_photo", file);

      axios.patch("http://127.0.0.1:8000/api/users/me/edit/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const updatedUser = { ...user, profile_photo: res.data.profile_photo };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      })
      .catch((err) => {
        console.error("❌ Erreur upload photo:", err);
      });
    }
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
          <p className="dashboard-subtext">Voici votre tableau de bord personnalisé.</p>
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

        {/* Modale de modification du profil */}
        <Dialog
          header="Modifier mon profil"
          visible={editVisible}
          style={{ width: "400px" }}
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

            {/* Upload de photo */}
            <div className="profile-picture-container">
              <img src={profilePhotoUrl} alt="Profil étudiant" className="profile-picture" />
              <div className="overlay">
                <label htmlFor="photo-upload" className="edit-icon">⚙️</label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePhotoUpload}
                />
              </div>
            </div>

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

