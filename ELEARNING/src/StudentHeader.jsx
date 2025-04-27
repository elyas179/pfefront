// File: StudentHeader.jsx
import React, { useState, useEffect } from "react";
import { FaSun, FaMoon, FaBell } from "react-icons/fa";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentHeader.css";

const StudentHeader = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const languages = [
    { name: "\ud83c\uddeb\ud83c\uddf7 Fran\u00e7ais", code: "fr" },
    { name: "\ud83c\uddec\ud83c\udde7 English", code: "en" },
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  const refreshUserProfile = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
    } catch (err) {
      console.error("\u274c Erreur de rafr\u00e2ichissement:", err);
    }
  };

  const handleUpload = async (e) => {
    const file = e.files[0];
    const formData = new FormData();
    formData.append("profile_photo", file);

    const token = localStorage.getItem("accessToken");
    try {
      await axios.patch("http://127.0.0.1:8000/api/users/me/edit/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await refreshUserProfile();
      alert("\u2705 Photo mise \u00e0 jour !");
      setModalVisible(false);
    } catch (err) {
      alert("\u274c Erreur lors de l'upload");
      console.error(err);
    }
  };

  const handleDeletePhoto = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.patch(
        "http://127.0.0.1:8000/api/users/me/edit/",
        { profile_photo: null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await refreshUserProfile();
      alert("\ud83d\uddd1\ufe0f Photo supprim\u00e9e avec succ\u00e8s !");
      setModalVisible(false);
    } catch (err) {
      alert("\u274c Erreur lors de la suppression de la photo.");
      console.error(err);
    }
  };

  return (
    <header className="student-header">
      <div className="student-header-left">
        <img src="/logo.png" alt="Curio Logo" className="student-logo" />
        <span className="student-title">Curio</span>
      </div>

      <div className="student-header-right">
        <Dropdown
          value={language}
          options={languages}
          onChange={(e) => setLanguage(e.value)}
          optionLabel="name"
          className="language-dropdown"
          placeholder="\ud83c\udf10 Langue"
        />

        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-icon">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <button className="notif-icon" onClick={() => navigate("/notification")}> 
          <FaBell size={20} />
          <span className="notif-dot">3</span>
        </button>

        <div className="profile-area" onClick={() => setModalVisible(true)}>
          {user?.profile_photo ? (
            <img
              src={`http://127.0.0.1:8000${user.profile_photo}`}
              alt="Profil"
              className="profile-preview-small"
            />
          ) : (
            <div className="student-icon"></div>
          )}
          <div className="profile-info">
            <span className="student-name">{user?.username || "Utilisateur"}</span>
            <span className="student-role"></span>
          </div>
        </div>
      </div>

      <Dialog
        header="Changer la photo de profil"
        visible={modalVisible}
        style={{ width: "30vw" }}
        onHide={() => setModalVisible(false)}
      >
        {user?.profile_photo && (
          <div className="photo-preview-container">
            <img
              src={`http://127.0.0.1:8000${user.profile_photo}`}
              alt="Preview"
              className="profile-preview"
            />
            <button className="delete-button" onClick={handleDeletePhoto}>
              Supprimer la photo
            </button>
          </div>
        )}

        <FileUpload
          name="profile_photo"
          customUpload
          uploadHandler={handleUpload}
          accept="image/*"
          mode="basic"
          auto
          chooseLabel="Télécharger une photo"
        />
      </Dialog>
    </header>
  );
};

export default StudentHeader;