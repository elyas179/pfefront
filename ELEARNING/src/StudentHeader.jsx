// ✅ StudentHeader.jsx (complet et corrigé)
import { Avatar } from "primereact/avatar";
import { OverlayPanel } from "primereact/overlaypanel";
import React, { useEffect, useRef, useState } from "react";
import { FaBell, FaMoon, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./StudentHeader.css";

const StudentHeader = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const op = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    op.current.hide();
  };

  return (
    <header className="student-header">
      <div className="student-header-left">
        <img src="/logo.png" alt="Curio Logo" className="student-logo" />
        <span className="student-title">Curio</span>
      </div>

      <div className="student-header-right">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="theme-toggle-icon"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <button className="notif-icon" onClick={() => navigate("/notification")}>
          <FaBell size={20} />
          <span className="notif-dot">3</span>
        </button>

        <div
          className="profile-area"
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          onClick={(e) => op.current.toggle(e)}
        >
          <Avatar
            image={user?.profile_photo ? `http://127.0.0.1:8000${user.profile_photo}` : undefined}
            icon={!user?.profile_photo && "pi pi-user"}
            size="large"
            shape="circle"
          />
          <span className="student-name">{user?.username || "Utilisateur"}</span>
        </div>

        <OverlayPanel ref={op} className="overlay-panel-custom">
          <ul className="overlay-options">
            <li onClick={() => handleNavigation("/profile")}>👤 Mon Profil</li>
            <li onClick={() => handleNavigation("/settings")}>⚙️ Paramètres</li>
            <li onClick={() => handleNavigation("/performance")}>📊 Statistiques</li>
            <li onClick={handleLogout}>🚪 Déconnexion</li>
          </ul>
        </OverlayPanel>
      </div>
    </header>
  );
};

export default StudentHeader;