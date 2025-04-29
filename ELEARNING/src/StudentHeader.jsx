// File: StudentHeader.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaSun, FaMoon, FaBell } from "react-icons/fa";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { AutoComplete } from "primereact/autocomplete";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./StudentHeader.css";

const StudentHeader = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [user, setUser] = useState(null);
  const [modalPhotoVisible, setModalPhotoVisible] = useState(false);
  const [modalProfileVisible, setModalProfileVisible] = useState(false);
  const [editForm, setEditForm] = useState({ bio: "", background: "" });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();
  const toast = useRef(null);

  const languages = [
    { name: "🇫🇷 Français", code: "fr" },
    { name: "🇬🇧 English", code: "en" },
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditForm({ bio: parsedUser.bio || "", background: parsedUser.background || "" });
    }
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  const getAccessToken = () => {
    return localStorage.getItem("accessToken"); // ✅ correct ici
  };

  const refreshUserProfile = async () => {
    const token = getAccessToken();
    if (!token) return;
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
    } catch (err) {
      console.error("❌ Erreur rafraîchissement profil:", err);
    }
  };

  const handleUpload = async (e) => {
    const token = getAccessToken();
    if (!token) return showError("Connectez-vous.");
    const file = e.files[0];
    const formData = new FormData();
    formData.append("profile_photo", file);

    try {
      setLoading(true);
      await axios.patch("http://127.0.0.1:8000/api/users/me/edit/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      await refreshUserProfile();
      showSuccess("✅ Photo mise à jour !");
      setModalPhotoVisible(false);
    } catch (err) {
      showError("❌ Erreur upload photo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    const token = getAccessToken();
    if (!token) return showError("Connectez-vous.");
    try {
      setLoading(true);
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
      showSuccess("🗑️ Photo supprimée !");
      setModalPhotoVisible(false);
    } catch (err) {
      showError("❌ Erreur suppression photo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSaveProfile = async () => {
    const token = getAccessToken();
    if (!token) return showError("Connectez-vous.");
    try {
      setLoading(true);
      await axios.patch(
        "http://127.0.0.1:8000/api/users/me/edit/",
        {
          bio: editForm.bio,
          background: editForm.background,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await refreshUserProfile();
      showSuccess("✅ Profil mis à jour !");
      setModalProfileVisible(false);
    } catch (err) {
      showError("❌ Erreur modification profil.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSearch = async (e) => {
    const query = e.query;
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/users/search/?q=${query}`);
      setSearchResults(res.data);
    } catch (error) {
      console.error("Erreur recherche:", error);
    }
  };

  const showSuccess = (msg) => {
    toast.current.show({ severity: 'success', summary: 'Succès', detail: msg, life: 3000 });
  };

  const showError = (msg) => {
    toast.current.show({ severity: 'error', summary: 'Erreur', detail: msg, life: 3000 });
  };

  return (
    <header className="student-header">
      <Toast ref={toast} />
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
          placeholder="🌐 Langue"
        />

        {/* 🔥 Barre de recherche AutoComplete */}
        <AutoComplete
          value={searchQuery}
          suggestions={searchResults}
          completeMethod={handleUserSearch}
          field="username"
          placeholder="🔍 Rechercher un utilisateur"
          className="user-search-bar"
          onChange={(e) => setSearchQuery(e.value)}
          onSelect={(e) => navigate(`/profile/${e.value.id}`)}
          dropdown
        />

        {user && (
          <button className="profile-button" onClick={() => navigate(`/profile/${user.id}`)}>
            Mon Profil
          </button>
        )}

        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-icon">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <button className="notif-icon" onClick={() => navigate("/notification")}>
          <FaBell size={20} />
          <span className="notif-dot">3</span>
        </button>

        <div className="profile-area">
          {user?.profile_photo ? (
            <img
              src={`http://127.0.0.1:8000${user.profile_photo}`}
              alt="Profil"
              className="profile-preview-small"
              onClick={() => setModalPhotoVisible(true)}
            />
          ) : (
            <div className="student-icon" onClick={() => setModalPhotoVisible(true)}></div>
          )}
          <div className="profile-info">
            <span
              className="student-name"
              onClick={() => setModalProfileVisible(true)}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              {user?.username || "Utilisateur"}
            </span>
          </div>
        </div>
      </div>

      {/* Popups */}
      <Dialog
        header="Changer la photo de profil"
        visible={modalPhotoVisible}
        style={{ width: "30vw" }}
        onHide={() => setModalPhotoVisible(false)}
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
          chooseLabel={loading ? "Chargement..." : "Téléverser une photo"}
          disabled={loading}
        />
      </Dialog>

      <Dialog
        header="Modifier mon profil"
        visible={modalProfileVisible}
        style={{ width: "30vw" }}
        onHide={() => setModalProfileVisible(false)}
      >
        <div className="edit-profile-form">
          <label>Bio</label>
          <textarea
            name="bio"
            value={editForm.bio}
            onChange={handleProfileChange}
            rows={3}
            style={{ width: "100%", marginBottom: "1rem" }}
            disabled={loading}
          />
          <label>Background</label>
          <textarea
            name="background"
            value={editForm.background}
            onChange={handleProfileChange}
            rows={3}
            style={{ width: "100%", marginBottom: "1rem" }}
            disabled={loading}
          />
          <button
            onClick={handleSaveProfile}
            className="auth-button-filled"
            disabled={loading}
          >
            {loading ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </Dialog>
    </header>
  );
};

export default StudentHeader;
