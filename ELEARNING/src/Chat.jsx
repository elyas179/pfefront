import React from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { motion } from "framer-motion";
import "./Chat.css";
import Footer from "./Footer";

const ChatBot = () => {
  return (
    <div className="chat-page">
      <motion.div
        className="chat-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="dashboard-title">
          Bienvenue sur <span>Curio</span> 🤖
        </h1>
        <p className="dashboard-subtext">Pose ta question à notre assistant IA 👇</p>

        <Card className="chat-card">
          <div className="chat-window">
            <div className="chat-message ai">Bonjour ! Comment puis-je t'aider ?</div>
            {/* Add more dynamic messages here */}
          </div>
          <div className="chat-input-group">
            <InputText placeholder="Pose ta question ici..." className="chat-input" />
            <Button icon="pi pi-send" className="chat-send-button" />
          </div>
        </Card>
      </motion.div>


    </div>
  );
};

export default ChatBot;
