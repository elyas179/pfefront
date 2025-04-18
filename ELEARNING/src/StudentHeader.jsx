import React, { useState, useEffect } from "react";
import { FaSun, FaMoon, FaBell } from "react-icons/fa";
import { Dropdown } from "primereact/dropdown";
import "./StudentHeader.css";

const StudentHeader = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");

  const languages = [
    { name: "🇫🇷 Français", code: "fr" },
    { name: "🇬🇧 English", code: "en" },
  ];

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
        {/* Langue */}
        <Dropdown
          value={language}
          options={languages}
          onChange={(e) => setLanguage(e.value)}
          optionLabel="name"
          className="language-dropdown"
          placeholder="🌐 Langue"
        />

        {/* Thème clair/sombre */}
        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-icon">
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Notifications */}
        <div className="notif-icon">
          <FaBell />
          <span className="notif-dot">3</span>
        </div>

        {/* Profil avec icône 👤 */}
        <div className="profile-area">
          <div className="student-icon">👤</div>
          <div className="profile-info">
            <span className="student-name">elyas</span>
            <span className="student-role">Étudiant</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
