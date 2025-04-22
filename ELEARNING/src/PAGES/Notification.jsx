import { motion } from 'framer-motion';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import React from 'react';
import './Notification.css';

const notifications = [
  { id: 1, message: "Vous avez reçu une nouvelle tâche.", time: "Il y a 2 min" },
  { id: 2, message: "Votre quiz commence bientôt.", time: "Il y a 10 min" },
  { id: 3, message: "Nouveau module disponible !", time: "Hier" },
];

const Notification = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="notification-container"
    >
      <h1 className="notification-title">🔔 Mes Notifications</h1>
      <div className="notification-list">
        {notifications.map((notif, index) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
          >
            <div className="mark-all-btn">
  <Button label="Tout marquer comme lu" icon="pi pi-check" className="p-button-outlined" />
</div>
            <Card className="notification-card">
              <p>{notif.message}</p>
              <span className="notification-time">{notif.time}</span>
              <Button label="Voir" icon="pi pi-arrow-right" className="p-button-text view-btn" />
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Notification;

