import React, { useState, useEffect } from "react";
import { FaSun, FaMoon, FaBell } from "react-icons/fa";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import "./StudentHeader.css";

const StudentHeader = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const languages = [
    { name: "🇫🇷 Français", code: "fr" },
    { name: "🇬🇧 English", code: "en" },
  ];

  useEffect(() => {
    // 💡 Charger l'utilisateur depuis localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

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
          placeholder="🌐 Langue"
        />

        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-icon">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        <button className="notif-icon" onClick={() => navigate("/notification")}>
          <FaBell size={20} />
          <span className="notif-dot">3</span>
        </button>

        <div className="profile-area">
          <div className="student-icon">👤</div>
          <div className="profile-info">
          <span className="student-name">{user?.username || "Utilisateur"}</span>

            <span className="student-role">Étudiant</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
