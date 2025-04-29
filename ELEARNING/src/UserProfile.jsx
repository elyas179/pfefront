// File: src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { motion } from "framer-motion";
import "./UserProfile.css";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(`http://127.0.0.1:8000/api/users/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("❌ Erreur récupération profil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

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
          <h3>Bio</h3>
          <p>{user.bio || "Aucune bio renseignée."}</p>

          <h3>Background</h3>
          <p>{user.background || "Aucun background renseigné."}</p>
        </div>
      </Card>
    </motion.div>
  );
};

export default UserProfile;
