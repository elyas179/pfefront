// ✅ StudentHeader.jsx (corrigé proprement)
import axios from "axios";
import { Avatar } from "primereact/avatar";
import { OverlayPanel } from "primereact/overlaypanel";
import React, { useEffect, useRef, useState } from "react";
import { FaBell, FaMoon, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./StudentHeader.css";

const StudentHeader = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const profileOp = useRef(null);
  const notifOp = useRef(null);
  const navigate = useNavigate();
  const [language, setLanguage] = useState("fr");

  const [notifications, setNotifications] = useState([
    "📌 Nouveau cours disponible",
    "🧪 Nouveau quiz publié",
    "📣 Annonce du professeur"
  ]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) setLanguage(savedLang);
  }, []);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // ton JWT
        const res = await axios.get("http://127.0.0.1:8000/api/notifications/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(res.data); // ← suppose que c'est un tableau d'objets
      } catch (err) {
        console.error("Erreur lors du chargement des notifications :", err);
      }
    };
  
    fetchNotifications();
  }, []);
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(`http://127.0.0.1:8000/api/notifications/${id}/read/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Tu peux aussi mettre à jour l’état pour supprimer la notif localement
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Erreur lors du marquage comme lu :", err);
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
const toggleLanguage = () => {
  const newLang = language === "fr" ? "en" : "fr";
  setLanguage(newLang);
  localStorage.setItem("language", newLang);
  window.location.reload(); // recharge pour appliquer le changement (optionnel)
};
  const handleNavigation = (path) => {
    navigate(path);
    profileOp.current.hide();
  };

  return (
    <header className="student-header">
      <div className="student-header-left">
        <img src="/logo.png" alt="Curio Logo" className="student-logo" />
        <span className="student-title">Curio</span>
      </div>

      <div className="student-header-right">
        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-icon">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <div className="notif-wrapper">
          <div className="notif-icon" onClick={(e) => notifOp.current.toggle(e)}>
            <FaBell />
            {notifications.length > 0 && (
              <span className="notif-dot">{notifications.length}</span>
            )}
          </div>

          <OverlayPanel ref={notifOp} className="overlay-panel-custom">
  <ul className="overlay-options">
    {notifications.length > 0 ? (
      notifications.map((notif, index) => (
        <li key={index}>{notif.message}</li> // ← adapte ce champ selon ton modèle
      ))
    ) : (
      <li>Aucune notification</li>
    )}
  </ul>
</OverlayPanel>
        </div>

        <div
          className="profile-area"
          onClick={(e) => profileOp.current.toggle(e)}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Avatar
            image={user?.profile_photo ? `http://127.0.0.1:8000${user.profile_photo}` : undefined}
            icon={!user?.profile_photo && "pi pi-user"}
            size="large"
            shape="circle"
          />
          <span className="student-name">{user?.username || "Utilisateur"}</span>
        </div>

        <OverlayPanel ref={profileOp} className="overlay-panel-custom">
  <div className="overlay-profile-header">
    <Avatar
      image={user?.profile_photo ? `http://127.0.0.1:8000${user.profile_photo}` : undefined}
      icon={!user?.profile_photo && "pi pi-user"}
      size="xlarge"
      shape="circle"
    />
    <div className="overlay-user-info">
      <strong>{user?.username || "Utilisateur"}</strong>
      <small>{user?.speciality || "Spécialité inconnue"}</small>
    </div>
  </div>

  <ul className="overlay-options">
    <li onClick={() => handleNavigation("/profile")}>👤 Mon Profil</li>
    <li onClick={() => handleNavigation("/settings")}>⚙️ Paramètres</li>
    <li onClick={() => handleNavigation("/performance")}>📊 Statistiques</li>
    <li onClick={toggleLanguage}>
      🌐 Langue : {language === "fr" ? "Français 🇫🇷" : "English 🇬🇧"}
    </li>
    <li onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? "☀️ Mode clair" : "🌙 Mode sombre"}
    </li>
    <li onClick={handleLogout}>🚪 Déconnexion</li>
  </ul>
</OverlayPanel>


      </div>
    </header>
  );
};

export default StudentHeader;
