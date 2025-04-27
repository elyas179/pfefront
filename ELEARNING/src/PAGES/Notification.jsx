import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import axios from "axios";
import "./Notification.css";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user")); // pour l'id

  useEffect(() => {
    // Chargement initial des notifications
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/notifications/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setNotifications(res.data))
        .catch((err) => console.error("Erreur chargement notifications", err));
    }

    // Connexion WebSocket
    if (user) {
      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/${user.id}/`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setNotifications((prev) => [data, ...prev]);
      };

      ws.onerror = (err) => console.error("WebSocket Error:", err);
      ws.onclose = () => console.log("🔌 WebSocket disconnected");

      return () => ws.close();
    }
  }, []);

  const markAllAsRead = () => {
    notifications.forEach((notif) => {
      axios.patch(`http://127.0.0.1:8000/api/notifications/${notif.id}/read/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, is_read: true }))
    );
  };

  return (
    <motion.div className="notification-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="notification-header">
        <h1 className="notification-title">🔔 Mes Notifications</h1>
        <Button label="Tout marquer comme lu" icon="pi pi-check" className="mark-all-btn" onClick={markAllAsRead} />
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <p>Aucune notification</p>
        ) : (
          notifications.map((notif, index) => (
            <motion.div key={notif.id} initial={{ x: -30 }} animate={{ x: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className={`notification-card ${notif.is_read ? 'read' : ''}`}>
                <p>{notif.message}</p>
                <span className="notification-time">{new Date(notif.created_at).toLocaleString()}</span>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Notification;
