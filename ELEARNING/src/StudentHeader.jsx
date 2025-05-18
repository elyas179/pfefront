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
  const [query, setQuery] = useState("");
  const profileOp = useRef(null);
  const notifOp = useRef(null);
  const navigate = useNavigate();
  const [language, setLanguage] = useState("fr");
  const [notifications, setNotifications] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

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
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://127.0.0.1:8000/api/notifications/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Erreur notifications:", err);
      }
    };
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleLanguage = () => {
    const newLang = language === "fr" ? "en" : "fr";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
    window.location.reload();
  };

  const handleNavigation = (path) => {
    navigate(path);
    profileOp.current.hide();
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_photo", file);

    try {
      const token = localStorage.getItem("accessToken");

      await axios.patch("http://127.0.0.1:8000/api/users/me/edit/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const res = await axios.get("http://127.0.0.1:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = res.data;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Erreur upload photo:", err);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
  
    setLoadingSearch(true); // ⏳ Start loading
  
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`http://127.0.0.1:8000/search/?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      localStorage.setItem("searchResults", JSON.stringify(response.data));
      localStorage.setItem("searchQuery", query);
  
      // Wait a bit so the loading is visible
      setTimeout(() => {
        setLoadingSearch(false);
        navigate("/search-results");
        navigate(0);
      }, 1000);
    } catch (err) {
      setLoadingSearch(false);
      console.error("Erreur recherche:", err);
    }
  };
  

  return loadingSearch ? (
    <div className="search-loading-screen">⏳ Chargement des résultats...</div>
  ) : (
    <header className="student-header">
      <div className="student-header-left">
        <img
          src="/logo.png"
          alt="Curio Logo"
          className="student-logo"
          onClick={() => navigate("/student")}
          style={{ cursor: "pointer" }}
        />
        <span className="student-title" onClick={() => navigate("/student")}>Curio</span>
        <button className="home-button" onClick={() => navigate("/student")}>🏠 Accueil</button>
      </div>
  
      <div className="student-header-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Rechercher..."
          className="search-input"
        />
        <button className="search-button" onClick={handleSearch}>Rechercher</button>
      </div>
  
      <div className="student-header-right">
        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-icon">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
  
        <div className="notif-wrapper">
          <div className="notif-icon" onClick={(e) => notifOp.current.toggle(e)}>
            <FaBell />
            {notifications.length > 0 && <span className="notif-dot">{notifications.length}</span>}
          </div>
          <OverlayPanel ref={notifOp} className="overlay-panel-custom">
            <ul className="overlay-options">
              {notifications.length > 0 ? (
                notifications.map((notif, i) => <li key={i}>{notif.message}</li>)
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
            <label htmlFor="photo-upload-overlay" style={{ cursor: "pointer" }}>
              <Avatar
                image={user?.profile_photo ? `http://127.0.0.1:8000${user.profile_photo}` : undefined}
                icon={!user?.profile_photo && "pi pi-user"}
                size="xlarge"
                shape="circle"
              />
              <input
                id="photo-upload-overlay"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoUpload}
              />
            </label>
            <div className="overlay-user-info">
              <strong>{user?.username || "Utilisateur"}</strong>
              <small>{user?.speciality || "Spécialité inconnue"}</small>
            </div>
          </div>
  
          <ul className="overlay-options">
            <li onClick={() => navigate(`/profile/${user.id}/edit`)}>👤 Profil</li>
            <li onClick={() => handleNavigation("/settings")}>⚙️ Paramètres</li>
            <li onClick={() => handleNavigation("/performance")}>📊 Statistiques</li>
            <li onClick={toggleLanguage}>🌐 Langue : {language === "fr" ? "Français 🇫🇷" : "English 🇬🇧"}</li>
            <li onClick={() => setDarkMode(!darkMode)}>{darkMode ? "☀️ Mode clair" : "🌙 Mode sombre"}</li>
            <li onClick={handleLogout}>🚪 Déconnexion</li>
          </ul>
        </OverlayPanel>
      </div>
    </header>
  );
  
};

export default StudentHeader;
