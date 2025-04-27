import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import "./StudentSettings.css";

const StudentSettings = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleGoToProfileEdit = () => {
    navigate("/studentsettings/edit");
  };

  return (
    <div className="student-settings">
      <h2 className="settings-title">⚙️ Paramètres</h2>
      <div className="settings-grid">
        <Card className="settings-card">
          <h3>👤 Informations du compte</h3>
          <p><strong>Nom d'utilisateur:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <Button label="Modifier mes infos" className="save-button" onClick={handleGoToProfileEdit} />
        </Card>

        <Card className="settings-card">
          <h3>🎓 Niveau & Spécialité</h3>
          <p><strong>Niveau:</strong> {user?.level || "Non défini"}</p>
          <p><strong>Spécialité:</strong> {user?.speciality || "Non définie"}</p>
        </Card>

        <Card className="settings-card">
          <h3>🚪 Se déconnecter</h3>
          <p>Tu peux quitter ton compte ici.</p>
          <Button label="Déconnexion" className="save-button" onClick={handleLogout} />
        </Card>
      </div>
    </div>
  );
};

export default StudentSettings;

