import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentSettings.css";

const StudentSettingsEdit = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    speciality: "",
    level: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setFormData({
        username: user.username,
        email: user.email,
        password: "",
        speciality: user.speciality || "",
        level: user.level || ""
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await axios.put(`http://127.0.0.1:8000/api/users/${user.id}/update/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("✅ Informations mises à jour !");
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/studentsettings");
    } catch (err) {
      console.error("Erreur de mise à jour:", err);
      alert("Erreur lors de la sauvegarde. Vérifie les champs.");
    }
  };

  return (
    <div className="student-settings">
      <h2 className="settings-title">🛠️ Modifier mes informations</h2>
      <div className="settings-grid">
        <Card className="settings-card">
          <h3>Nom d'utilisateur</h3>
          <InputText name="username" value={formData.username} onChange={handleChange} className="settings-input" />
        </Card>

        <Card className="settings-card">
          <h3>Email</h3>
          <InputText name="email" value={formData.email} onChange={handleChange} className="settings-input" />
        </Card>

        <Card className="settings-card">
          <h3>Nouveau mot de passe</h3>
          <Password name="password" value={formData.password} onChange={handleChange} toggleMask className="settings-input" feedback={false} />
        </Card>

        <Card className="settings-card">
          <h3>Spécialité</h3>
          <InputText name="speciality" value={formData.speciality} onChange={handleChange} className="settings-input" />
        </Card>

        <Card className="settings-card">
          <h3>Niveau</h3>
          <InputText name="level" value={formData.level} onChange={handleChange} className="settings-input" />
        </Card>
      </div>
      <Button label="💾 Sauvegarder" className="save-button" onClick={handleSave} />
    </div>
  );
};

export default StudentSettingsEdit;
