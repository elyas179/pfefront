// File: src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { motion } from "framer-motion";
import "./UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ bio: "", background: "" });

  const getAccessToken = () => localStorage.getItem("accessToken");

  const fetchUserProfile = async () => {
    try {
      const token = getAccessToken();
      const response = await axios.get("http://127.0.0.1:8000/api/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setEditForm({
        bio: response.data.bio || "",
        background: response.data.background || "",
      });
    } catch (error) {
      console.error("❌ Erreur récupération profil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = getAccessToken();
      await axios.patch("http://127.0.0.1:8000/api/users/me/edit/", editForm, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      fetchUserProfile();
      setEditing(false);
    } catch (error) {
      console.error("❌ Erreur mise à jour:", error);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <ProgressSpinner />
      </div>
    );
  }

  if (!user) {
    return <div className="profile-error">❌ Utilisateur introuvable</div>;
  }

  return (
    <motion.div
      className="profile-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="profile-card">
        <div className="profile-header">
          {user.profile_photo ? (
            <img
              src={`http://127.0.0.1:8000${user.profile_photo}`}
              alt="Photo de profil"
              className="profile-photo"
            />
          ) : (
            <div className="profile-placeholder">👤</div>
          )}
          <h1 className="profile-username">{user.username}</h1>
        </div>

        <div className="profile-info">
          {editing ? (
            <>
              <label>Bio</label>
              <InputTextarea
                name="bio"
                value={editForm.bio}
                onChange={handleChange}
                rows={3}
                style={{ width: "100%", marginBottom: "1rem" }}
              />
              <label>Background</label>
              <InputTextarea
                name="background"
                value={editForm.background}
                onChange={handleChange}
                rows={3}
                style={{ width: "100%", marginBottom: "1rem" }}
              />
              <div style={{ display: "flex", gap: "1rem" }}>
                <Button label="✅ Sauvegarder" onClick={handleSave} className="p-button-success" />
                <Button label="❌ Annuler" onClick={() => setEditing(false)} className="p-button-secondary" />
              </div>
            </>
          ) : (
            <>
              <h3>Bio</h3>
              <p>{user.bio || "Aucune bio renseignée."}</p>

              <h3>Background</h3>
              <p>{user.background || "Aucun background renseigné."}</p>

              <Button label="✏️ Modifier" onClick={() => setEditing(true)} className="p-button-warning" />
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default UserProfile;
