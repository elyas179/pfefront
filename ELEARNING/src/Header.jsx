import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaSun, FaMoon } from "react-icons/fa";
import { Button } from "primereact/button";

function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  const isRegisterPage = location.pathname === "/register";

  return (
    <header className="header">
      <div className="header-content">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="lang-select"
        >
          <option value="fr">🇫🇷 FR</option>
          <option value="en">🇬🇧 EN</option>
        </select>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {!isRegisterPage ? (
          <>
            <Button
              label="Connexion"
              icon="pi pi-user"
              className="p-button-danger"
              onClick={() => navigate("/login")}
            />
            <Button
              label="Inscription"
              className="p-button-danger"
              onClick={() => navigate("/register")}
            />
          </>
        ) : (
          <Button
            label="Accueil"
            className="p-button-danger"
            onClick={() => navigate("/")}
          />
        )}
      </div>
    </header>
  );
}

export default Header;